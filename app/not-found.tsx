import Prose from "@/components/Prose";

export default function NotFound() {
  return (
    <Prose kicker="404" title="Page not found">
      <section className="sec sec-first">
        <p>That page doesn&apos;t exist. Try the <a href="/">GPU bottleneck finder</a> and pick your CPU.</p>
      </section>
    </Prose>
  );
}
