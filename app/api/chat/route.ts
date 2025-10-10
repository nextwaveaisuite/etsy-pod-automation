import { NextRequest, NextResponse } from "next/server";
// Import is fine at module scope; DO NOT construct the client here.
import OpenAI from "openai";

export const dynamic = "force-dynamic"; // ensure no static eval
export const runtime = "nodejs";        // use Node runtime

// Optional: simple preset FAQs so GET never touches OpenAI
const COMMON_QUESTIONS = [
  "How do I price Etsy POD products?",
  "Best mockup sizes for Printify?",
  "How do I write Etsy SEO titles and tags?",
  "What margins should I target?",
  "Steps for Smart Launch end-to-end?"
];

export async function GET() {
  return NextResponse.json({ questions: COMMON_QUESTIONS });
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    // If no key yet, return a friendly stub so builds/deploys still pass.
    if (!apiKey) {
      const { messages = [] } = (await safeJson(req)) as { messages?: ChatMessage[] };
      const lastUser = [...messages].reverse().find(m => m.role === "user")?.content || "";
      const canned =
        "AI chat is not enabled yet. Add OPENAI_API_KEY in Vercel → Settings → Environment Variables. " +
        (lastUser ? `You asked: "${lastUser}"` : "");
      return NextResponse.json({ reply: { role: "assistant", content: canned }, stub: true }, { status: 503 });
    }

    // Lazy-create OpenAI client inside the handler
    const openai = new OpenAI({ apiKey });

    const { messages = [], model = "gpt-4o-mini" } = (await safeJson(req)) as {
      messages?: ChatMessage[];
      model?: string;
    };

    // Basic guard
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Provide { messages: ChatMessage[] }" }, { status: 400 });
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.4
    });

    const reply = completion.choices?.[0]?.message ?? { role: "assistant", content: "" };
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Chat failed", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

/** Safely parse JSON; handles empty bodies */
async function safeJson(req: NextRequest) {
  try {
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}
