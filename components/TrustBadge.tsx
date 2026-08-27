import { IconCheck } from "@/components/icons";

/** Required in the hero of every article page. */
export default function TrustBadge() {
  return (
    <span className="trust-badge">
      <IconCheck className="h-[13px] w-[13px]" />
      Independent testing &middot; No paid placements
    </span>
  );
}
