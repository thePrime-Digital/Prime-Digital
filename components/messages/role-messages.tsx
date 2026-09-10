"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

type PortalRole =
  | "student"
  | "faculty";

type Direction =
  | "all"
  | "inbox"
  | "sent";

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

type Counts = {
  inbox: number;
  sent: number;
  unread: number;
};

type Conversation = {
  id: string;

  counterpartId: string;
  counterpartName: string;
  counterpartEmail: string;
  counterpartRole: string;

  messages:
    MessageRecord[];

  latest:
    MessageRecord;

  unread: number;

  hasInbox: boolean;
  hasSent: boolean;
};

type RoleMessagesProps = {
  role: PortalRole;
  eyebrow: string;
  description: string;
};

function timestamp(
  value:
    | string
    | null,
): number {
  if (!value) {
    return 0;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 0;
  }

  return date.getTime();
}

function formatDate(
  value:
    | string
    | null,
): string {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
}

function formatShortDate(
  value:
    | string
    | null,
): string {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  );
}

function initials(
  name: string,
): string {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length ===
    0
  ) {
    return "?";
  }

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(
        0,
        2,
      )
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length -
        1
    ][0]
  ).toUpperCase();
}

function roleLabel(
  role: string,
): string {
  if (!role) {
    return "Member";
  }

  return (
    role
      .charAt(0)
      .toUpperCase() +
    role.slice(1)
  );
}

function replySubject(
  value: string,
): string {
  const subject =
    value.trim();

  if (!subject) {
    return "Conversation";
  }

  if (
    subject
      .toLowerCase()
      .startsWith(
        "re:",
      )
  ) {
    return subject;
  }

  return `Re: ${subject}`;
}

function buildConversations(
  messages:
    MessageRecord[],
  role:
    PortalRole,
): Conversation[] {
  const map =
    new Map<
      string,
      {
        counterpartId: string;
        counterpartName: string;
        counterpartEmail: string;
        counterpartRole: string;

        messages:
          MessageRecord[];

        unread:
          number;

        hasInbox:
          boolean;

        hasSent:
          boolean;
      }
    >();

  for (
    const message
    of messages
  ) {
    const outgoing =
      message.senderRole ===
      role;

    const counterpartId =
      outgoing
        ? message.recipientId
        : message.senderId;

    if (
      !counterpartId
    ) {
      continue;
    }

    const counterpartName =
      outgoing
        ? message.recipientName
        : message.senderName;

    const counterpartEmail =
      outgoing
        ? message.recipientEmail
        : message.senderEmail;

    const counterpartRole =
      outgoing
        ? message.recipientRole
        : message.senderRole;

    const current =
      map.get(
        counterpartId,
      ) || {
        counterpartId,
        counterpartName:
          counterpartName ||
          "User",

        counterpartEmail:
          counterpartEmail ||
          "",

        counterpartRole:
          counterpartRole ||
          "",

        messages:
          [],

        unread:
          0,

        hasInbox:
          false,

        hasSent:
          false,
      };

    current.messages.push(
      message,
    );

    if (outgoing) {
      current.hasSent =
        true;
    } else {
      current.hasInbox =
        true;

      if (
        !message.readAt
      ) {
        current.unread +=
          1;
      }
    }

    map.set(
      counterpartId,
      current,
    );
  }

  return Array.from(
    map.values(),
  )
    .map(
      (
        item,
      ) => {
        const sorted =
          [...item.messages].sort(
            (
              first,
              second,
            ) =>
              timestamp(
                first.createdAt,
              ) -
              timestamp(
                second.createdAt,
              ),
          );

        return {
          id:
            item.counterpartId,

          counterpartId:
            item.counterpartId,

          counterpartName:
            item.counterpartName,

          counterpartEmail:
            item.counterpartEmail,

          counterpartRole:
            item.counterpartRole,

          messages:
            sorted,

          latest:
            sorted[
              sorted.length -
                1
            ],

          unread:
            item.unread,

          hasInbox:
            item.hasInbox,

          hasSent:
            item.hasSent,
        };
      },
    )
    .sort(
      (
        first,
        second,
      ) =>
        timestamp(
          second.latest
            .createdAt,
        ) -
        timestamp(
          first.latest
            .createdAt,
        ),
    );
}

