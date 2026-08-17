import {
  Construction,
} from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export default function DashboardSectionPlaceholder({
  title,
  description,
}: Props) {
  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8f0024]">
            Prime Digital School
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
            {title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <div className="mt-7 flex min-h-[430px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="max-w-md px-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f4] text-[#8f0024]">
              <Construction className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-lg font-black text-slate-900">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This module is ready for its detailed design and functionality.
              Authentication and dashboard navigation are already connected.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
