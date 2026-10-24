import { redirect } from "next/navigation";
export default function CareersPage() {
  redirect("/job-connect?tab=careers");
}