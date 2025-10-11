export const dynamic = "force-dynamic";

type Opp = {
  niche: string;
  score: number;
  monthly_searches: number;
  competition: "Low" | "Medium" | "High";
  profit: number;
};

async function getOpps(): Promise<Opp[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/opportunities/analyze`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.opportunities || data || null;
  } catch {
    return null;
  }
}

export default async function OpportunitiesPage() {
  const opps = await getOpps();
  return (
    <section className="card">
      <h2 className="card-header">Low-Hanging Fruit Opportunities 🍎</h2>
      {!opps || opps.length === 0 ? (
        <p className="muted">No opportunities yet. Once data is available, they’ll appear here.</p>
      ) : (
        <div className="table-grid">
          <div className="t-head">Niche</div>
          <div className="t-head">Score</div>
          <div className="t-head">Monthly Traffic</div>
          <div className="t-head">Competition</div>
          <div className="t-head">Avg Profit</div>
          {opps.map((o, i) => (
            <Fragment key={i}>
              <div>{o.niche}</div>
              <div><span className={`pill ${o.score > 95 ? "good" : o.score > 85 ? "ok" : "warn"}`}>{o.score}</span></div>
              <div>{o.monthly_searches.toLocaleString()}</div>
              <div>{o.competition}</div>
              <div>${o.profit}</div>
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}

import { Fragment } from "react";
