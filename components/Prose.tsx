export default function Prose({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="hero">
        <div className="kicker kicker-hero">{kicker}</div>
        <h1 className="hero-title"><span>{title}</span></h1>
      </section>
      <div className="wrap article prose">{children}</div>
    </>
  );
}
