import { NextRequest, NextResponse } from "next/server";

function num(v: string | number | undefined, d: number) {
  if (v === undefined) return d;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : d;
}
function round2(n: number) { return Math.round(n*100)/100; }

// Product-specific profit recommendations based on market research
const PROFIT_TARGETS = {
  "tote bag": { min: 8, optimal: 12, premium: 18 },
  "mug": { min: 6, optimal: 10, premium: 15 },
  "t-shirt": { min: 8, optimal: 13, premium: 20 },
  "hoodie": { min: 12, optimal: 18, premium: 28 },
  "poster": { min: 7, optimal: 11, premium: 16 },
  "sticker": { min: 2, optimal: 4, premium: 7 },
  "phone case": { min: 6, optimal: 9, premium: 14 },
  "pillow": { min: 10, optimal: 15, premium: 22 },
  "default": { min: 5, optimal: 10, premium: 15 }
};

// Typical POD costs (in AUD)
const POD_COSTS = {
  "tote bag": { base: 8.50, shipping: 4.50 },
  "mug": { base: 7.00, shipping: 5.00 },
  "t-shirt": { base: 9.50, shipping: 4.00 },
  "hoodie": { base: 18.00, shipping: 5.50 },
  "poster": { base: 6.50, shipping: 4.00 },
  "sticker": { base: 1.50, shipping: 2.00 },
  "phone case": { base: 8.00, shipping: 3.50 },
  "pillow": { base: 12.00, shipping: 5.00 }
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // Get fee defaults from environment
  const listingFee = num(process.env.ETSY_AU_LISTING_FEE, 0.30);
  const txnPct = num(process.env.ETSY_AU_TXN_PCT, 6.5);
  const payPct = num(process.env.ETSY_AU_PAY_PCT, 3.0);
  const payFixed = num(process.env.ETSY_AU_PAY_FIXED, 0.30);
  const offsiteDefault = num(process.env.ETSY_OFFSITE_ADS_PCT_TIER, 0);

  // User inputs
  const productType = (body.productType || "default").toLowerCase();
  const targetProfit = body.targetProfit; // User's desired profit
  const minProfit = body.minProfit || 5; // Minimum acceptable profit
  const maxProfit = body.maxProfit || 13; // Maximum target profit
  
  // Get POD costs (user can override)
  const podCosts = POD_COSTS[productType as keyof typeof POD_COSTS] || POD_COSTS["tote bag"];
  const podBase = body.podBase ?? podCosts.base;
  const podShip = body.podShip ?? podCosts.shipping;
  const buyerShipping = body.buyerShipping ?? 6.95; // Standard AU shipping

  // Fees
  const fees = {
    listingFee: body.listingFee ?? listingFee,
    txnPct: (body.txnPct ?? txnPct) / 100,
    payPct: (body.payPct ?? payPct) / 100,
    payFixed: body.payFixed ?? payFixed,
    offsiteAdsPct: (body.offsiteAdsPct ?? offsiteDefault) / 100
  };

  // Get profit targets for this product
  const profitTargets = PROFIT_TARGETS[productType as keyof typeof PROFIT_TARGETS] || PROFIT_TARGETS.default;

  // Calculate optimal pricing for different profit levels
  function calculatePriceForProfit(desiredProfit: number) {
    // Formula: itemPrice = (COGS + fees + desiredProfit + feeRates * buyerShipping) / (1 - feeRates)
    const cogs = podBase + podShip;
    const feeRates = fees.txnPct + fees.payPct + fees.offsiteAdsPct;
    const fixedCosts = fees.listingFee + fees.payFixed;
    
    const itemPrice = (cogs + fixedCosts + desiredProfit + feeRates * buyerShipping) / (1 - feeRates);
    
    // Verify the calculation
    const gross = itemPrice + buyerShipping;
    const transactionFee = fees.txnPct * gross;
    const processingFee = fees.payPct * gross + fees.payFixed;
    const offsiteAdsFee = fees.offsiteAdsPct * gross;
    const totalFees = fees.listingFee + transactionFee + processingFee + offsiteAdsFee;
    const actualProfit = gross - cogs - totalFees;
    
    return {
      itemPrice: round2(itemPrice),
      gross: round2(gross),
      costs: round2(cogs),
      totalFees: round2(totalFees),
      profit: round2(actualProfit),
      marginPct: round2((actualProfit / gross) * 100)
    };
  }

  // If user provided a specific item price, calculate actual profit
  let currentPricing = null;
  if (body.itemPrice) {
    const itemPrice = body.itemPrice;
    const gross = itemPrice + buyerShipping;
    const cogs = podBase + podShip;
    const transactionFee = fees.txnPct * gross;
    const processingFee = fees.payPct * gross + fees.payFixed;
    const offsiteAdsFee = fees.offsiteAdsPct * gross;
    const totalFees = fees.listingFee + transactionFee + processingFee + offsiteAdsFee;
    const profit = gross - cogs - totalFees;
    
    currentPricing = {
      itemPrice: round2(itemPrice),
      gross: round2(gross),
      costs: round2(cogs),
      totalFees: round2(totalFees),
      profit: round2(profit),
      marginPct: round2((profit / gross) * 100),
      meetsMinimum: profit >= minProfit,
      meetsMaximum: profit <= maxProfit,
      inRange: profit >= minProfit && profit <= maxProfit
    };
  }

  // Calculate pricing tiers
  const pricingTiers = {
    minimum: calculatePriceForProfit(minProfit),
    target: calculatePriceForProfit(targetProfit || profitTargets.optimal),
    maximum: calculatePriceForProfit(maxProfit),
    recommended: {
      conservative: calculatePriceForProfit(profitTargets.min),
      optimal: calculatePriceForProfit(profitTargets.optimal),
      premium: calculatePriceForProfit(profitTargets.premium)
    }
  };

  // Market comparison
  const marketInsights = {
    productType,
    profitTargets,
    podCosts: { base: podBase, shipping: podShip },
    competitivePriceRange: {
      low: round2(pricingTiers.minimum.itemPrice * 0.9),
      average: round2(pricingTiers.recommended.optimal.itemPrice),
      high: round2(pricingTiers.recommended.premium.itemPrice * 1.1)
    },
    recommendation: generateRecommendation(pricingTiers, profitTargets, productType)
  };

  return NextResponse.json({
    success: true,
    currentPricing,
    pricingTiers,
    marketInsights,
    inputs: {
      productType,
      targetProfit,
      minProfit,
      maxProfit,
      podBase,
      podShip,
      buyerShipping,
      fees
    }
  });
}

