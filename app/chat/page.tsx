"use client";

import { useState } from "react";

type MsgRole = "user" | "assistant";

interface Msg {
  role: MsgRole;
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me anything about POD or Etsy." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;

    // ✅ use the correct type for messages
    const newMessage: Msg = { role: "user", content: input.trim() };
    const nextMessages: Msg[] = [...messages, newMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      const replyContent =
        typeof data?.reply === "string"
          ? data.reply
          : data?.content || "No response.";

      setMessages([...nextMessages, { role: "assistant", content: replyContent }]);
    } catch (err) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "⚠️ Error: Unable to reach AI server. Check API route or key.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat">
      <aside className="chat-aside">
        <h3>Common Topics</h3>
        <ul>
          {["Product Pricing", "Niche Trends", "SEO Tips"].map((t) => (
            <li key={t}>
              <button className="btn-secondary" onClick={() => setInput(t)}>
                {t}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="chat-main card">
        <h2 className="card-header">AI Assistant — POD & Etsy Expert</h2>
        <div className="chat-thread">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              {m.content}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="btn-primary" onClick={send} disabled={loading}>
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </section>
    </div>
  );
}
