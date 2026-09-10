"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Printer,
} from "lucide-react";

import FeeReceipt from "@/components/fees/fee-receipt";

import type {
  FeeRecord,
} from "@/types/fee";

type ReceiptResponse = {
  fee?: FeeRecord;
  generatedAt?: string;
  error?: string;
};

export default function FeeReceiptPage() {
  useEffect(() => {
    document.body.classList.add("pds-receipt-page");

    return () => {
      document.body.classList.remove("pds-receipt-page");
    };
  }, []);

  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const [
    fee,
    setFee,
  ] =
    useState<
      FeeRecord | null
    >(null);

  const [
    generatedAt,
    setGeneratedAt,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    let cancelled =
      false;

    async function load() {
      setLoading(
        true,
      );

      setError(
        "",
      );

      try {
        const response =
          await fetch(
            `/api/fees/${params.id}/receipt`,
            {
              credentials:
                "include",

              cache:
                "no-store",
            },
          );

        const data =
          (await response
            .json()
            .catch(
              () =>
                null,
            )) as
            | ReceiptResponse
            | null;

        if (
          !response.ok ||
          !data?.fee
        ) {
          throw new Error(
            data?.error ||
              "Unable to load receipt.",
          );
        }

        if (
          !cancelled
        ) {
          setFee(
            data.fee,
          );

          setGeneratedAt(
            data.generatedAt ||
              new Date().toISOString(),
          );
        }
      } catch (
        loadError
      ) {
        if (
          !cancelled
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load receipt.",
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    load();

    return () => {
      cancelled =
        true;
    };
  }, [
    params.id,
  ]);

  return (
    <main className="min-h-screen bg-[#f4f4f5] px-4 py-6 sm:px-6 print:bg-white print:p-0">
      <style
        jsx
        global
      >{`
        body.pds-receipt-page header,
        body.pds-receipt-page footer,
        body.pds-receipt-page nav {
          display: none !important;
        }

        body.pds-receipt-page {
          margin: 0 !important;
          padding: 0 !important;
          background: #f4f4f5 !important;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm;
          }

          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body.pds-receipt-page {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .receipt-toolbar {
            display: none !important;
          }

          main {
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .receipt-sheet {
            width: 200mm !important;
            max-width: 200mm !important;

            margin: 0 auto !important;
            padding: 3mm 4mm !important;

            border: none !important;
            box-shadow: none !important;

            zoom: 0.82;

            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;

            break-before: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
          }

          .receipt-sheet section,
          .receipt-sheet table,
          .receipt-sheet thead,
          .receipt-sheet tbody,
          .receipt-sheet tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="receipt-toolbar mx-auto mb-4 flex w-full max-w-[900px] items-center justify-between gap-3">
        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />

          Back
        </button>

        {fee && (
          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#690019] px-4 text-xs font-black text-white shadow-sm"
          >
            <Printer className="h-4 w-4" />

            Print / Save PDF
          </button>
        )}
      </div>

      {loading ? (
        <div className="mx-auto flex min-h-[500px] max-w-[900px] items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-400">
          Loading receipt...
        </div>
      ) : error ? (
        <div className="mx-auto max-w-[900px] rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : fee ? (
        <FeeReceipt
          fee={
            fee
          }
          generatedAt={
            generatedAt
          }
        />
      ) : null}
    </main>
  );
}