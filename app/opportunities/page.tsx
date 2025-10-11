import { Fragment } from "react";
export const dynamic = "force-dynamic";

async function getOpps() {
  try {
    const url =
      (process.env.NEXT_PUBLIC_BASE_URL || "") + "/api/opportunities/analyze";
    const res = await fetch(url, { cache: "no-store" });
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
        <p className="muted">No opportunities yet. They’ll appear here when available.</p>
      ) : (
        <div className="table-grid">
          <div className="t-head">Niche</div>
          <div className="t-head">Score</div>
          <div className="t-head">Monthly Traffic</div>
          <div className="t-head">Competition</div>
          <div className="t-head">Avg Profit</div>
          {opps.map((o: any, i: number) => (
            <Fragment key={i}>
              <div>{o.niche}</div>
              <div><span className={`pill ${o.score > 95 ? "good" : o.score > 85 ? "ok" : "warn"}`}>{o.score}</span></div>
              <div>{Number(o.monthly_searches).toLocaleString()}</div>
              <div>{o.competition}</div>
              <div>${o.profit}</div>
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
