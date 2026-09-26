"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  ArrowRight,
  Download,
  GraduationCap,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

type MessageRole = "user" | "bot";

type ChatAction =
  | {
      type: "navigate";
      label: string;
      value: string;
    }
  | {
      type: "download";
      label: string;
      value: string;
      filename?: string;
    };

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  actions?: ChatAction[];
};

const excludedRoutes = [
  "/services",
  "/admin",
  "/faculty",
  "/dashboard",
  "/student-dashboard",
  "/admin-dashboard",
  "/teacher-dashboard",
  "/client-dashboard",
  "/developer",
  "/login",
  "/signup",
];

const quickQuestions = [
  {
    label: "Admissions",
    message: "I want admission. Can you guide me?",
  },
  {
    label: "Programs",
    message: "What programs do you offer?",
  },
  {
    label: "Fees",
    message: "What are the fees?",
  },
  {
    label: "Eligibility",
    message: "What is the eligibility for admission?",
  },
  {
    label: "Brochure",
    message: "Can I download the brochure?",
  },
  {
    label: "Prospectus",
    message: "Can I download the prospectus?",
  },
  {
    label: "Contact",
    message: "How can I contact Prime Digital School?",
  },
  {
    label: "Apply Now",
    message: "How do I apply for admission?",
  },
];

const welcomeLines = [
  "Hi 👋 I'm the Prime Digital School Assistant.",
  "Ask me about admissions, programs and eligibility.",
  "I can also help with fees, applications and downloads.",
];

