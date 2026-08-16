import CatalogManager from "@/components/admin/catalog-manager";

export default function AdminProgramsPage() {
  return (
    <CatalogManager
      resource="programs"
      title="Programs"
      description="Create and manage Prime Digital School programs, course information and availability."
      createLabel="Create Program"
      fields={[
        {
          key: "title",
          label: "Program Name",
          type: "text",
          required: true,
          placeholder: "e.g. Web Development Pro",
        },
        {
          key: "category",
          label: "Category",
          type: "text",
          required: true,
          placeholder: "e.g. Technology",
        },
        {
          key: "duration",
          label: "Duration",
          type: "text",
          placeholder: "e.g. 12 Weeks",
        },
        {
          key: "level",
          label: "Level",
          type: "select",
          options: [
            "Beginner",
            "Intermediate",
            "Advanced",
            "All Levels",
          ],
        },
        {
          key: "deliveryMode",
          label: "Delivery Mode",
          type: "select",
          options: [
            "Online",
            "Offline",
            "Hybrid",
          ],
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Describe this program...",
        },
      ]}
      columns={[
        {
          label: "Program",
          key: "title",
        },
        {
          label: "Category",
          key: "category",
        },
        {
          label: "Duration",
          key: "duration",
        },
        {
          label: "Level",
          key: "level",
        },
        {
          label: "Mode",
          key: "deliveryMode",
        },
      ]}
    />
  );
}
