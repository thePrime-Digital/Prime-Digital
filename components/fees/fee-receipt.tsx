"use client";

import type { FeeRecord } from "@/types/fee";

function money(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function shortDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function printDate(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function wordsBelowThousand(input: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  let number = input;

  const words: string[] = [];

  if (number >= 100) {
    words.push(`${ones[Math.floor(number / 100)]} Hundred`);

    number %= 100;
  }

  if (number >= 20) {
    words.push(tens[Math.floor(number / 10)]);

    number %= 10;
  }

  if (number > 0) {
    words.push(ones[number]);
  }

  return words.join(" ");
}

function amountInWords(input: number): string {
  let number = Math.round(input);

  if (number === 0) {
    return "Zero Rupees Only";
  }

  const groups = [
    {
      value: 10000000,
      name: "Crore",
    },
    {
      value: 100000,
      name: "Lakh",
    },
    {
      value: 1000,
      name: "Thousand",
    },
  ];

  const words: string[] = [];

  for (const group of groups) {
    if (number >= group.value) {
      const quantity = Math.floor(number / group.value);

      words.push(`${wordsBelowThousand(quantity)} ${group.name}`);

      number %= group.value;
    }
  }

  if (number > 0) {
    words.push(wordsBelowThousand(number));
  }

  return `${words.join(" ")} Rupees Only`;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[145px_1fr] gap-3 border-b border-[#8f0024]/20 px-3 py-2 text-[12px] last:border-b-0">
      <span className="font-black text-[#8f0024]">{label}</span>

      <span className="font-bold text-slate-900">{value || "—"}</span>
    </div>
  );
}

export default function FeeReceipt({
  fee,
  generatedAt,
}: {
  fee: FeeRecord;
  generatedAt: string;
}) {
  const latestPayment = fee.payments[fee.payments.length - 1];

  return (
    <div className="receipt-sheet mx-auto w-full max-w-[900px] bg-white p-5 text-[#202124]">
      <div className="flex items-center justify-between gap-6 border-b-2 border-[#8f0024] pb-3">
        <div className="flex items-center">
          <img
            src="/pds-assets/pds-logo.png"
            alt="Prime Digital School"
            className="h-auto max-h-[72px] w-auto max-w-[300px] object-contain"
          />
        </div>

        <div className="text-right">
          <h1 className="text-[26px] font-black uppercase tracking-[0.04em] text-[#202124]">
            FEE RECEIPT
          </h1>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 overflow-hidden rounded-md border border-[#8f0024]/30 sm:grid-cols-2">
        <Field label="Receipt No." value={fee.receiptNo} />

        <Field
          label="Receipt Date"
          value={shortDate(fee.receiptIssuedAt || fee.updatedAt)}
        />
      </div>

      <section className="mt-3">
        <h2 className="bg-[#8f0024] px-3 py-2 text-[11px] font-black tracking-[0.08em] text-white">
          STUDENT DETAILS
        </h2>

        <div className="grid grid-cols-1 border-x border-b border-[#8f0024]/30 sm:grid-cols-2">
          <Field label="Student Name" value={fee.studentName} />

          <Field label="Parent Name" value={fee.parentName} />

          <Field label="Class / Board" value={fee.classBoard} />

          <Field label="Enrollment No." value={fee.enrollmentNo} />

          <Field label="Academic Year" value={fee.academicYear} />

          <Field label="Payment Mode" value={latestPayment?.mode || "—"} />

          <Field label="Mobile No." value={fee.studentPhone} />

          <Field label="Invoice ID" value={fee.invoiceId} />
        </div>
      </section>

      <section className="mt-3">
        <h2 className="bg-[#8f0024] px-3 py-2 text-[11px] font-black tracking-[0.08em] text-white">
          FEE DETAILS
        </h2>

        <div className="overflow-x-auto border-x border-b border-[#8f0024]/30">
          <table className="min-w-[720px] w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#fff4f6] text-left font-black text-[#8f0024]">
                <th className="border-r border-[#8f0024]/20 px-3 py-2">
                  Sr. No.
                </th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">
                  Particulars
                </th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">
                  Month
                </th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">
                  Due Date
                </th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">
                  Amount
                </th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">Paid</th>

                <th className="px-3 py-2">Balance</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-[#8f0024]/20 font-semibold text-slate-800">
                <td className="border-r border-[#8f0024]/20 px-3 py-2">1</td>

                <td className="border-r border-[#8f0024]/20 px-3 py-2">
                  {fee.particulars}
                </td>

                <td className="border-r border-[#8f0024]/20 px-3 py-2">
                  {fee.month}
                </td>

                <td className="border-r border-[#8f0024]/20 px-3 py-2">
                  {shortDate(fee.dueDate)}
                </td>

                <td className="border-r border-[#8f0024]/20 px-3 py-2 font-black">
                  {money(fee.amount)}
                </td>

                <td className="border-r border-[#8f0024]/20 px-3 py-2 font-black">
                  {money(fee.paid)}
                </td>

                <td className="px-3 py-2 font-black">{money(fee.balance)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-x border-b border-[#8f0024]/30 px-3 py-2 text-[12px]">
          <span className="font-black text-[#8f0024]">Amount in Words : </span>

          <span className="font-black text-slate-900">
            {amountInWords(fee.paid)}
          </span>
        </div>
      </section>

      <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] font-bold sm:grid-cols-3">
        <div className="rounded-md bg-[#fff4f6] px-3 py-2">
          <span className="text-[#8f0024]">Payment Status : </span>

          <span className="uppercase text-slate-900">{fee.status}</span>
        </div>

        <div className="rounded-md bg-[#fff4f6] px-3 py-2">
          <span className="text-[#8f0024]">Total Paid : </span>

          <span className="text-slate-900">{money(fee.paid)}</span>
        </div>

        <div className="rounded-md bg-[#fff4f6] px-3 py-2">
          <span className="text-[#8f0024]">Balance Due : </span>

          <span className="text-slate-900">{money(fee.balance)}</span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-between gap-3 border-b border-[#8f0024]/20 pb-3 text-[10px] font-semibold text-slate-600">
        <span>
          <strong className="text-[#8f0024]">Due Date :</strong>{" "}
          {shortDate(fee.dueDate)}
        </span>

        <span>
          <strong className="text-[#8f0024]">Print Date :</strong>{" "}
          {printDate(generatedAt)}
        </span>
      </div>

      <section className="mt-3">
        <h2 className="bg-[#8f0024] px-3 py-2 text-[11px] font-black tracking-[0.08em] text-white">
          PAYMENT HISTORY
        </h2>

        <div className="overflow-x-auto border-x border-b border-[#8f0024]/30">
          <table className="min-w-[650px] w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#fff4f6] text-left font-black text-[#8f0024]">
                <th className="border-r border-[#8f0024]/20 px-3 py-2">#</th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">Date</th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">
                  Amount
                </th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">Mode</th>

                <th className="border-r border-[#8f0024]/20 px-3 py-2">
                  Transaction Ref
                </th>

                <th className="px-3 py-2">Bank</th>
              </tr>
            </thead>

            <tbody>
              {fee.payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className="border-t border-[#8f0024]/20 font-semibold text-slate-800"
                >
                  <td className="border-r border-[#8f0024]/20 px-3 py-2">
                    {index + 1}
                  </td>

                  <td className="border-r border-[#8f0024]/20 px-3 py-2">
                    {shortDate(payment.date)}
                  </td>

                  <td className="border-r border-[#8f0024]/20 px-3 py-2 font-black">
                    {money(payment.amount)}
                  </td>

                  <td className="border-r border-[#8f0024]/20 px-3 py-2">
                    {payment.mode}
                  </td>

                  <td className="border-r border-[#8f0024]/20 px-3 py-2">
                    {payment.transactionRef || "—"}
                  </td>

                  <td className="px-3 py-2">{payment.bank || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-3 border-t border-[#8f0024]/20 pt-3 text-center">
        <p className="text-[10px] font-semibold text-slate-600">
          This is a computer-generated receipt and does not require a physical
          signature.
        </p>

        <p className="mt-3 text-[11px] font-black uppercase tracking-[0.06em] text-[#8f0024]">
          FEES ONCE PAID ARE NON-REFUNDABLE UNDER ANY CIRCUMSTANCES.
        </p>

        <p className="mt-3 text-[11px] font-bold text-slate-700">
          Thank you for choosing Prime Digital School.
          <br />
          We appreciate your trust.
        </p>
      </div>

      <div className="mt-5 flex justify-end">
        <div className="w-[250px] text-center text-[11px]">
          <div className="mb-1 flex h-[85px] items-end justify-center">
            <img
              src="/pds-assets/founder-sign.png"
              alt="Authorized Signature"
              className="max-h-[78px] max-w-[190px] object-contain"
            />
          </div>

          <div className="border-t border-slate-700 pt-2 font-bold">
            Authorized Signatory
          </div>

          <p className="mt-1 font-black text-[#8f0024]">Prime Digital School</p>
        </div>
      </div>

      <div className="mt-3 border-t-2 border-[#8f0024] pt-2 text-center text-[10px] font-bold text-[#8f0024]">
        Prime Digital School | Learn • Build • Technology
      </div>
    </div>
  );
}
