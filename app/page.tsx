"use client";

import { useState } from "react";

export default function Home() {
  const [toggles, setToggles] = useState({ upload: true, renew: true, adjust: false });
  const Toggle = ({ id, label }: { id: keyof typeof toggles; label: string }) => (
    <div className="row between">
      <span>{label}</span>
      <button
        className={`switch ${toggles[id] ? "on" : ""}`}
        onClick={() => setToggles((t) => ({ ...t, [id]: !t[id] }))}
      >
        <span className="knob" />
      </button>
    </div>
  );

  return (
    <div className="grid-dashboard">
      <section className="card">
        <h2 className="card-header">Overview</h2>
        <div className="stats">
          <div className="stat"><div className="stat-label">Listings</div><div className="stat-value highlight">3,450</div></div>
          <div className="stat"><div className="stat-label">Stores</div><div className="stat-value">12</div></div>
          <div className="stat"><div className="stat-label">Status</div><div className="stat-value">Active</div></div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-header">Automation</h2>
        <div className="list">
          <Toggle id="upload" label="Auto Upload" />
          <Toggle id="renew" label="Auto Renew" />
          <Toggle id="adjust" label="Auto Adjust" />
        </div>
      </section>

      <section className="card">
        <h2 className="card-header">Recent Activity</h2>
        <ul className="table">
          <li><span>Listing uploaded</span><span className="muted">2 hours ago</span></li>
          <li><span>Pricing updated</span><span className="muted">20 hours ago</span></li>
          <li><span>Renewal skipped</span><span className="muted">1 day ago</span></li>
          <li><span>Tags adjusted</span><span className="muted">1 day ago</span></li>
        </ul>
      </section>

      <section className="card">
        <h2 className="card-header row between"><span>Top Products</span><span className="muted">Sales</span></h2>
        <ul className="table">
          <li><span>Product A</span><span>150</span></li>
          <li><span>Product B</span><span>120</span></li>
          <li><span>Product C</span><span>110</span></li>
          <li><span>Product D</span><span>105</span></li>
        </ul>
      </section>
    </div>
  );
}
