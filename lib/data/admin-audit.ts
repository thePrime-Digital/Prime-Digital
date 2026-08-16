import { ObjectId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";

type AuditChange = {
  field: string;
  from?: unknown;
  to?: unknown;
};

type CreateAdminAuditLogInput = {
  actorId: string;
  actorEmail: string;
  action: string;
  targetUserId?: string;
  targetEmail?: string;
  changes?: AuditChange[];
};

export async function createAdminAuditLog(
  input: CreateAdminAuditLogInput,
): Promise<void> {
  try {
    const database = await getDatabase();

    const collection = database.collection(
      "admin_audit_logs",
    );

    await collection.insertOne({
      actorId: ObjectId.isValid(input.actorId)
        ? new ObjectId(input.actorId)
        : input.actorId,

      actorEmail: input.actorEmail,

      action: input.action,

      targetUserId:
        input.targetUserId &&
        ObjectId.isValid(input.targetUserId)
          ? new ObjectId(input.targetUserId)
          : input.targetUserId || null,

      targetEmail:
        input.targetEmail || null,

      changes: input.changes || [],

      createdAt: new Date(),
    });
  } catch (error) {
    // Audit logging should never prevent
    // the main admin action from completing.
    console.error(
      "Admin audit log error:",
      error,
    );
  }
}
