"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me anything about POD or Etsy." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await r.json();
      const answer = data?.reply || data?.content || JSON.stringify(data);
      setMessages([...next, { role: "assistant", content: String(answer) }]);
    } catch (e: any) {
      setMessages([...next, { role: "assistant", content: "Chat error. Check OPENAI_API_KEY and /api/chat route." }]);
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
            <li key={t}><button className="btn-secondary" onClick={() => setInput(t)}>{t}</button></li>
          ))}
        </ul>
      </aside>

      <section className="chat-main card">
        <h2 className="card-header">AI Assistant — POD & Etsy</h2>
        <div className="chat-thread">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>{m.content}</div>
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
