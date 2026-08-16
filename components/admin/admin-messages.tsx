"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Archive,
  ArrowLeft,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Reply,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";

type Account = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isCurrentAdmin?: boolean;
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

  readAt: string | null;

  archived: boolean;

  createdAt: string | null;
};

type MessageDirection =
  | "all"
  | "inbox"
  | "sent";

function dateLabel(
  value: string | null,
): string {
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

  return (
    date
      .toISOString()
      .slice(0, 16)
      .replace(
        "T",
        " ",
      ) + " UTC"
  );
}

function getInitials(
  name: string,
): string {
  const words =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[
      words.length - 1
    ][0]
  ).toUpperCase();
}

export default function AdminMessages() {
  const [
    messages,
    setMessages,
  ] =
    useState<
      MessageRecord[]
    >([]);

  const [
    accounts,
    setAccounts,
  ] =
    useState<
      Account[]
    >([]);

  const [
    accountsLoaded,
    setAccountsLoaded,
  ] =
    useState(false);

  const [
    counts,
    setCounts,
  ] = useState({
    inbox: 0,
    sent: 0,
    unread: 0,
  });

  const [
    direction,
    setDirection,
  ] =
    useState<MessageDirection>(
      "all",
    );

  const [
    searchInput,
    setSearchInput,
  ] =
    useState("");

  const [
    search,
    setSearch,
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

  const [
    success,
    setSuccess,
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
    recipientId,
    setRecipientId,
  ] =
    useState("");

  const [
    subject,
    setSubject,
  ] =
    useState("");

  const [
    body,
    setBody,
  ] =
    useState("");

  const loadMessages =
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
              `/api/admin/messages?${params.toString()}`,
              {
                method:
                  "GET",

                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Unable to load messages.",
            );
          }

          setMessages(
            data.messages ||
              [],
          );

          setCounts(
            data.counts || {
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

  const loadAccounts =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              "/api/admin/users?limit=100",
              {
                method:
                  "GET",

                credentials:
                  "include",

                cache:
                  "no-store",
              },
            );

          const data =
            await response.json();

          if (!response.ok) {
            return;
          }

          const availableAccounts =
            (
              data.users ||
              []
            ).filter(
              (
                account:
                  Account,
              ) =>
                !account.isCurrentAdmin &&
                account.status !==
                  "blocked",
            );

          setAccounts(
            availableAccounts,
          );
        } catch {
          // Messages themselves
          // can still load if
          // account loading fails.
        } finally {
          setAccountsLoaded(
            true,
          );
        }
      },
      [],
    );

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  function newMessage() {
    if (
      accounts.length ===
      0
    ) {
      return;
    }

    setRecipientId("");
    setSubject("");
    setBody("");

    setError("");
    setSuccess("");

    setComposeOpen(true);
  }

  function changeDirection(
    value:
      MessageDirection,
  ) {
    setDirection(value);
    setSelected(null);
  }

  function performSearch() {
    setSearch(
      searchInput.trim(),
    );

    setSelected(null);
  }

  function replyTo(
    message:
      MessageRecord,
  ) {
    const recipient =
      accounts.find(
        (account) =>
          account.id ===
            message.senderId ||
          account.id ===
            message.recipientId,
      );

    if (!recipient) {
      setError(
        "The other account could not be selected for reply.",
      );

      return;
    }

    setRecipientId(
      recipient.id,
    );

    setSubject(
      message.subject
        .toLowerCase()
        .startsWith(
          "re:",
        )
        ? message.subject
        : `Re: ${message.subject}`,
    );

    setBody("");

    setSelected(null);

    setComposeOpen(true);
  }

  async function sendMessage() {
    setSending(true);

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          "/api/admin/messages",
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
              JSON.stringify({
                recipientId,
                subject,
                body,
              }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to send message.",
        );
      }

      setComposeOpen(
        false,
      );

      setRecipientId("");
      setSubject("");
      setBody("");

      setSuccess(
        data.message ||
          "Message sent successfully.",
      );

      setDirection(
        "sent",
      );

      setSelected(null);

      await loadMessages();
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

  async function openMessage(
    message:
      MessageRecord,
  ) {
    setSelected(message);

    /*
     * Only incoming messages
     * should be marked as read.
     *
     * Sent admin messages should
     * not be marked read simply
     * because the admin opened them.
     */
    if (
      !message.readAt &&
      message.senderRole !==
        "admin"
    ) {
      try {
        await fetch(
          `/api/admin/messages/${message.id}`,
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

        await loadMessages();
      } catch {
        // Opening the message
        // should still work.
      }
    }
  }

  async function archiveMessage(
    message:
      MessageRecord,
  ) {
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/messages/${message.id}`,
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to archive message.",
        );
      }

      setSelected(null);

      setSuccess(
        "Message archived successfully.",
      );

      await loadMessages();
    } catch (
      archiveError
    ) {
      setError(
        archiveError instanceof
          Error
          ? archiveError.message
          : "Unable to archive message.",
      );
    }
  }

  const totalMessages =
    counts.inbox +
    counts.sent;

  const hasRecipients =
    accounts.length > 0;

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#271a1e]">
              Messages
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Communicate directly
              with registered
              students, faculty and
              clients.
            </p>
          </div>

          <button
            type="button"
            onClick={
              newMessage
            }
            disabled={
              !accountsLoaded ||
              !hasRecipients
            }
            title={
              accountsLoaded &&
              !hasRecipients
                ? "Create or approve another account before sending messages."
                : undefined
            }
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[11px] font-black text-white shadow-sm transition hover:bg-[#71001c] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />

            New Message
          </button>
        </div>

        {/* ===================================================
            METRICS
        =================================================== */}

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric
            icon={Inbox}
            label="Inbox"
            value={
              counts.inbox
            }
            note="Received messages"
          />

          <Metric
            icon={Mail}
            label="Unread"
            value={
              counts.unread
            }
            note="Needs attention"
          />

          <Metric
            icon={Send}
            label="Sent"
            value={
              counts.sent
            }
            note="Messages sent"
          />
        </section>

        {error &&
          !composeOpen && (
            <Alert error>
              {error}
            </Alert>
          )}

        {success && (
          <Alert>
            {success}
          </Alert>
        )}

        {/* ===================================================
            MESSAGES PANEL
        =================================================== */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TOOLBAR */}

          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              {/* TABS */}

              <div className="flex shrink-0 gap-1 rounded-xl bg-slate-100 p-1">
                <FilterButton
                  active={
                    direction ===
                    "all"
                  }
                  onClick={() =>
                    changeDirection(
                      "all",
                    )
                  }
                  label="All"
                  count={
                    totalMessages
                  }
                />

                <FilterButton
                  active={
                    direction ===
                    "inbox"
                  }
                  onClick={() =>
                    changeDirection(
                      "inbox",
                    )
                  }
                  label="Inbox"
                  count={
                    counts.inbox
                  }
                />

                <FilterButton
                  active={
                    direction ===
                    "sent"
                  }
                  onClick={() =>
                    changeDirection(
                      "sent",
                    )
                  }
                  label="Sent"
                  count={
                    counts.sent
                  }
                />
              </div>

              {/* SEARCH */}

              <div className="flex min-w-0 flex-1 gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={
                      searchInput
                    }
                    onChange={(
                      event,
                    ) =>
                      setSearchInput(
                        event.target
                          .value,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        performSearch();
                      }
                    }}
                    placeholder="Search by name, subject or message..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-4 text-[10px] font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024]/30 focus:bg-white focus:ring-4 focus:ring-[#8f0024]/5"
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    performSearch
                  }
                  className="hidden h-10 rounded-lg bg-[#8f0024] px-5 text-[10px] font-black text-white transition hover:bg-[#71001c] sm:block"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={() =>
                    loadMessages()
                  }
                  aria-label="Refresh messages"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#8f0024]/20 hover:text-[#8f0024]"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="flex min-h-[480px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#8f0024]" />

                <p className="mt-3 text-[10px] font-semibold text-slate-400">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : messages.length ===
            0 ? (
            /* =================================================
               INTENTIONAL EMPTY STATE
            ================================================= */

            <div className="flex min-h-[480px] items-center justify-center px-6 py-12">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                  <MessageSquare className="h-7 w-7" />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
                  Prime Digital
                  Communication
                </p>

                <h2 className="mt-2 text-lg font-black text-[#271a1e]">
                  {search
                    ? "No matching messages"
                    : "No conversations yet"}
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-slate-400">
                  {search
                    ? "No conversations match your current search. Try another name, subject or keyword."
                    : hasRecipients
                      ? "Start your first conversation with a student, faculty member or client."
                      : "There are currently no student, faculty or client accounts available to message. Create or approve an account first."}
                </p>

                {search ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSearchInput("");
                    }}
                    className="mt-5 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-[9px] font-black text-slate-600 transition hover:border-[#8f0024]/20 hover:text-[#8f0024]"
                  >
                    Clear Search
                  </button>
                ) : hasRecipients ? (
                  <button
                    type="button"
                    onClick={
                      newMessage
                    }
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[9px] font-black text-white transition hover:bg-[#71001c]"
                  >
                    <Plus className="h-3.5 w-3.5" />

                    Start Conversation
                  </button>
                ) : (
                  <a
                    href="/admin/users"
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[9px] font-black text-white transition hover:bg-[#71001c]"
                  >
                    <Users className="h-3.5 w-3.5" />

                    Open Account Directory
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* =================================================
               MESSAGE LIST + READING PANEL
            ================================================= */

            <div className="grid min-h-[560px] md:grid-cols-[340px_minmax(0,1fr)]">
              {/* LEFT MESSAGE LIST */}

              <aside
                className={[
                  "border-slate-200 md:border-r",

                  selected
                    ? "hidden md:block"
                    : "block",
                ].join(" ")}
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Conversations
                    </p>

                    <span className="rounded-full bg-[#fff1f4] px-2 py-1 text-[8px] font-black text-[#8f0024]">
                      {
                        messages.length
                      }
                    </span>
                  </div>
                </div>

                <div className="max-h-[520px] overflow-y-auto">
                  {messages.map(
                    (
                      message,
                    ) => {
                      const outgoing =
                        message.senderRole ===
                        "admin";

                      const personName =
                        outgoing
                          ? message.recipientName
                          : message.senderName;

                      const personRole =
                        outgoing
                          ? message.recipientRole
                          : message.senderRole;

                      const unread =
                        !outgoing &&
                        !message.readAt;

                      const isSelected =
                        selected?.id ===
                        message.id;

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
                            "block w-full border-b border-slate-100 px-4 py-4 text-left transition",

                            isSelected
                              ? "bg-[#fff5f7]"
                              : "hover:bg-[#fffafb]",
                          ].join(
                            " ",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[9px] font-black text-[#8f0024]">
                              {getInitials(
                                personName,
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p
                                  className={[
                                    "min-w-0 flex-1 truncate text-[10px] text-slate-700",

                                    unread
                                      ? "font-black"
                                      : "font-bold",
                                  ].join(
                                    " ",
                                  )}
                                >
                                  {personName}
                                </p>

                                {unread && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#8f0024]" />
                                )}
                              </div>

                              <p className="mt-0.5 text-[8px] font-bold capitalize text-slate-400">
                                {outgoing
                                  ? "Sent to"
                                  : "From"}{" "}
                                {
                                  personRole
                                }
                              </p>

                              <p
                                className={[
                                  "mt-2 truncate text-[10px] text-slate-700",

                                  unread
                                    ? "font-black"
                                    : "font-semibold",
                                ].join(
                                  " ",
                                )}
                              >
                                {
                                  message.subject
                                }
                              </p>

                              <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-400">
                                {
                                  message.body
                                }
                              </p>

                              <p className="mt-2 text-[8px] font-medium text-slate-400">
                                {dateLabel(
                                  message.createdAt,
                                )}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              </aside>

              {/* RIGHT READING PANEL */}

              <section
                className={[
                  "min-w-0",

                  selected
                    ? "block"
                    : "hidden md:block",
                ].join(" ")}
              >
                {selected ? (
                  <div className="flex min-h-[560px] flex-col">
                    {/* MESSAGE HEADER */}

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                      <button
                        type="button"
                        onClick={() =>
                          setSelected(
                            null,
                          )
                        }
                        className="mb-4 inline-flex items-center gap-1 text-[9px] font-black text-[#8f0024] md:hidden"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />

                        Back to Messages
                      </button>

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#fff1f4] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#8f0024]">
                              {selected.senderRole ===
                              "admin"
                                ? "Sent"
                                : "Received"}
                            </span>

                            {!selected.readAt &&
                              selected.senderRole !==
                                "admin" && (
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-700">
                                  New
                                </span>
                              )}
                          </div>

                          <h2 className="mt-3 break-words text-xl font-black leading-7 text-[#271a1e]">
                            {
                              selected.subject
                            }
                          </h2>

                          <div className="mt-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f4] text-[9px] font-black text-[#8f0024]">
                              {getInitials(
                                selected.senderName,
                              )}
                            </div>

                            <div>
                              <p className="text-[10px] font-black text-slate-700">
                                {
                                  selected.senderName
                                }
                              </p>

                              <p className="mt-0.5 text-[9px] text-slate-400">
                                {
                                  selected.senderEmail
                                }
                              </p>
                            </div>
                          </div>

                          <p className="mt-3 text-[9px] text-slate-400">
                            To{" "}
                            <strong className="text-slate-600">
                              {
                                selected.recipientName
                              }
                            </strong>

                            {" · "}

                            {dateLabel(
                              selected.createdAt,
                            )}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              replyTo(
                                selected,
                              )
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-black text-slate-600 transition hover:border-[#8f0024]/25 hover:text-[#8f0024]"
                          >
                            <Reply className="h-3.5 w-3.5" />

                            Reply
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              archiveMessage(
                                selected,
                              )
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-black text-slate-600 transition hover:border-red-200 hover:text-red-600"
                          >
                            <Archive className="h-3.5 w-3.5" />

                            Archive
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* MESSAGE BODY */}

                    <div className="flex-1 px-5 py-7 sm:px-7">
                      <div className="max-w-3xl whitespace-pre-wrap break-words text-[12px] leading-7 text-slate-700">
                        {
                          selected.body
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[560px] items-center justify-center p-8">
                    <div className="max-w-sm text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                        <Mail className="h-7 w-7" />
                      </div>

                      <h2 className="mt-4 text-sm font-black text-slate-700">
                        Select a
                        conversation
                      </h2>

                      <p className="mt-2 text-[10px] leading-5 text-slate-400">
                        Choose a message
                        from the left to
                        read the complete
                        conversation.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          COMPOSE MODAL
      ===================================================== */}

      {composeOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4">
          <button
            type="button"
            aria-label="Close compose message"
            className="absolute inset-0"
            onClick={() =>
              setComposeOpen(
                false,
              )
            }
          />

          <section className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
                  Communication
                </p>

                <h2 className="mt-1 text-xl font-black text-[#271a1e]">
                  New Message
                </h2>

                <p className="mt-1 text-[9px] text-slate-400">
                  Send a direct
                  message to a
                  registered account.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() =>
                  setComposeOpen(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* RECIPIENT */}

              <div>
                <label className="mb-2 block text-[10px] font-black text-slate-700">
                  Recipient
                </label>

                <select
                  value={
                    recipientId
                  }
                  onChange={(
                    event,
                  ) =>
                    setRecipientId(
                      event.target
                        .value,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                >
                  <option value="">
                    Select recipient...
                  </option>

                  {accounts.map(
                    (
                      account,
                    ) => (
                      <option
                        key={
                          account.id
                        }
                        value={
                          account.id
                        }
                      >
                        {account.name} —{" "}
                        {account.role} —{" "}
                        {account.email}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* SUBJECT */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-700">
                    Subject
                  </label>

                  <span className="text-[8px] text-slate-400">
                    {subject.length}
                    /150
                  </span>
                </div>

                <input
                  value={
                    subject
                  }
                  maxLength={150}
                  onChange={(
                    event,
                  ) =>
                    setSubject(
                      event.target
                        .value,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                  placeholder="Enter message subject"
                />
              </div>

              {/* MESSAGE BODY */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-700">
                    Message
                  </label>

                  <span className="text-[8px] text-slate-400">
                    {body.length}
                    /5000
                  </span>
                </div>

                <textarea
                  value={body}
                  maxLength={5000}
                  onChange={(
                    event,
                  ) =>
                    setBody(
                      event.target
                        .value,
                    )
                  }
                  rows={8}
                  className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8f0024]/40 focus:ring-4 focus:ring-[#8f0024]/5"
                  placeholder="Write your message..."
                />
              </div>

              {error && (
                <Alert error>
                  {error}
                </Alert>
              )}

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setComposeOpen(
                      false,
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    sendMessage
                  }
                  disabled={
                    sending ||
                    !recipientId ||
                    subject
                      .trim()
                      .length < 2 ||
                    !body.trim()
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white transition hover:bg-[#71001c] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}

                  {sending
                    ? "Sending..."
                    : "Send Message"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon:
    typeof Inbox;

  label: string;
  value: number;
  note: string;
}) {
  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-[#271a1e]">
            {value}
          </p>

          <p className="mt-2 text-[9px] text-slate-400">
            {note}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f4] text-[#8f0024] transition group-hover:bg-[#8f0024] group-hover:text-white">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;

  onClick: () => void;

  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-8 min-w-[72px] items-center justify-center gap-1.5 rounded-lg px-3 text-[9px] font-black transition",

        active
          ? "bg-white text-[#8f0024] shadow-sm"
          : "text-slate-500 hover:text-slate-700",
      ].join(" ")}
    >
      {label}

      <span
        className={[
          "rounded-full px-1.5 py-0.5 text-[7px] font-black",

          active
            ? "bg-[#fff1f4] text-[#8f0024]"
            : "bg-white/70 text-slate-400",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

function Alert({
  error = false,
  children,
}: {
  error?: boolean;
  children:
    ReactNode;
}) {
  return (
    <div
      className={[
        "mt-5 rounded-lg border px-4 py-3 text-xs font-semibold",

        error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {children}
    </div>
  );
}