import AdminRecordsManager from "@/components/admin/admin-records-manager";

export default function AdminAdmissionsPage() {
  return (
    <AdminRecordsManager
      variant="admissions"
      resource="admissions"
      title="Admission Enquiries"
      description="Manage admission and course enrolment enquiries, review applicant details, track counselling follow-ups, and update application decisions."
      columns={[
        {
          label: "Applicant",
          keys: ["studentName", "fullName", "name"],
        },
        {
          label: "Email",
          keys: ["email"],
        },
        {
          label: "Phone",
          keys: ["phone", "mobile"],
        },
        {
          label: "Selected Course / Program",
          keys: ["program", "course", "programName"],
        },
        {
          label: "Academic Level",
          keys: ["grade", "standard", "academicLevel"],
        },
        {
          label: "Status",
          keys: ["status"],
        },
        {
          label: "Submitted On",
          keys: ["createdAt", "submittedAt"],
        },
      ]}
    />
  );
}
