#!/usr/bin/env python3
"""One-off transform: restructures the raw article HTML (stored as JSON strings in
app/<slug>/article.ts) into semantically richer markup — product cards, star-bar
ratings, pros/cons grids, accordion FAQs, numbered step cards, callouts, and a
related-guides card grid — so the new design system in globals.css has real
hooks to style instead of generic prose. Safe to re-run; it always starts from a
fresh parse of the stored HTML.
"""
import json
import re
import glob
from bs4 import BeautifulSoup, NavigableString, Tag

POSITIVE_BADGES = {"best overall", "best value", "best budget", "best budget cooler", "best budget aio"}


def slugify(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s or "section"


def ensure_ids(soup):
    seen = set()
    for h2 in soup.find_all("h2"):
        if not h2.get("id"):
            h2["id"] = slugify(h2.get_text())
        base = h2["id"]
        i = 2
        while h2["id"] in seen:
            h2["id"] = f"{base}-{i}"
            i += 1
        seen.add(h2["id"])


def badge_class(label):
    label = label.lower()
    if "overall" in label:
        return "badge-overall"
    if "value" in label:
        return "badge-value"
    if "budget" in label:
        return "badge-budget"
    if "premium" in label or "high-end" in label or "flagship" in label:
        return "badge-premium"
    if "quiet" in label:
        return "badge-quiet"
    return "badge-default"


def make_rating_html(soup, score):
    pct = max(0, min(100, round(score / 5 * 100)))
    wrap = soup.new_tag("div", attrs={"class": "rating"})
    bar = soup.new_tag("div", attrs={"class": "rating-track"})
    fill = soup.new_tag("div", attrs={"class": "rating-fill"})
    fill["style"] = f"width:{pct}%"
    bar.append(fill)
    score_span = soup.new_tag("span", attrs={"class": "rating-score"})
    score_span.string = f"{score:.1f}/5"
    wrap.append(bar)
    wrap.append(score_span)
    return wrap


def collect_until(start_tag, stop_names):
    """Yield siblings after start_tag until hitting a tag whose name is in stop_names."""
    node = start_tag.find_next_sibling()
    out = []
    while node is not None and not (isinstance(node, Tag) and node.name in stop_names):
        nxt = node.find_next_sibling()
        out.append(node)
        node = nxt
    return out


def transform_product_cards(soup):
    top_h2 = None
    for h2 in soup.find_all("h2"):
        txt = h2.get_text().lower()
        if h2.get("id") == "top-picks" or ("top pick" in txt):
            top_h2 = h2
            break
    if not top_h2:
        return

    product_h3s = []
    for node in collect_until(top_h2, ["h2"]):
        if isinstance(node, Tag) and node.name == "h3" and re.match(r"^#?\d+\.", node.get_text().strip()):
            product_h3s.append(node)

    for h3 in product_h3s:
        m = re.match(r"^#?(\d+)\.\s*(.+?)\s*—\s*(.+)$", h3.get_text().strip())
        if not m:
            continue
        rank, name, badge_label = m.group(1), m.group(2), m.group(3)

        body_nodes = collect_until(h3, ["h2", "h3"])

        card = soup.new_tag("div", attrs={"class": "product-card", "id": f"pick-{rank}"})
        head = soup.new_tag("div", attrs={"class": "product-card-head"})
        rank_el = soup.new_tag("div", attrs={"class": "product-rank"})
        rank_el.string = f"#{rank}"
        title_wrap = soup.new_tag("div", attrs={"class": "product-title-wrap"})
        title_el = soup.new_tag("h3", attrs={"class": "product-name"})
        title_el.string = name
        badge_el = soup.new_tag("span", attrs={"class": f"badge {badge_class(badge_label)}"})
        badge_el.string = badge_label
        title_wrap.append(title_el)
        title_wrap.append(badge_el)
        head.append(rank_el)
        head.append(title_wrap)
        card.append(head)

        body = soup.new_tag("div", attrs={"class": "product-card-body"})
        pros_cons_grid = None
        uls_seen = 0
        cta_done = False

        for node in body_nodes:
            if not isinstance(node, Tag):
                continue
            text = node.get_text().strip()

            if node.name == "p" and re.match(r"^Editor'?s Rating:\s*([\d.]+)", text):
                score = float(re.match(r"^Editor'?s Rating:\s*([\d.]+)", text).group(1))
                body.append(make_rating_html(soup, score))
                continue

            if node.name == "p" and text.lower().startswith("cons:"):
                continue  # label absorbed into the Cons column heading

            if node.name == "ul":
                uls_seen += 1
                if pros_cons_grid is None:
                    pros_cons_grid = soup.new_tag("div", attrs={"class": "pros-cons-grid"})
                    body.append(pros_cons_grid)
                col = soup.new_tag("div", attrs={"class": "pros-col" if uls_seen == 1 else "cons-col"})
                label = soup.new_tag("h4")
                label.string = "Pros" if uls_seen == 1 else "Cons"
                node["class"] = node.get("class", []) + (["pros-list"] if uls_seen == 1 else ["cons-list"])
                col.append(label)
                col.append(node.extract())
                pros_cons_grid.append(col)
                continue

            if node.name == "p" and text.lower().startswith("bottom line"):
                node["class"] = node.get("class", []) + ["bottom-line-box"]
                body.append(node.extract())
                continue

            if node.name == "p" and node.find("a") and not cta_done:
                link = node.find("a")
                link["class"] = link.get("class", []) + ["cta-button"]
                node["class"] = node.get("class", []) + ["cta-wrap"]
                body.append(node.extract())
                cta_done = True
                continue

            if node.name == "p":
                node["class"] = node.get("class", []) + ["product-narrative"]

            body.append(node.extract())

        card.append(body)
        h3.insert_after(card)
        h3.extract()


def transform_faq(soup):
    faq_h2 = soup.find("h2", id="faq") or next(
        (h for h in soup.find_all("h2") if "frequently asked" in h.get_text().lower()), None
    )
    if not faq_h2:
        return
    nodes = collect_until(faq_h2, ["h2"])
    i = 0
    while i < len(nodes):
        node = nodes[i]
        if isinstance(node, Tag) and node.name == "h3":
            question = node.get_text()
            answer_nodes = []
            j = i + 1
            while j < len(nodes) and not (isinstance(nodes[j], Tag) and nodes[j].name == "h3"):
                answer_nodes.append(nodes[j])
                j += 1
            details = soup.new_tag("details", attrs={"class": "faq-item"})
            summary = soup.new_tag("summary")
            summary.string = question
            details.append(summary)
            answer_wrap = soup.new_tag("div", attrs={"class": "faq-answer"})
            for a in answer_nodes:
                answer_wrap.append(a.extract())
            details.append(answer_wrap)
            node.insert_after(details)
            node.extract()
            i = j
        else:
            i += 1


def transform_steps(soup):
    for h3 in soup.find_all("h3"):
        m = re.match(r"^Step\s+(\d+):\s*(.+)$", h3.get_text().strip())
        if not m:
            continue
        num, title = m.group(1), m.group(2)
        body_nodes = collect_until(h3, ["h2", "h3"])
        card = soup.new_tag("div", attrs={"class": "step-card"})
        num_el = soup.new_tag("div", attrs={"class": "step-number"})
        num_el.string = num
        content = soup.new_tag("div", attrs={"class": "step-content"})
        title_el = soup.new_tag("h3", attrs={"class": "step-title"})
        title_el.string = title
        content.append(title_el)
        for node in body_nodes:
            content.append(node.extract())
        card.append(num_el)
        card.append(content)
        h3.insert_after(card)
        h3.extract()


def transform_callouts(soup):
    for p in soup.find_all("p"):
        strong = p.find("strong")
        if not strong:
            continue
        text = strong.get_text().strip()
        kind = None
        if re.match(r"^Tip[:\s]", text, re.I):
            kind = "tip"
        elif re.match(r"^(Important|Warning)[:\s]", text, re.I):
            kind = "warning"
        elif re.match(r"^Note[:\s]", text, re.I):
            kind = "note"
        if kind and "bottom-line-box" not in p.get("class", []):
            p["class"] = p.get("class", []) + ["callout", f"callout-{kind}"]


def transform_tables(soup):
    for wrap in soup.find_all("div"):
        if wrap.get("style") and "overflow-x" in wrap.get("style", ""):
            del wrap["style"]
            wrap["class"] = wrap.get("class", []) + ["table-wrap"]
    for table in soup.find_all("table"):
        table["class"] = table.get("class", []) + ["compare-table"]


def transform_toc(soup):
    toc_h2 = soup.find("h2", id="toc") or next(
        (h for h in soup.find_all("h2") if h.get_text().strip().lower() == "table of contents"), None
    )
    if not toc_h2:
        return
    ul = toc_h2.find_next_sibling("ul")
    if not ul:
        return
    details = soup.new_tag("details", attrs={"class": "toc-mobile"})
    summary = soup.new_tag("summary")
    summary.string = "Table of Contents"
    details.append(summary)
    details.append(ul.extract())
    toc_h2.insert_after(details)
    toc_h2.extract()


def transform_related(soup):
    h2 = soup.find("h2", id="related-guides") or next(
        (h for h in soup.find_all("h2") if "related guides" in h.get_text().lower()), None
    )
    if not h2:
        return
    ul = h2.find_next_sibling("ul")
    if not ul:
        return
    grid = soup.new_tag("div", attrs={"class": "related-grid"})
    for li in ul.find_all("li"):
        a = li.find("a")
        if not a:
            continue
        a["class"] = a.get("class", []) + ["related-card"]
        grid.append(a.extract())
    ul.insert_after(grid)
    ul.extract()


def transform_bottom_line(soup):
    h2 = soup.find("h2", id="bottom-line") or next(
        (h for h in soup.find_all("h2") if h.get_text().strip().lower() in ("the bottom line", "bottom line")),
        None,
    )
    if not h2:
        return
    nodes = collect_until(h2, ["h2"])
    box = soup.new_tag("div", attrs={"class": "closing-box"})
    for n in nodes:
        box.append(n.extract())
    h2.insert_after(box)


def process(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    prefix = "export const articleHtml = "
    html = json.loads(text[len(prefix):-2])

    soup = BeautifulSoup(html, "html.parser")
    ensure_ids(soup)
    transform_tables(soup)
    transform_product_cards(soup)
    transform_steps(soup)
    transform_faq(soup)
    transform_callouts(soup)
    transform_related(soup)
    transform_bottom_line(soup)
    transform_toc(soup)

    out_html = str(soup)
    with open(path, "w", encoding="utf-8") as f:
        f.write(prefix + json.dumps(out_html) + ";\n")
    print("enriched:", path)


for path in sorted(glob.glob("app/*/article.ts")):
    process(path)
