export type CatalogResource =
  | "programs"
  | "classes";

export type CatalogFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select";

export type CatalogField = {
  key: string;
  label: string;
  type: CatalogFieldType;
  required?: boolean;
  options?: string[];
};

export type CatalogConfig = {
  resource: CatalogResource;
  collection: string;
  statuses: string[];
  defaultStatus: string;
  searchFields: string[];
  fields: CatalogField[];
};

const configs: Record<
  CatalogResource,
  CatalogConfig
> = {
  programs: {
    resource: "programs",

    collection:
      "programs",

    statuses: [
      "draft",
      "active",
      "archived",
    ],

    defaultStatus:
      "draft",

    searchFields: [
      "title",
      "category",
      "level",
      "duration",
      "deliveryMode",
      "description",
    ],

    fields: [
      {
        key: "title",
        label: "Program Name",
        type: "text",
        required: true,
      },
      {
        key: "category",
        label: "Category",
        type: "text",
        required: true,
      },
      {
        key: "duration",
        label: "Duration",
        type: "text",
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
      },
    ],
  },

  classes: {
    resource: "classes",

    collection:
      "classes",

    statuses: [
      "scheduled",
      "active",
      "completed",
      "cancelled",
    ],

    defaultStatus:
      "scheduled",

    searchFields: [
      "name",
      "program",
      "faculty",
      "schedule",
      "room",
      "deliveryMode",
    ],

    fields: [
      {
        key: "name",
        label: "Class Name",
        type: "text",
        required: true,
      },
      {
        key: "program",
        label: "Program",
        type: "text",
        required: true,
      },
      {
        key: "faculty",
        label: "Faculty",
        type: "text",
      },
      {
        key: "schedule",
        label: "Schedule",
        type: "text",
      },
      {
        key: "room",
        label: "Room / Meeting Location",
        type: "text",
      },
      {
        key: "capacity",
        label: "Student Capacity",
        type: "number",
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
      },
    ],
  },
};

export function getCatalogConfig(
  resource: string,
): CatalogConfig | null {
  if (
    resource === "programs" ||
    resource === "classes"
  ) {
    return configs[resource];
  }

  return null;
}