const WHATSAPP_URL =
  "https://wa.me/918693093542?text=" +
  encodeURIComponent(
    "Hi Prime Digital School, I would like to know more about admissions.",
  );

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function SchoolChatbot() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [welcomeStep, setWelcomeStep] = useState(0);

  const [sessionReady, setSessionReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const hasConversation = messages.some((message) => message.role === "user");

  const hidden = excludedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isWelcomeTyping =
    open &&
    sessionReady &&
    !hidden &&
    !hasConversation &&
    welcomeStep < welcomeLines.length;

  /*
   * Wait until the browser has mounted.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Restore conversation from sessionStorage.
   * Remove the old single-paragraph welcome message.
   */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("pds-chatbot-messages");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const restored = parsed.filter((item): item is ChatMessage => {
            if (!item || typeof item !== "object") {
              return false;
            }

            const message = item as Partial<ChatMessage>;

            return (
              typeof message.id === "string" &&
              typeof message.text === "string" &&
              (message.role === "bot" || message.role === "user") &&
              message.id !== "welcome"
            );
          });

          setMessages(restored);

          const completedWelcomeLines = welcomeLines.filter((_, index) =>
            restored.some(
              (message) => message.id === `welcome-line-${index + 1}`,
            ),
          ).length;

          setWelcomeStep(completedWelcomeLines);
        }
      }
    } catch {
      // Ignore invalid saved conversations.
    }

    setSessionReady(true);
  }, []);

  /*
   * Save conversation while navigating public pages.
   */

  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    try {
      if (messages.length > 0) {
        sessionStorage.setItem(
          "pds-chatbot-messages",
          JSON.stringify(messages),
        );
      } else {
        sessionStorage.removeItem("pds-chatbot-messages");
      }
    } catch {
      // Ignore storage errors.
    }
  }, [messages, sessionReady]);

  /*
   * WELCOME ANIMATION
   *
   * 0–3 seconds: typing
   * 3 seconds: first message
   *
   * 3–6 seconds: typing
   * 6 seconds: second message
   *
   * 6–9 seconds: typing
   * 9 seconds: third message
   */

  useEffect(() => {
    if (!isWelcomeTyping) {
      return;
    }

    const timer = window.setTimeout(() => {
      const line = welcomeLines[welcomeStep];

      setMessages((current) => [
        ...current,
        {
          id: `welcome-line-${welcomeStep + 1}`,
          role: "bot",
          text: line,
        },
      ]);

      setWelcomeStep((current) => current + 1);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isWelcomeTyping, welcomeStep]);

  /*
   * Scroll to latest message.
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, open]);

  /*
   * Escape closes chatbot.
   */

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function sendMessage(text: string) {
    const cleanText = text.trim();

    if (!cleanText || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      text: cleanText,
    };

    const conversation = [...messages, userMessage];

    setMessages(conversation);

    setInput("");
    setLoading(true);

    try {
      const apiMessages = conversation
        .filter(
          (message) =>
            message.id !== "welcome" && !message.id.startsWith("welcome-line-"),
        )
        .slice(-14)
        .map((message) => ({
          role: message.role === "user" ? "user" : "assistant",

          content: message.text,
        }));

      const response = await fetch("/api/chatbot", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        actions?: ChatAction[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to contact assistant.");
      }

      const botMessage: ChatMessage = {
        id: createId(),

        role: "bot",

        text: data.reply || "I couldn't generate a response.",

        actions: Array.isArray(data.actions) ? data.actions : [],
      };

      setMessages((current) => [...current, botMessage]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),

          role: "bot",

          text:
            error instanceof Error
              ? error.message
              : "I'm temporarily unable to respond. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void sendMessage(input);
  }

  function handleAction(action: ChatAction) {
    if (action.type === "navigate") {
      router.push(action.value);
      return;
    }

    const link = document.createElement("a");

    link.href = action.value;

    link.download = action.filename || "";

    document.body.appendChild(link);

    link.click();

    link.remove();
  }

  /*
   * Restart the full welcome animation
   * when New Conversation is clicked.
   */

  function resetChat() {
    setMessages([]);

    setWelcomeStep(0);

    setInput("");

    try {
      sessionStorage.removeItem("pds-chatbot-messages");
    } catch {
      // Ignore storage errors.
    }
  }

  if (!mounted || hidden) {
    return null;
  }

  return (
    <>
      {/* OUTSIDE CLICK AREA */}

      {open && (
        <button
          type="button"
          aria-label="Close chatbot"
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-[1490]
            cursor-default
            bg-transparent
          "
        />
      )}

      {/* CHAT WINDOW */}

      <section
        aria-label="Prime Digital School Assistant"
        aria-hidden={!open}
        className={`
          fixed
          bottom-[175px]
          right-5
          z-[1500]

          flex
          h-[560px]
          max-h-[calc(100vh-200px)]
          w-[380px]
          max-w-[calc(100vw-24px)]
          flex-col

          origin-bottom-right
          transform-gpu
          overflow-hidden

          rounded-[24px]

          border
          border-[#8f0024]/15

          bg-white

          shadow-[0_24px_70px_rgba(60,0,18,0.22)]

          transition-all
          duration-300
          ease-out

          max-[640px]:bottom-[150px]
          max-[640px]:right-3
          max-[640px]:h-[calc(100vh-175px)]
          max-[640px]:max-h-none
          max-[640px]:w-[calc(100vw-24px)]

          ${
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-5 scale-[0.88] opacity-0"
          }
        `}
      >
        {/* HEADER */}

        <div
          className="
            relative
            overflow-hidden

            bg-gradient-to-br
            from-[#550011]
            via-[#73001c]
            to-[#92002a]

            px-4
            py-4

            text-white
          "
        >
          <div
            className="
              absolute
              -right-10
              -top-10
              h-32
              w-32
              rounded-full
              bg-white/10
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-white/20

                  bg-white/10

                  backdrop-blur
                "
              >
                <GraduationCap className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2
                    className="
                      truncate
                      text-[15px]
                      font-black
                    "
                  >
                    Prime Digital School
                  </h2>

                  <Sparkles
                    className="
                      h-3.5
                      w-3.5
                      shrink-0
                      text-[#e8c466]
                    "
                  />
                </div>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[10px]
                    font-semibold
                    text-white/70
                  "
                >
                  AI Admissions & Program Assistant
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-white/65
                    "
                  >
                    Online
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-lg

                border
                border-white/15

                bg-white/10

                transition

                hover:bg-white/20
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* MESSAGES */}

        <div
          className="
            flex-1
            overflow-y-auto
            bg-[#fffafb]
            px-4
            py-4
          "
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div className="max-w-[90%]">
                  <div
                    className={
                      message.role === "user"
                        ? `
                          rounded-[18px_18px_5px_18px]
                          bg-[#7a0019]
                          px-4
                          py-3
                          text-[13px]
                          leading-[1.6]
                          text-white
                          shadow-sm
                        `
                        : `
                          rounded-[18px_18px_18px_5px]
                          border
                          border-[#eed9df]
                          bg-white
                          px-4
                          py-3
                          text-[13px]
                          leading-[1.6]
                          text-[#302c2e]
                          shadow-sm
                        `
                    }
                  >
                    {message.text}
                  </div>

                  {/* ACTION BUTTONS */}

                  {message.role === "bot" &&
                    message.actions &&
                    message.actions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {message.actions.map((action, index) => (
                          <button
                            key={`${message.id}-${index}`}
                            type="button"
                            onClick={() => handleAction(action)}
                            className="
                                inline-flex
                                items-center
                                gap-1.5

                                rounded-full

                                border
                                border-[#8f0024]/20

                                bg-white

                                px-3.5
                                py-2

                                text-[10.5px]
                                font-black
                                text-[#7a0019]

                                shadow-sm

                                transition

                                hover:-translate-y-0.5
                                hover:border-[#8f0024]/50
                                hover:bg-[#fff1f4]
                              "
                          >
                            {action.type === "download" ? (
                              <Download className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowRight className="h-3.5 w-3.5" />
                            )}

                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* WELCOME TYPING ANIMATION */}

            {isWelcomeTyping && (
              <div className="flex justify-start">
                <div
                  role="status"
                  aria-label="Assistant is typing"
                  className="
                    inline-flex
                    items-center
                    gap-1.5

                    rounded-[18px_18px_18px_5px]

                    border
                    border-[#eed9df]

                    bg-white

                    px-4
                    py-4

                    shadow-sm
                  "
                >
                  <span
                    className="
                      h-2
                      w-2
                      animate-bounce
                      rounded-full
                      bg-[#8f0024]
                    "
                  />

                  <span
                    className="
                      h-2
                      w-2
                      animate-bounce
                      rounded-full
                      bg-[#8f0024]
                    "
                    style={{
                      animationDelay: "150ms",
                    }}
                  />

                  <span
                    className="
                      h-2
                      w-2
                      animate-bounce
                      rounded-full
                      bg-[#8f0024]
                    "
                    style={{
                      animationDelay: "300ms",
                    }}
                  />
                </div>
              </div>
            )}

            {/* AI THINKING */}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-[18px_18px_18px_5px]

                    border
                    border-[#eed9df]

                    bg-white

                    px-4
                    py-3

                    text-[12px]
                    font-semibold
                    text-[#6b5b61]

                    shadow-sm
                  "
                >
                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                      text-[#8f0024]
                    "
                  />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK QUESTIONS */}

          {(welcomeStep >= welcomeLines.length || hasConversation) && (
            <div className="mt-5 border-t border-[#ead8dd]/70 pt-4">
              <p className="mb-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#8f0024]/60">
                Quick Questions
              </p>

              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    disabled={loading}
                    onClick={() => void sendMessage(item.message)}
                    className="
            rounded-full
            border
            border-[#8f0024]/15
            bg-white
            px-3
            py-1.5
            text-[10px]
            font-bold
            text-[#7a0019]
            transition
            hover:border-[#8f0024]
            hover:bg-[#fff1f4]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}

        <form
          onSubmit={handleSubmit}
          className="
            border-t
            border-[#ead8dd]
            bg-white
            p-3
          "
        >
          <div
            className="
              flex
              items-end
              gap-2

              rounded-[17px]

              border
              border-[#dbc5cb]

              bg-[#fffafb]

              p-2

              transition

              focus-within:border-[#8f0024]
              focus-within:ring-4
              focus-within:ring-[#8f0024]/5
            "
          >
            <textarea
              value={input}
              disabled={loading}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              placeholder="Ask me anything about Prime Digital School..."
              className="
                max-h-24
                min-h-[40px]
                flex-1
                resize-none

                bg-transparent

                px-2
                py-2.5

                text-[12.5px]
                leading-5
                text-[#272327]

                outline-none

                placeholder:text-slate-400

                disabled:opacity-60
              "
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-[13px]

                bg-[#7a0019]

                text-white

                shadow-[0_8px_20px_rgba(122,0,25,0.22)]

                transition

                hover:bg-[#590012]

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>

          <div
            className="
              mt-2
              flex
              items-center
              justify-between
              gap-3
              px-1
            "
          >
            <p
              className="
                truncate
                text-[8.5px]
                text-slate-400
              "
            >
              AI-powered Prime Digital School Assistant
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={resetChat}
              className="
                inline-flex
                shrink-0
                items-center
                gap-1

                text-[8.5px]
                font-bold
                text-[#8f0024]

                hover:underline

                disabled:opacity-50
              "
            >
              <RotateCcw className="h-3 w-3" />
              New conversation
            </button>
          </div>
        </form>
      </section>

      {/* FLOATING ACTION BUTTONS */}

      <div
        className="
          fixed
          bottom-5
          right-5
          z-[1500]

          flex
          flex-col
          items-center
          gap-3

          max-[640px]:bottom-4
          max-[640px]:right-4
        "
      >
        {/* CHATBOT ROBOT BUTTON */}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={
            open
              ? "Close Prime Digital School chat"
              : "Chat with Prime Digital School"
          }
          className="
            group
            relative

            flex
            h-[68px]
            w-[68px]
            items-center
            justify-center

            overflow-hidden

            rounded-full

            border-[3px]
            border-white

            bg-white

            shadow-[0_16px_40px_rgba(105,0,25,0.28)]

            transition
            duration-300

            hover:-translate-y-1
            hover:scale-105

            max-[640px]:h-[60px]
            max-[640px]:w-[60px]
          "
        >
          <img
            src="/chatbot/pds-chatbot.png"
            alt="Prime Digital School Assistant"
            className="
              relative
              z-10

              h-[58px]
              w-[58px]

              object-contain

              transition
              duration-300

              group-hover:scale-105

              max-[640px]:h-[50px]
              max-[640px]:w-[50px]
            "
          />
        </button>

        {/* WHATSAPP — HIDDEN WHILE CHATBOT IS OPEN */}

        {!open && (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Prime Digital School on WhatsApp"
            className="
              group

              flex
              h-[62px]
              w-[62px]
              items-center
              justify-center

              rounded-full

              border-[3px]
              border-white

              bg-[#25D366]

              text-white

              shadow-[0_14px_35px_rgba(37,211,102,0.32)]

              transition
              duration-300

              hover:-translate-y-1
              hover:scale-105
              hover:bg-[#20bd5a]

              max-[640px]:h-[56px]
              max-[640px]:w-[56px]
            "
          >
            <svg
              viewBox="0 0 32 32"
              aria-hidden="true"
              className="
                h-8
                w-8
                fill-current

                max-[640px]:h-7
                max-[640px]:w-7
              "
            >
              <path d="M16.04 3C9.41 3 4 8.24 4 14.68c0 2.26.67 4.47 1.94 6.35L4 29l8.22-1.89a12.38 12.38 0 0 0 3.82.6h.01C22.68 27.71 28 22.47 28 16.03 28 9.58 22.68 3 16.04 3Zm0 22.67h-.01a10.28 10.28 0 0 1-5.24-1.43l-.38-.22-4.87 1.12 1.16-4.6-.25-.4a9.94 9.94 0 0 1-1.55-5.46c0-5.33 4.5-9.67 10.04-9.67 5.54 0 10.04 4.34 10.04 9.67 0 5.32-4.5 10.99-10.04 10.99Zm5.5-7.23c-.3-.15-1.79-.86-2.07-.96-.28-.1-.48-.15-.68.15-.2.29-.78.96-.96 1.16-.18.2-.35.22-.65.07-.3-.14-1.27-.45-2.42-1.44-.89-.77-1.5-1.72-1.67-2.01-.18-.29-.02-.45.13-.59.14-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.19.05-.36-.03-.51-.07-.14-.68-1.59-.93-2.18-.25-.59-.5-.5-.68-.51h-.58c-.2 0-.53.07-.8.36-.28.29-1.06 1-1.06 2.45 0 1.44 1.08 2.84 1.23 3.03.15.2 2.13 3.14 5.16 4.4.72.3 1.28.48 1.72.61.72.22 1.38.19 1.9.12.58-.08 1.79-.71 2.04-1.39.25-.68.25-1.26.18-1.39-.08-.12-.28-.19-.58-.34Z" />
            </svg>
          </a>
        )}
      </div>
    </>
  );
}
