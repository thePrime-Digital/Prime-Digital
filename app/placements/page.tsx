import type { Metadata } from "next";
import PlacementsPageContent from "@/components/placements/placements-page-content";

export const metadata: Metadata = {
  title: "Placements | Prime Digital School",
  description:
    "Explore career pathways and student profile examples across six professional programmes at Prime Digital School.",
};

export default function PlacementsPage() {
  return <PlacementsPageContent />;
}
