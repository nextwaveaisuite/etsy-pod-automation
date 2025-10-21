// app/page.tsx
"use client";
import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 text-center px-6 py-16 space-y-20">

      {/* HERO SECTION */}
      <section>
        <h1 className="text-4xl font-bold mb-4">🚀 Etsy POD Automation</h1>
        <p className="text-lg font-semibold text-gray-700 max-w-2xl mx-auto">
          Automate your Etsy Print-on-Demand business with AI — discover profitable niches,
          auto-generate listings, and grow your store hands-free.
        </p>
      </section>

      {/* OPPORTUNITIES SECTION */}
      <section>
        <h2 className="text-3xl font-bold mb-4">🍎 Low-Hanging Fruit Opportunities</h2>
        <p className="text-lg font-medium max-w-3xl mx-auto">
          Find the easiest wins in the marketplace — trending niches, proven products,
          and untapped designs that are generating real sales right now.
        </p>
      </section>

      {/* SOCIAL SECTION */}
      <section>
        <h2 className="text-3xl font-bold mb-4">📱 Social Media Automation</h2>
        <p className="text-lg font-medium max-w-3xl mx-auto">
          Instantly publish your best-selling products to social platforms like Pinterest,
          Instagram, and TikTok with pre-written AI captions and optimized hashtags.
        </p>
      </section>

      {/* TRAFFIC SECTION */}
      <section>
        <h2 className="text-3xl font-bold mb-4">🌐 Traffic on Autopilot</h2>
        <p className="text-lg font-medium max-w-3xl mx-auto">
          Drive consistent, high-intent traffic using built-in AI campaigns that
          generate real clicks — not bots — from high-performing sources.
        </p>
      </section>

      {/* AI CHAT SECTION */}
      <section>
        <h2 className="text-3xl font-bold mb-4">🤖 Intelligent AI Chat Assistant</h2>
        <p className="text-lg font-medium max-w-3xl mx-auto mb-6">
          Ask questions about Etsy automation, product strategies, or growth tips —
          our AI chatbot gives intelligent, context-aware answers to guide your success.
        </p>
        <div className="max-w-2xl mx-auto">
          <iframe
            src="https://chat.nextwaveaisuite.com"
            className="w-full h-96 rounded-xl border border-gray-300 shadow-lg"
            title="AI Chat Assistant"
          ></iframe>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section>
        <h2 className="text-3xl font-bold mb-4">💎 Pricing Plans</h2>
        <p className="text-lg font-medium max-w-3xl mx-auto mb-8">
          Start free and upgrade anytime — choose a plan that matches your goals.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="bg-white shadow-md rounded-2xl p-8 w-72">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="font-semibold text-gray-600 mb-3">$0 / month</p>
            <p>Discover niches + 5 uploads/day</p>
          </div>
          <div className="bg-yellow-100 shadow-lg rounded-2xl p-8 w-72 border-2 border-yellow-400">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="font-semibold text-gray-600 mb-3">$29 / month</p>
            <p>Unlimited uploads + Auto-posting + AI Chat</p>
          </div>
          <div className="bg-blue-100 shadow-lg rounded-2xl p-8 w-72 border-2 border-blue-400">
            <h3 className="text-2xl font-bold mb-2">Elite</h3>
            <p className="font-semibold text-gray-600 mb-3">$69 / month</p>
            <p>All features + API Access + Early Betas</p>
          </div>
        </div>
      </section>

    </main>
  );
}
