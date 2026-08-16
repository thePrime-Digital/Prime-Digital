import AdminRecordsManager from "@/components/admin/admin-records-manager";

export default function AdminAdmissionsPage() {
  return (
    <AdminRecordsManager
      variant="admissions"
      resource="admissions"
      title="Admissions"
      description="Review incoming admission applications, track follow-ups and record decisions."
      columns={[
        {
          label: "Applicant",
          keys: [
            "name",
            "fullName",
            "studentName",
          ],
        },

        {
          label: "Email",
          keys: ["email"],
        },

        {
          label: "Phone",
          keys: [
            "phone",
            "mobile",
          ],
        },

        {
          label: "Program",
          keys: [
            "program",
            "course",
            "programName",
          ],
        },
      ]}
    />
  );
}