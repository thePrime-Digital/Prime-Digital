import AccountDirectory from "@/components/admin/account-directory";

export default function AdminClientsPage() {
  return (
    <AccountDirectory
      initialRole="client"
      lockRole
      title="Client Management"
      description="Manage Prime Digital Solutions client accounts and access."
    />
  );
}
