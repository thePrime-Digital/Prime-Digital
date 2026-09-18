import OpenAI from "openai";
import { NextResponse } from "next/server";

import { PDS_CHATBOT_KNOWLEDGE } from "@/lib/chatbot/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatAction = {
  type: "navigate" | "download";
  label: string;
  value: string;
  filename?: string;
};

const allowedNavigationRoutes = new Set([
  "/",
  "/about",
  "/programs",
  "/admissions",
  "/admissions#application-form",
  "/contact",
  "/support",
  "/login",

  "/programs/ai-robotics-explorer",
  "/programs/web-development-pro",
  "/programs/data-science-analytics-junior",
  "/programs/cyber-defense-junior",
  "/programs/ux-ui-design-mastery",
  "/programs/data-analytics",
  "/programs/teen-entrepreneurship",
  "/programs/digital-marketing",
  "/programs/graphic-design-motion-graphics",
  "/programs/software-testing",
  "/programs/python-programming-explorer",
  "/programs/mobile-app-development",
  "/programs/digital-content-creation",
]);

const allowedDownloads = new Set([
  "/downloads/prime-digital-school-brochure.pdf",
  "/downloads/prime-digital-school-prospectus.pdf",
]);

function cleanJsonOutput(value: string) {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function validateActions(value: unknown): ChatAction[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const actions: ChatAction[] = [];

  for (const item of value.slice(0, 3)) {
    if (
      !item ||
      typeof item !== "object"
    ) {
      continue;
    }

    const candidate = item as Record<string, unknown>;

    const type = candidate.type;
    const label = candidate.label;
    const actionValue = candidate.value;

    if (
      typeof label !== "string" ||
      typeof actionValue !== "string"
    ) {
      continue;
    }

    if (
      type === "navigate" &&
      allowedNavigationRoutes.has(actionValue)
    ) {
      actions.push({
        type: "navigate",
        label: label.slice(0, 60),
        value: actionValue,
      });

      continue;
    }

    if (
      type === "download" &&
      allowedDownloads.has(actionValue)
    ) {
      actions.push({
        type: "download",
        label: label.slice(0, 60),
        value: actionValue,
        filename:
          typeof candidate.filename === "string"
            ? candidate.filename.slice(0, 120)
            : undefined,
      });
    }
  }

  return actions;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing.");

      return NextResponse.json(
        {
          error: "Chat assistant is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const body = (await request.json()) as {
      messages?: IncomingMessage[];
    };

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        {
          error: "Messages are required.",
        },
        {
          status: 400,
        },
      );
    }

    const messages = body.messages
      .filter(
        (
          message,
        ): message is IncomingMessage =>
          Boolean(
            message &&
              (message.role === "user" ||
                message.role === "assistant") &&
              typeof message.content === "string",
          ),
      )
      .slice(-14)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 2500),
      }));

    if (messages.length === 0) {
      return NextResponse.json(
        {
          error: "Please enter a message.",
        },
        {
          status: 400,
        },
      );
    }

    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    if (
      !latestUserMessage ||
      !latestUserMessage.content.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter a message.",
        },
        {
          status: 400,
        },
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    const response =
      await client.responses.create({
        model: "gpt-5.6-luna",

        reasoning: {
          effort: "none",
        },

        instructions: `
${PDS_CHATBOT_KNOWLEDGE}

OUTPUT FORMAT

Return ONLY valid JSON.

Never use markdown code fences.

Use exactly this structure:

{
  "reply": "Natural language answer shown to the visitor.",
  "actions": [
    {
      "type": "navigate",
      "label": "Button label",
      "value": "/valid-route"
    }
  ]
}

Allowed navigation routes:
/
 /about
 /programs
 /admissions
 /admissions#application-form
 /contact
 /support
 /login
 /programs/ai-robotics-explorer
 /programs/web-development-pro
 /programs/data-science-analytics-junior
 /programs/cyber-defense-junior
 /programs/ux-ui-design-mastery
 /programs/data-analytics
 /programs/teen-entrepreneurship
 /programs/digital-marketing
 /programs/graphic-design-motion-graphics
 /programs/software-testing
 /programs/python-programming-explorer
 /programs/mobile-app-development
 /programs/digital-content-creation

Allowed downloads:
 /downloads/prime-digital-school-brochure.pdf
 /downloads/prime-digital-school-prospectus.pdf

For downloads use:

{
  "type": "download",
  "label": "Download Brochure",
  "value": "/downloads/prime-digital-school-brochure.pdf",
  "filename": "prime-digital-school-brochure.pdf"
}

Rules for actions:

- Maximum 3 actions.
- Actions are optional.
- Answer the visitor before offering navigation.
- Never automatically navigate.
- Only offer actions relevant to the current conversation.
- Do not create external URLs.
- Do not invent routes.
`,

        input: messages,
      });

    const rawText =
      response.output_text?.trim();

    if (!rawText) {
      throw new Error(
        "OpenAI returned an empty response.",
      );
    }

    try {
      const parsed = JSON.parse(
        cleanJsonOutput(rawText),
      ) as {
        reply?: unknown;
        actions?: unknown;
      };

      const reply =
        typeof parsed.reply === "string"
          ? parsed.reply.trim()
          : "";

      if (!reply) {
        throw new Error(
          "Response did not contain a reply.",
        );
      }

      return NextResponse.json({
        reply,
        actions: validateActions(
          parsed.actions,
        ),
      });
    } catch {
      // Safe fallback if the model returns plain text instead of JSON.
      return NextResponse.json({
        reply: rawText,
        actions: [],
      });
    }
  } catch (error) {
    console.error(
      "Prime Digital School chatbot error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "I'm temporarily unable to answer that. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}