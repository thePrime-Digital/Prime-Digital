import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
} from "lucide-react";

type StaffSectionProps = {
  title: string;
  description: string;
};

export default function StaffSection({
  title,
  description,
}: StaffSectionProps) {
  return (
    <main className="min-h-full bg-[#faf7f5] p-5 sm:p-7 lg:p-9">
      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#8f0024]">
            Prime Digital School / Staff
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#25161b]">
            {title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <section className="rounded-[22px] border border-[#eadfe0] bg-white p-8 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f3] text-[#8f0024]">
            <ClipboardList size={27} />
          </div>

          <h2 className="mt-5 text-lg font-extrabold text-[#25161b]">
            {title}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
            This section is ready for its role-specific features.
            Data will appear here once the relevant API and permissions
            have been connected.
          </p>

          <Link
            href="/staff"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8f0024] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#690019]"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}