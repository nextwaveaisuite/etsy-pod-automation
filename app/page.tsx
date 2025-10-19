"use client";

import { useState } from "react";

export default function Home() {
  const [niche, setNiche] = useState("");
  const [product, setProduct] = useState("");
  const [mockups, setMockups] = useState("");

  async function handleGenerate() {
    // placeholder action
    alert("Mockup generation triggered (connect /api/mockups when ready).");
  }

  async function handleLaunch() {
    alert("One-Button Launch triggered (connect /api/launch when ready).");
  }

  return (
    <div className="grid">
      {/* Title */}
      <div className="span-12">
        <h1>ETSY POD BUILDER — AU</h1>
        <p className="center" style={{ fontWeight: 700 }}>
          Manage your listings, generate mockups, and launch faster.
        </p>
      </div>

      {/* Stats */}
      <section className="card span-12">
        <div className="stats">
          <div className="stat">
            <div className="stat-label">Active Listings</div>
            <div className="stat-value highlight">152</div>
          </div>
          <div className="stat">
            <div className="stat-label">Conversion Rate</div>
            <div className="stat-value">4.7%</div>
          </div>
          <div className="stat">
            <div className="stat-label">Generated Designs</div>
            <div className="stat-value">87</div>
          </div>
        </div>
      </section>

      {/* Creator Panel */}
      <section className="card span-8">
        <h2 className="card-header">🎨 Create Mockups</h2>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label>Niche</label>
            <input placeholder="e.g., wildflower line art" value={niche} onChange={(e) => setNiche(e.target.value)} />
          </div>
          <div>
            <label>Product</label>
            <input placeholder="e.g., tote bag" value={product} onChange={(e) => setProduct(e.target.value)} />
          </div>
          <div>
            <label>Mockup Image URLs (one per line)</label>
            <textarea rows={4} placeholder="https://.../image1.jpg&#10;https://.../image2.jpg" value={mockups} onChange={(e) => setMockups(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn-primary" onClick={handleGenerate}>Generate Mockup</button>
            <button className="btn-secondary" onClick={handleLaunch}>One-Button Launcher</button>
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className="card span-4">
        <h2 className="card-header">📋 Activity</h2>
        <p className="center" style={{ fontWeight: 700, color: "var(--quiet)" }}>No activity yet</p>
      </section>
    </div>
  );
}
