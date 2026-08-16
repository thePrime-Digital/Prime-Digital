import CatalogManager from "@/components/admin/catalog-manager";

export default function AdminClassesPage() {
  return (
    <CatalogManager
      resource="classes"
      title="Classes"
      description="Create and manage class batches, schedules, faculty assignments and capacity."
      createLabel="Create Class"
      fields={[
        {
          key: "name",
          label: "Class Name",
          type: "text",
          required: true,
          placeholder: "e.g. Web Development Batch A",
        },
        {
          key: "program",
          label: "Program",
          type: "text",
          required: true,
          placeholder: "e.g. Web Development Pro",
        },
        {
          key: "faculty",
          label: "Faculty",
          type: "text",
          placeholder: "Faculty name",
        },
        {
          key: "schedule",
          label: "Schedule",
          type: "text",
          placeholder: "Mon, Wed, Fri - 4:00 PM",
        },
        {
          key: "room",
          label: "Room / Meeting Location",
          type: "text",
          placeholder: "Room 201 or Online",
        },
        {
          key: "capacity",
          label: "Student Capacity",
          type: "number",
          placeholder: "30",
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
          key: "notes",
          label: "Class Notes",
          type: "textarea",
          placeholder: "Internal class information...",
        },
      ]}
      columns={[
        {
          label: "Class",
          key: "name",
        },
        {
          label: "Program",
          key: "program",
        },
        {
          label: "Faculty",
          key: "faculty",
        },
        {
          label: "Schedule",
          key: "schedule",
        },
        {
          label: "Capacity",
          key: "capacity",
        },
      ]}
    />
  );
}