export default function RoleMessages({
  role,
  eyebrow,
  description,
}: RoleMessagesProps) {
  const apiPath =
    role ===
    "faculty"
      ? "/api/faculty/messages"
      : "/api/student/messages";

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
    useState<Counts>({
      inbox:
        0,

      sent:
        0,

      unread:
        0,
    });

  const [
    direction,
    setDirection,
  ] =
    useState<Direction>(
      "all",
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    selectedConversationId,
    setSelectedConversationId,
  ] =
    useState<
      string | null
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
    success,
    setSuccess,
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
    replying,
    setReplying,
  ] =
    useState(false);

  const [
    reply,
    setReply,
  ] =
    useState("");

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

  const threadRef =
    useRef<HTMLDivElement>(
      null,
    );

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError("");

        try {
          /*
           * Always request all messages.
           * Inbox / Sent filtering is done client-side
           * so the full conversation remains visible.
           */
          const response =
            await fetch(
              `${apiPath}?direction=all`,
              {
                credentials:
                  "include",

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
              inbox:
                0,

              sent:
                0,

              unread:
                0,
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
          setLoading(
            false,
          );
        }
      },
      [
        apiPath,
      ],
    );

  useEffect(() => {
    void load();
  }, [
    load,
  ]);

  const conversations =
    useMemo(
      () =>
        buildConversations(
          messages,
          role,
        ),
      [
        messages,
        role,
      ],
    );

  const filteredConversations =
    useMemo(
      () => {
        const needle =
          search
            .trim()
            .toLowerCase();

        return conversations.filter(
          (
            conversation,
          ) => {
            if (
              direction ===
                "inbox" &&
              !conversation.hasInbox
            ) {
              return false;
            }

            if (
              direction ===
                "sent" &&
              !conversation.hasSent
            ) {
              return false;
            }

            if (!needle) {
              return true;
            }

            const searchable =
              [
                conversation.counterpartName,
                conversation.counterpartEmail,
                conversation.counterpartRole,

                ...conversation.messages.flatMap(
                  (
                    message,
                  ) => [
                    message.subject,
                    message.body,
                  ],
                ),
              ]
                .join(
                  " ",
                )
                .toLowerCase();

            return searchable.includes(
              needle,
            );
          },
        );
      },
      [
        conversations,
        direction,
        search,
      ],
    );

  const selectedConversation =
    useMemo(
      () =>
        conversations.find(
          (
            conversation,
          ) =>
            conversation.id ===
            selectedConversationId,
        ) ||
        null,
      [
        conversations,
        selectedConversationId,
      ],
    );

  useEffect(() => {
    if (
      selectedConversationId &&
      !filteredConversations.some(
        (
          conversation,
        ) =>
          conversation.id ===
          selectedConversationId,
      )
    ) {
      setSelectedConversationId(
        null,
      );
    }
  }, [
    filteredConversations,
    selectedConversationId,
  ]);

  useEffect(() => {
    const element =
      threadRef.current;

    if (!element) {
      return;
    }

    element.scrollTop =
      element.scrollHeight;
  }, [
    selectedConversationId,
    selectedConversation
      ?.messages.length,
  ]);

  function isOutgoing(
    message:
      MessageRecord,
  ): boolean {
    return (
      message.senderRole ===
      role
    );
  }

  async function markMessageRead(
    message:
      MessageRecord,
  ) {
    if (
      isOutgoing(
        message,
      ) ||
      message.readAt
    ) {
      return;
    }

    if (
      role ===
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

      return;
    }

    await fetch(
      "/api/student/messages",
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
            messageId:
              message.id,
          }),
      },
    );
  }

  async function selectConversation(
    conversation:
      Conversation,
  ) {
    setSelectedConversationId(
      conversation.id,
    );

    setReply("");
    setError("");
    setSuccess("");

    const unread =
      conversation.messages.filter(
        (
          message,
        ) =>
          !isOutgoing(
            message,
          ) &&
          !message.readAt,
      );

    if (
      unread.length ===
      0
    ) {
      return;
    }

    try {
      await Promise.all(
        unread.map(
          (
            message,
          ) =>
            markMessageRead(
              message,
            ),
        ),
      );

      await load();
    } catch {
      // Reading a message should not block the conversation.
    }
  }

  async function postMessage({
    recipientId,
    subject,
    body,
  }: {
    recipientId: string;
    subject: string;
    body: string;
  }) {
    const response =
      await fetch(
        apiPath,
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

    const payload =
      await response.json();

    if (
      !response.ok
    ) {
      throw new Error(
        payload.error ||
          "Unable to send message.",
      );
    }

    return payload;
  }

  async function sendNewMessage() {
    if (
      !form.recipientId ||
      !form.subject.trim() ||
      !form.body.trim()
    ) {
      return;
    }

    setSending(
      true,
    );

    setError("");
    setSuccess("");

    const targetId =
      form.recipientId;

    try {
      await postMessage({
        recipientId:
          targetId,

        subject:
          form.subject.trim(),

        body:
          form.body.trim(),
      });

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
        "all",
      );

      setSearch("");

      setSelectedConversationId(
        targetId,
      );

      setSuccess(
        "Message sent successfully.",
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
      setSending(
        false,
      );
    }
  }

  async function sendReply() {
    if (
      !selectedConversation ||
      !reply.trim()
    ) {
      return;
    }

    setReplying(
      true,
    );

    setError("");
    setSuccess("");

    try {
      await postMessage({
        recipientId:
          selectedConversation.counterpartId,

        subject:
          replySubject(
            selectedConversation.latest.subject,
          ),

        body:
          reply.trim(),
      });

      setReply("");

      setSuccess(
        "Reply sent.",
      );

      await load();
    } catch (
      replyError
    ) {
      setError(
        replyError instanceof
          Error
          ? replyError.message
          : "Unable to send reply.",
      );
    } finally {
      setReplying(
        false,
      );
    }
  }

  const canReply =
    selectedConversation
      ? recipients.some(
          (
            recipient,
          ) =>
            recipient.id ===
            selectedConversation.counterpartId,
        )
      : false;

  return (
    <main className="p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <header>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8f0024]">
                {eyebrow}
              </p>

              {counts.unread >
                0 && (
                <span className="rounded-full bg-[#fff1f4] px-2 py-1 text-[8px] font-black text-[#8f0024]">
                  {
                    counts.unread
                  }{" "}
                  unread
                </span>
              )}
            </div>

            <h1 className="mt-1 text-2xl font-black text-[#271a1e]">
              Messages
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </header>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");

              setComposeOpen(
                true,
              );
            }}
            disabled={
              recipients.length ===
              0
            }
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white shadow-sm transition hover:bg-[#76001e] disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />

            New Message
          </button>
        </div>

        {error &&
          !composeOpen && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[610px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#8f0024]" />
            </div>
          ) : messages.length ===
            0 ? (
            <div className="flex min-h-[520px] items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                  <MessageSquare className="h-7 w-7" />
                </div>

                <h2 className="mt-4 text-sm font-black text-slate-800">
                  No conversations yet
                </h2>

                <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
                  Start a new message and your conversations will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[610px] md:grid-cols-[330px_minmax(0,1fr)]">
              <aside className="border-b border-slate-100 md:border-b-0 md:border-r">
                <div className="border-b border-slate-100 p-4">
                  <div className="relative">
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
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs outline-none transition focus:border-[#8f0024]/30 focus:bg-white"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-3 rounded-xl bg-slate-100 p-1">
                    <FilterButton
                      active={
                        direction ===
                        "all"
                      }
                      onClick={() =>
                        setDirection(
                          "all",
                        )
                      }
                      label="All"
                      count={
                        messages.length
                      }
                    />

                    <FilterButton
                      active={
                        direction ===
                        "inbox"
                      }
                      onClick={() =>
                        setDirection(
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
                        setDirection(
                          "sent",
                        )
                      }
                      label="Sent"
                      count={
                        counts.sent
                      }
                    />
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                  {filteredConversations.length ===
                  0 ? (
                    <div className="p-8 text-center">
                      <Inbox className="mx-auto h-6 w-6 text-slate-300" />

                      <p className="mt-3 text-[10px] font-semibold text-slate-400">
                        No matching conversations.
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map(
                      (
                        conversation,
                      ) => {
                        const latestOutgoing =
                          isOutgoing(
                            conversation.latest,
                          );

                        return (
                          <button
                            key={
                              conversation.id
                            }
                            type="button"
                            onClick={() =>
                              void selectConversation(
                                conversation,
                              )
                            }
                            className={[
                              "block w-full border-b border-slate-100 p-4 text-left transition",

                              selectedConversationId ===
                              conversation.id
                                ? "bg-[#fff5f7]"
                                : "hover:bg-slate-50",
                            ].join(
                              " ",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[10px] font-black text-[#8f0024]">
                                {initials(
                                  conversation.counterpartName,
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex min-w-0 items-center gap-2">
                                    {conversation.unread >
                                      0 && (
                                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#8f0024]" />
                                    )}

                                    <p className="truncate text-[11px] font-black text-slate-800">
                                      {
                                        conversation.counterpartName
                                      }
                                    </p>
                                  </div>

                                  <span className="shrink-0 text-[8px] font-semibold text-slate-400">
                                    {formatShortDate(
                                      conversation.latest.createdAt,
                                    )}
                                  </span>
                                </div>

                                <p className="mt-1 truncate text-[9px] font-bold text-slate-600">
                                  {
                                    conversation.latest.subject
                                  }
                                </p>

                                <p className="mt-1 truncate text-[9px] text-slate-400">
                                  {latestOutgoing
                                    ? "You: "
                                    : ""}
                                  {
                                    conversation.latest.body
                                  }
                                </p>

                                <p className="mt-2 text-[8px] font-semibold capitalize text-slate-400">
                                  {roleLabel(
                                    conversation.counterpartRole,
                                  )}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      },
                    )
                  )}
                </div>
              </aside>

              <section className="flex min-h-[610px] min-w-0 flex-col">
                {selectedConversation ? (
                  <>
                    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8f0024] text-xs font-black text-white">
                          {initials(
                            selectedConversation.counterpartName,
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-black text-slate-900">
                            {
                              selectedConversation.counterpartName
                            }
                          </h2>

                          <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-400">
                            {roleLabel(
                              selectedConversation.counterpartRole,
                            )}

                            {selectedConversation.counterpartEmail
                              ? ` • ${selectedConversation.counterpartEmail}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      {selectedConversation.unread >
                        0 && (
                        <span className="rounded-full bg-[#fff1f4] px-3 py-1.5 text-[8px] font-black text-[#8f0024]">
                          {
                            selectedConversation.unread
                          }{" "}
                          unread
                        </span>
                      )}
                    </div>

                    <div
                      ref={
                        threadRef
                      }
                      className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#fafafa] px-5 py-6 sm:px-7"
                    >
                      {selectedConversation.messages.map(
                        (
                          message,
                        ) => {
                          const outgoing =
                            isOutgoing(
                              message,
                            );

                          return (
                            <div
                              key={
                                message.id
                              }
                              className={[
                                "flex",

                                outgoing
                                  ? "justify-end"
                                  : "justify-start",
                              ].join(
                                " ",
                              )}
                            >
                              <div className="max-w-[82%] sm:max-w-[70%]">
                                <div
                                  className={[
                                    "rounded-2xl px-4 py-3 shadow-sm",

                                    outgoing
                                      ? "rounded-br-md bg-[#8f0024] text-white"
                                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700",
                                  ].join(
                                    " ",
                                  )}
                                >
                                  <div
                                    className={[
                                      "mb-2 text-[8px] font-black",

                                      outgoing
                                        ? "text-pink-100"
                                        : "text-[#8f0024]",
                                    ].join(
                                      " ",
                                    )}
                                  >
                                    {
                                      message.subject
                                    }
                                  </div>

                                  <p className="whitespace-pre-wrap text-[11px] leading-6">
                                    {
                                      message.body
                                    }
                                  </p>
                                </div>

                                <p
                                  className={[
                                    "mt-1.5 text-[8px] font-semibold text-slate-400",

                                    outgoing
                                      ? "text-right"
                                      : "text-left",
                                  ].join(
                                    " ",
                                  )}
                                >
                                  {outgoing
                                    ? "You"
                                    : message.senderName}

                                  {" • "}

                                  {formatDate(
                                    message.createdAt,
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>

                    <div className="shrink-0 border-t border-slate-100 bg-white p-4 sm:p-5">
                      {canReply ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition focus-within:border-[#8f0024]/30 focus-within:bg-white">
                          <textarea
                            rows={
                              2
                            }
                            value={
                              reply
                            }
                            onChange={(
                              event,
                            ) =>
                              setReply(
                                event.target
                                  .value,
                              )
                            }
                            onKeyDown={(
                              event,
                            ) => {
                              if (
                                event.key ===
                                  "Enter" &&
                                (
                                  event.ctrlKey ||
                                  event.metaKey
                                )
                              ) {
                                event.preventDefault();

                                void sendReply();
                              }
                            }}
                            placeholder={`Reply to ${selectedConversation.counterpartName}...`}
                            className="w-full resize-none bg-transparent px-1 py-1 text-xs leading-6 text-slate-700 outline-none"
                          />

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-[8px] font-semibold text-slate-400">
                              Ctrl / Cmd + Enter to send
                            </p>

                            <button
                              type="button"
                              disabled={
                                replying ||
                                !reply.trim()
                              }
                              onClick={() =>
                                void sendReply()
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#8f0024] px-4 text-[9px] font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {replying ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}

                              Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[10px] font-semibold text-slate-500">
                          Messaging is no longer available for this account.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center p-8 text-center">
                    <div>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1f4] text-[#8f0024]">
                        <Mail className="h-7 w-7" />
                      </div>

                      <h2 className="mt-4 text-sm font-black text-slate-700">
                        Select a conversation
                      </h2>

                      <p className="mt-2 text-[10px] leading-5 text-slate-400">
                        Choose someone from the left to view the complete message history.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </div>

      {composeOpen && (
        <div className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Close compose"
            className="absolute inset-0"
            onClick={() => {
              if (
                !sending
              ) {
                setComposeOpen(
                  false,
                );
              }
            }}
          />

          <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#8f0024]">
                  New Conversation
                </p>

                <h2 className="mt-1 text-xl font-black text-[#281b1f]">
                  New Message
                </h2>
              </div>

              <button
                type="button"
                disabled={
                  sending
                }
                onClick={() =>
                  setComposeOpen(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <FieldLabel>
                Recipient
              </FieldLabel>

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
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#8f0024]/40"
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
                      {
                        recipient.name
                      }{" "}
                      —{" "}
                      {roleLabel(
                        recipient.role,
                      )}
                    </option>
                  ),
                )}
              </select>

              <div>
                <FieldLabel>
                  Subject
                </FieldLabel>

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
                  placeholder="What is this message about?"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#8f0024]/40"
                />
              </div>

              <div>
                <FieldLabel>
                  Message
                </FieldLabel>

                <textarea
                  rows={
                    7
                  }
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
                  placeholder="Write your message..."
                  className="w-full resize-y rounded-xl border border-slate-200 p-3 text-xs leading-6 outline-none focus:border-[#8f0024]/40"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[10px] font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={
                    sending
                  }
                  onClick={() =>
                    setComposeOpen(
                      false,
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 px-5 text-xs font-black text-slate-600 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    sending ||
                    !form.recipientId ||
                    !form.subject.trim() ||
                    !form.body.trim()
                  }
                  onClick={() =>
                    void sendNewMessage()
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#8f0024] px-5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}

                  Send Message
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;

  onClick:
    () => void;

  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "rounded-lg px-2 py-2 text-[9px] font-black transition",

        active
          ? "bg-white text-[#8f0024] shadow-sm"
          : "text-slate-500",
      ].join(
        " ",
      )}
    >
      {label}

      <span className="ml-1 opacity-60">
        ({count})
      </span>
    </button>
  );
}

function FieldLabel({
  children,
}: {
children:
  ReactNode;
}) {
  return (
    <label className="mb-2 block text-[9px] font-black uppercase tracking-wider text-slate-500">
      {children}
    </label>
  );
}