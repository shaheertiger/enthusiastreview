import { SITE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="wordmark wordmark-dark">
          enthusiast<span>review</span>
        </div>
        <p>
          Independent GPU and CPU pairing guides. We match graphics cards to processors so you only pay for frames you
          will actually get.
        </p>
        <ul className="footer-links">
          <li><a href="/">Bottleneck finder</a></li>
          <li><a href="/methodology/">How we test</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/affiliate-disclosure/">Affiliate disclosure</a></li>
          <li><a href="/privacy/">Privacy</a></li>
        </ul>
        <p className="footer-fine">
          © {new Date(SITE.updated).getFullYear()} {SITE.name}. As an Amazon Associate we earn from qualifying purchases.
          Product names are trademarks of their owners.
        </p>
      </div>
    </footer>
  );
}
