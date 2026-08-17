import {
  ObjectId,
  type Document,
  type Filter,
} from "mongodb";

type FacultyUserLike = {
  _id: ObjectId;
  name: string;
  email: string;
};

export function escapeFacultyRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

export function getFacultyClassFilter(
  user: FacultyUserLike,
): Filter<Document> {
  const facultyId =
    user._id.toHexString();

  const escapedName =
    escapeFacultyRegex(
      user.name,
    );

  const escapedEmail =
    escapeFacultyRegex(
      user.email,
    );

  return {
    $or: [
      {
        facultyId:
          user._id,
      },

      {
        facultyId,
      },

      {
        facultyEmail:
          user.email,
      },

      {
        faculty: {
          $regex:
            `^${escapedName}$`,

          $options:
            "i",
        },
      },

      {
        faculty: {
          $regex:
            `^${escapedEmail}$`,

          $options:
            "i",
        },
      },
    ],
  };
}

export function getFacultyReferenceFilter(
  user: FacultyUserLike,
): Filter<Document> {
  return {
    $or: [
      {
        facultyId:
          user._id,
      },

      {
        facultyId:
          user._id.toHexString(),
      },
    ],
  };
}

export function getClassReferenceFilter(
  classIds: ObjectId[],
): Filter<Document> {
  const stringIds =
    classIds.map(
      (id) =>
        id.toHexString(),
    );

  return {
    $or: [
      {
        classId: {
          $in:
            classIds,
        },
      },

      {
        classId: {
          $in:
            stringIds,
        },
      },
    ],
  };
}

export function objectIdString(
  value: unknown,
): string {
  if (
    value instanceof
    ObjectId
  ) {
    return value.toHexString();
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return "";
}

export function serialiseClass(
  item: Document,
) {
  return {
    id:
      item._id.toHexString(),

    name:
      String(
        item.name ||
          "Untitled Class",
      ),

    program:
      String(
        item.program ||
          "",
      ),

    faculty:
      String(
        item.faculty ||
          item.facultyName ||
          "",
      ),

    schedule:
      String(
        item.schedule ||
          "",
      ),

    room:
      String(
        item.room ||
          "",
      ),

    capacity:
      typeof item.capacity ===
      "number"
        ? item.capacity
        : null,

    deliveryMode:
      String(
        item.deliveryMode ||
          "",
      ),

    notes:
      String(
        item.notes ||
          "",
      ),

    status:
      typeof item.status ===
      "string"
        ? item.status
        : "scheduled",

    createdAt:
      item.createdAt instanceof
      Date
        ? item.createdAt.toISOString()
        : item.createdAt ||
          null,

    updatedAt:
      item.updatedAt instanceof
      Date
        ? item.updatedAt.toISOString()
        : item.updatedAt ||
          null,
  };
}
