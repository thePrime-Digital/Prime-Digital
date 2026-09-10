"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  FileText,
  Loader2,
  UploadCloud,
} from "lucide-react";

type CareerJobOption = {
  id: string;
  title: string;
  department: string;
  location: string;
};

type CareerApplicationFormProps = {
  jobs:
    CareerJobOption[];
};

type ApplicationResult = {
  reference: string;
  jobTitle: string;
};

const EMPTY_FORM = {
  jobId:
    "",

  fullName:
    "",

  email:
    "",

  phone:
    "",

  city:
    "",

  experience:
    "",

  linkedin:
    "",

  portfolio:
    "",

  coverLetter:
    "",

  consent:
    false,
};

export default function CareerApplicationForm({
  jobs,
}: CareerApplicationFormProps) {
  const [
    form,
    setForm,
  ] =
    useState(
      EMPTY_FORM,
    );

  const [
    cv,
    setCv,
  ] =
    useState<
      File | null
    >(null);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false,
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    result,
    setResult,
  ] =
    useState<
      ApplicationResult | null
    >(null);

  const selectedJob =
    useMemo(
      () =>
        jobs.find(
          (
            job,
          ) =>
            job.id ===
            form.jobId,
        ) ||
        null,
      [
        jobs,
        form.jobId,
      ],
    );

  useEffect(() => {
    function handleSelected(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          jobId?: string;
        }>;

      const jobId =
        customEvent.detail
          ?.jobId;

      if (
        !jobId ||
        !jobs.some(
          (
            job,
          ) =>
            job.id ===
            jobId,
        )
      ) {
        return;
      }

      setForm(
        (
          current,
        ) => ({
          ...current,

          jobId,
        }),
      );

      setResult(
        null,
      );

      setError("");
    }

    window.addEventListener(
      "career-job-selected",
      handleSelected,
    );

    return () => {
      window.removeEventListener(
        "career-job-selected",
        handleSelected,
      );
    };
  }, [
    jobs,
  ]);

  function reset() {
    setForm(
      EMPTY_FORM,
    );

    setCv(
      null,
    );

    setError("");

    setResult(
      null,
    );
  }

  async function submitApplication() {
    setError("");

    if (
      !form.jobId
    ) {
      setError(
        "Please select the position you are applying for.",
      );

      return;
    }

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.city.trim()
    ) {
      setError(
        "Please complete all required contact details.",
      );

      return;
    }

    if (!cv) {
      setError(
        "Please upload your CV or resume.",
      );

      return;
    }

    if (
      !form.consent
    ) {
      setError(
        "Please confirm the application consent.",
      );

      return;
    }

    setSubmitting(
      true,
    );

    try {
      const data =
        new FormData();

      data.append(
        "jobId",
        form.jobId,
      );

      data.append(
        "fullName",
        form.fullName,
      );

      data.append(
        "email",
        form.email,
      );

      data.append(
        "phone",
        form.phone,
      );

      data.append(
        "city",
        form.city,
      );

      data.append(
        "experience",
        form.experience,
      );

      data.append(
        "linkedin",
        form.linkedin,
      );

      data.append(
        "portfolio",
        form.portfolio,
      );

      data.append(
        "coverLetter",
        form.coverLetter,
      );

      data.append(
        "consent",
        String(
          form.consent,
        ),
      );

      /*
       * Hidden honeypot.
       */
      data.append(
        "website",
        "",
      );

      data.append(
        "cv",
        cv,
      );

      const response =
        await fetch(
          "/api/careers/applications",
          {
            method:
              "POST",

            body:
              data,

            cache:
              "no-store",
          },
        );

      const payload =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          payload.error ||
            "Unable to submit application.",
        );
      }

      setResult({
        reference:
          String(
            payload.reference ||
              "",
          ),

        jobTitle:
          String(
            payload.jobTitle ||
              selectedJob?.title ||
              "",
          ),
      });

      setCv(
        null,
      );
    } catch (
      submitError
    ) {
      setError(
        submitError instanceof
          Error
          ? submitError.message
          : "Unable to submit application.",
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  return (
    <section
      id="apply"
      className="scroll-mt-28 px-5 py-16 sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-[1220px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-[#8f0024] p-8 text-white sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
            Apply Today
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Ready to join our team?
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/80">
            Submit your application and our recruitment team will review your profile.
          </p>

          {selectedJob && (
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/60">
                Applying For
              </p>

              <p className="mt-2 text-lg font-black">
                {selectedJob.title}
              </p>

              <p className="mt-2 text-xs text-white/70">
                {selectedJob.department}
                {" • "}
                {selectedJob.location}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-4 text-sm text-white/85">
            <p>
              📍 Vashi, Navi Mumbai
            </p>

            <p>
              ✉ careers@primedigital.school
            </p>

            <p>
              ☎ +91 88504 47887
            </p>
          </div>
        </div>

        {result ? (
          <div className="flex items-center justify-center p-8 sm:p-10">
            <div className="w-full max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                Application Submitted
              </p>

              <h3 className="mt-2 text-2xl font-black text-[#101828]">
                Thank you for applying.
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#667085]">
                Your application for{" "}
                <span className="font-black text-[#101828]">
                  {result.jobTitle}
                </span>{" "}
                has been received by Prime Digital School.
              </p>

              <div className="mt-6 rounded-xl border border-[#eadada] bg-[#fffafb] p-5">
                <p className="text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
                  Application Reference
                </p>

                <p className="mt-2 break-all text-lg font-black text-[#101828]">
                  {result.reference}
                </p>
              </div>

              <p className="mt-4 text-xs leading-6 text-[#667085]">
                Keep this reference for future communication regarding your application.
              </p>

              <button
                type="button"
                onClick={
                  reset
                }
                className="mt-6 rounded-lg border border-[#8f0024]/20 px-5 py-3 text-xs font-black text-[#8f0024]"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-8 sm:p-10">
            <div>
              <label className="mb-2 block text-[10px] font-black text-[#475467]">
                Position *
              </label>

              <select
                value={
                  form.jobId
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      jobId:
                        event.target
                          .value,
                    }),
                  )
                }
                className="h-12 w-full rounded-lg border border-[#d8c4c6] bg-white px-4 text-sm outline-none focus:border-[#8f0024]"
              >
                <option value="">
                  Select Position
                </option>

                {jobs.map(
                  (
                    job,
                  ) => (
                    <option
                      key={
                        job.id
                      }
                      value={
                        job.id
                      }
                    >
                      {job.title}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={
                  form.fullName
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      fullName:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Full Name *"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024]"
              />

              <input
                type="email"
                value={
                  form.email
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      email:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Email Address *"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="tel"
                value={
                  form.phone
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      phone:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Phone Number *"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024]"
              />

              <input
                value={
                  form.city
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      city:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="City *"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024]"
              />
            </div>

            <input
              value={
                form.experience
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    experience:
                      event.target
                        .value,
                  }),
                )
              }
              placeholder="Experience e.g. 2 years"
              className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024]"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="url"
                value={
                  form.linkedin
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      linkedin:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="LinkedIn URL"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024]"
              />

              <input
                type="url"
                value={
                  form.portfolio
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      portfolio:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Portfolio / GitHub URL"
                className="h-12 rounded-lg border border-[#d8c4c6] px-4 text-sm outline-none focus:border-[#8f0024]"
              />
            </div>

            <textarea
              rows={5}
              value={
                form.coverLetter
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    coverLetter:
                      event.target
                        .value,
                  }),
                )
              }
              placeholder="Tell us why you would like to join Prime Digital School..."
              className="resize-y rounded-lg border border-[#d8c4c6] p-4 text-sm leading-7 outline-none focus:border-[#8f0024]"
            />

            <div>
              <p className="mb-2 text-[10px] font-black text-[#475467]">
                CV / Resume *
              </p>

              <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-[#8f0024]/20 bg-[#fffafb] p-5 transition hover:border-[#8f0024]/40">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024]">
                  {cv ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <UploadCloud className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-[#101828]">
                    {cv
                      ? cv.name
                      : "Upload your CV"}
                  </p>

                  <p className="mt-1 text-[9px] text-[#667085]">
                    PDF, DOC or DOCX • Maximum 4 MB
                  </p>
                </div>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(
                    event,
                  ) => {
                    const file =
                      event.target
                        .files?.[0] ||
                      null;

                    if (
                      file &&
                      file.size >
                        4 *
                          1024 *
                          1024
                    ) {
                      setError(
                        "CV must be smaller than 4 MB.",
                      );

                      event.target.value =
                        "";

                      return;
                    }

                    setCv(
                      file,
                    );

                    setError("");
                  }}
                />
              </label>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#fffafb] p-4">
              <input
                type="checkbox"
                checked={
                  form.consent
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      consent:
                        event.target
                          .checked,
                    }),
                  )
                }
                className="mt-0.5 h-4 w-4 accent-[#8f0024]"
              />

              <span className="text-[10px] leading-5 text-[#667085]">
                I confirm that the information provided is accurate and consent to Prime Digital School processing my application for recruitment purposes.
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={
                submitting ||
                jobs.length ===
                  0
              }
              onClick={() =>
                void submitApplication()
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#8f0024] text-sm font-black text-white transition hover:bg-[#70001c] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}