function generateRecommendation(tiers: any, targets: any, productType: string) {
  const optimal = tiers.recommended.optimal;
  
  return {
    suggestedPrice: optimal.itemPrice,
    expectedProfit: optimal.profit,
    reasoning: [
      `For ${productType}, the optimal profit target is $${targets.optimal} AUD`,
      `At $${optimal.itemPrice} AUD, you'll earn $${optimal.profit} profit (${optimal.marginPct}% margin)`,
      `This price is competitive and ensures healthy profit margins`,
      `Your profit will be within the safe $${targets.min}-$${targets.premium} range`
    ],
    pricingStrategy: optimal.profit >= targets.optimal 
      ? "Premium positioning - higher profit, quality focus"
      : "Competitive positioning - balanced profit and volume"
  };
}

// GET endpoint for quick profit calculations
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productType = searchParams.get("productType") || "tote bag";
  
  const targets = PROFIT_TARGETS[productType as keyof typeof PROFIT_TARGETS] || PROFIT_TARGETS.default;
  const costs = POD_COSTS[productType as keyof typeof POD_COSTS] || POD_COSTS["tote bag"];
  
  return NextResponse.json({
    productType,
    profitTargets: targets,
    typicalCosts: costs,
    allProducts: Object.keys(POD_COSTS),
    note: "Use POST endpoint with specific values for detailed calculations"
  });
}

