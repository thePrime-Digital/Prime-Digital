import {
  ObjectId,
  type Document,
} from "mongodb";

type StudentUserLike = {
  _id: ObjectId;
};

export function studentReferenceValues(
  user: StudentUserLike,
): (ObjectId | string)[] {
  return [
    user._id,
    user._id.toHexString(),
  ];
}

export function objectAndStringValues(
  ids: ObjectId[],
): (ObjectId | string)[] {
  return [
    ...ids,
    ...ids.map(
      (id) =>
        id.toHexString(),
    ),
  ];
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

export function serialiseStudentClass(
  item: Document,
) {
  return {
    id:
      objectIdString(
        item._id,
      ),

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

    deliveryMode:
      String(
        item.deliveryMode ||
          "",
      ),

    status:
      typeof item.status ===
      "string"
        ? item.status
        : "scheduled",
  };
}