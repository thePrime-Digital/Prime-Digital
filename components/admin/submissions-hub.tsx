"use client";

import AdminRecordsManager from "@/components/admin/admin-records-manager";

export default function SubmissionsHub() {
  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
            Submissions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage enquiries submitted through the Prime Digital
            School contact form.
          </p>
        </div>

        <div className="mt-5">
          <AdminRecordsManager
            embedded
            resource="contacts"
            title="Contact Enquiries"
            description=""
            columns={[
              {
                label: "Name",
                keys: [
                  "name",
                  "fullName",
                ],
              },
              {
                label: "Email",
                keys: [
                  "email",
                ],
              },
              {
                label: "Phone",
                keys: [
                  "phone",
                ],
              },
              {
                label: "Subject",
                keys: [
                  "subject",
                  "message",
                ],
              },
            ]}
          />
        </div>
      </div>
    </main>
  );
}