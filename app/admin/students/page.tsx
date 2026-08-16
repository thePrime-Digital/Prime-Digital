import AccountDirectory from "@/components/admin/account-directory";

export default function AdminStudentsPage() {
  return (
    <AccountDirectory
      initialRole="student"
      lockRole
      title="Student Management"
      description="Search, create and manage student accounts, access and account details."
    />
  );
}
