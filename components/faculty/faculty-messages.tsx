"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Archive,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

type Recipient = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type MessageRecord = {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  subject: string;
  body: string;

  readAt:
    | string
    | null;

  createdAt:
    | string
    | null;
};

function formatDate(
  value:
    | string
    | null,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return date.toLocaleString();
}

export default function FacultyMessages() {
  const [
    messages,
    setMessages,
  ] =
    useState<
      MessageRecord[]
    >([]);

  const [
    recipients,
    setRecipients,
  ] =
    useState<
      Recipient[]
    >([]);

  const [
    counts,
    setCounts,
  ] =
    useState({
      inbox: 0,
      sent: 0,
      unread: 0,
    });

  const [
    direction,
    setDirection,
  ] =
    useState(
      "all",
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    selected,
    setSelected,
  ] =
    useState<
      MessageRecord | null
    >(null);

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

  const [
    composeOpen,
    setComposeOpen,
  ] =
    useState(false);

  const [
    sending,
    setSending,
  ] =
    useState(false);

  const [
    form,
    setForm,
  ] =
    useState({
      recipientId:
        "",
      subject:
        "",
      body:
        "",
    });

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const params =
            new URLSearchParams();

          params.set(
            "direction",
            direction,
          );

          if (search) {
            params.set(
              "search",
              search,
            );
          }

          const response =
            await fetch(
              `/api/faculty/messages?${params.toString()}`,
              {
                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const payload =
            await response.json();

          if (!response.ok) {
            throw new Error(
              payload.error ||
                "Unable to load messages.",
            );
          }

          setMessages(
            payload.messages ||
              [],
          );

          setRecipients(
            payload.recipients ||
              [],
          );

          setCounts(
            payload.counts || {
              inbox: 0,
              sent: 0,
              unread: 0,
            },
          );
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load messages.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        direction,
        search,
      ],
    );

  useEffect(() => {
    load();
  }, [load]);

  async function openMessage(
    message:
      MessageRecord,
  ) {
    setSelected(
      message,
    );

    if (
      !message.readAt &&
      message.senderRole !==
        "faculty"
    ) {
      await fetch(
        `/api/faculty/messages/${message.id}`,
        {
          method:
            "PATCH",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              action:
                "read",
            }),
        },
      );

      load();
    }
  }

  async function sendMessage() {
    setSending(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/faculty/messages",
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                form,
              ),
          },
        );

      const payload =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to send message.",
        );
      }

      setComposeOpen(
        false,
      );

      setForm({
        recipientId:
          "",
        subject:
          "",
        body:
          "",
      });

      setDirection(
        "sent",
      );

      await load();
    } catch (
      sendError
    ) {
      setError(
        sendError instanceof
          Error
          ? sendError.message
          : "Unable to send message.",
      );
    } finally {
      setSending(false);
    }
  }

  async function archive(
    message:
      MessageRecord,
  ) {
    await fetch(
      `/api/faculty/messages/${message.id}`,
      {
        method:
          "PATCH",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            action:
              "archive",
          }),
      },
    );

    setSelected(null);

    load();
  }

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Faculty Communication
            </p>

            <h1 className="mt-1 text-2xl font-black text-[#281b1f]">
              Messages
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Communicate with students
              and administration.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setComposeOpen(
                true,
              )
            }
            disabled={
              recipients.length ===
              0
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[9px] font-black text-white disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            New Message
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row">
            <div className="flex rounded-lg bg-slate-100 p-1">
              {[
                "all",
                "inbox",
                "sent",
              ].map(
                (
                  item,
                ) => (
                  <button
                    key={
                      item
                    }
                    type="button"
                    onClick={() => {
                      setDirection(
                        item,
                      );

                      setSelected(
                        null,
                      );
                    }}
                    className={[
                      "h-8 min-w-[80px] rounded-md px-3 text-[8px] font-black capitalize",

                      direction ===
                      item
                        ? "bg-white text-[#8f0024] shadow-sm"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {item}

                    {item ===
                      "inbox" &&
                      ` (${counts.inbox})`}

                    {item ===
                      "sent" &&
                      ` (${counts.sent})`}
                  </button>
                ),
              )}
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={
                  search
                }
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search conversations..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-[10px] outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[530px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
            </div>
          ) : messages.length ===
            0 ? (
            <div className="flex min-h-[530px] items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                  <MessageSquare className="h-7 w-7" />
                </div>

                <h2 className="mt-4 text-sm font-black text-slate-700">
                  No conversations yet
                </h2>

                <p className="mt-2 max-w-sm text-[9px] leading-5 text-slate-400">
                  Messages from students or
                  administration will appear
                  here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[530px] md:grid-cols-[330px_1fr]">
              <aside className="border-r border-slate-100">
                <div className="max-h-[530px] overflow-y-auto">
                  {messages.map(
                    (
                      message,
                    ) => {
                      const outgoing =
                        message.senderRole ===
                        "faculty";

                      const name =
                        outgoing
                          ? message.recipientName
                          : message.senderName;

                      return (
                        <button
                          key={
                            message.id
                          }
                          type="button"
                          onClick={() =>
                            openMessage(
                              message,
                            )
                          }
                          className={[
                            "block w-full border-b border-slate-100 p-4 text-left",

                            selected?.id ===
                            message.id
                              ? "bg-[#fff5f7]"
                              : "hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[10px] font-black text-slate-700">
                              {name}
                            </p>

                            {!outgoing &&
                              !message.readAt && (
                                <span className="h-2 w-2 rounded-full bg-[#8f0024]" />
                              )}
                          </div>

                          <p className="mt-2 truncate text-[9px] font-bold text-slate-600">
                            {
                              message.subject
                            }
                          </p>

                          <p className="mt-1 line-clamp-2 text-[8px] leading-4 text-slate-400">
                            {
                              message.body
                            }
                          </p>
                        </button>
                      );
                    },
                  )}
                </div>
              </aside>

              <section className="flex items-center justify-center p-6">
                {selected ? (
                  <div className="w-full max-w-3xl">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-[#8f0024]">
                          Message
                        </p>

                        <h2 className="mt-2 text-xl font-black text-[#281b1f]">
                          {
                            selected.subject
                          }
                        </h2>

                        <p className="mt-2 text-[9px] text-slate-400">
                          {selected.senderName} →{" "}
                          {
                            selected.recipientName
                          }
                        </p>

                        <p className="mt-1 text-[8px] text-slate-400">
                          {formatDate(
                            selected.createdAt,
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          archive(
                            selected,
                          )
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-[8px] font-black text-slate-600"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </button>
                    </div>

                    <p className="whitespace-pre-wrap py-7 text-[11px] leading-7 text-slate-700">
                      {
                        selected.body
                      }
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Mail className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-4 text-[10px] font-black text-slate-600">
                      Select a conversation
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </div>

      {composeOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() =>
              setComposeOpen(
                false,
              )
            }
          />

          <section className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#8f0024]">
                  Faculty Communication
                </p>

                <h2 className="mt-1 text-xl font-black text-[#281b1f]">
                  New Message
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setComposeOpen(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <select
                value={
                  form.recipientId
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      recipientId:
                        event.target
                          .value,
                    }),
                  )
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
              >
                <option value="">
                  Select recipient...
                </option>

                {recipients.map(
                  (
                    recipient,
                  ) => (
                    <option
                      key={
                        recipient.id
                      }
                      value={
                        recipient.id
                      }
                    >
                      {recipient.name} — {recipient.role}
                    </option>
                  ),
                )}
              </select>

              <input
                value={
                  form.subject
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      subject:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Subject"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs"
              />

              <textarea
                rows={7}
                value={
                  form.body
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      body:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Write message..."
                className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs leading-5"
              />

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[9px] font-bold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={
                  sendMessage
                }
                disabled={
                  sending ||
                  !form.recipientId ||
                  !form.subject.trim() ||
                  !form.body.trim()
                }
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8f0024] text-[9px] font-black text-white disabled:bg-slate-300"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}

                Send Message
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
