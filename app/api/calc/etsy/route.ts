import { NextRequest, NextResponse } from "next/server";

function num(v: string | number | undefined, d: number) {
  if (v === undefined) return d;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : d;
}
function round2(n: number) { return Math.round(n*100)/100; }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const listingFee = num(process.env.ETSY_AU_LISTING_FEE, 0.30);
  const txnPct = num(process.env.ETSY_AU_TXN_PCT, 6.5);
  const payPct = num(process.env.ETSY_AU_PAY_PCT, 3.0);
  const payFixed = num(process.env.ETSY_AU_PAY_FIXED, 0.30);
  const offsiteDefault = num(process.env.ETSY_OFFSITE_ADS_PCT_TIER, 0);

  const itemPrice = body.itemPrice ?? 0;
  const buyerShipping = body.buyerShipping ?? 0;
  const podBase = body.podBase ?? 0;
  const podShip = body.podShip ?? 0;

  const fees = {
    listingFee: body.listingFee ?? listingFee,
    txnPct: (body.txnPct ?? txnPct) / 100,
    payPct: (body.payPct ?? payPct) / 100,
    payFixed: body.payFixed ?? payFixed,
    offsiteAdsPct: (body.offsiteAdsPct ?? offsiteDefault) / 100
  };

  const gross = itemPrice + buyerShipping;
  const cogs = podBase + podShip;
  const transactionFee = fees.txnPct * gross;
  const processingFee = fees.payPct * gross + fees.payFixed;
  const offsiteAdsFee = fees.offsiteAdsPct * gross;
  const totalFees = fees.listingFee + transactionFee + processingFee + offsiteAdsFee;
  const profit = gross - cogs - totalFees;
  const marginPct = gross > 0 ? (profit / gross) * 100 : 0;
  const r = 1 - (fees.txnPct + fees.payPct + fees.offsiteAdsPct);
  const breakevenItemPrice = r > 0
    ? (cogs + fees.listingFee + fees.payFixed - r * buyerShipping) / r
    : Number.NaN;

  return NextResponse.json({
    inputs: { itemPrice, buyerShipping, podBase, podShip, fees },
    outputs: {
      gross: round2(gross),
      costs: round2(cogs),
      transactionFee: round2(transactionFee),
      processingFee: round2(processingFee),
      offsiteAdsFee: round2(offsiteAdsFee),
      listingFee: round2(fees.listingFee),
      totalFees: round2(totalFees),
      profit: round2(profit),
      marginPct: round2(marginPct),
      breakevenItemPrice: Number.isFinite(breakevenItemPrice) ? round2(breakevenItemPrice) : null
    }
  });
}
