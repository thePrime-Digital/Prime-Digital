"use client";

type CareerApplyButtonProps = {
  jobId: string;
};

export default function CareerApplyButton({
  jobId,
}: CareerApplyButtonProps) {
  function handleApply() {
    window.dispatchEvent(
      new CustomEvent(
        "career-job-selected",
        {
          detail: {
            jobId,
          },
        },
      ),
    );

    document
      .getElementById("apply")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      className="mt-6 inline-flex w-fit rounded-lg bg-[#8f0024] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#70001c]"
    >
      Apply Now
    </button>
  );
}