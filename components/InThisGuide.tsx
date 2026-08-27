import { IconList } from "@/components/icons";
import type { Section } from "@/lib/article";

/** The contents card. Lists every section, numbered, ending with the FAQ. */
export default function InThisGuide({ sections }: { sections: Section[] }) {
  return (
    <div className="contents-card">
      <h2 className="contents-heading">
        <IconList className="h-[16px] w-[16px]" />
        In This Guide
      </h2>
      <nav className="contents-nav">
        {sections.map((section, i) => (
          <a key={section.id} href={`#${section.id}`} className="contents-link">
            <span className="contents-number">{i + 1}.</span>
            {section.text.replace(/^\d+\.\s*/, "")}
          </a>
        ))}
      </nav>
    </div>
  );
}
