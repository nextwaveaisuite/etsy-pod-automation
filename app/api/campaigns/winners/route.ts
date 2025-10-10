import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Simulated winning campaign data - in production, this would pull from:
// - Etsy API (top sellers in category)
// - Print-on-demand platform analytics
// - Social media engagement metrics
// - Sales data from your own campaigns

interface WinningCampaign {
  id: string;
  niche: string;
  product: string;
  imageUrl: string;
  sales: number;
  revenue: number;
  conversionRate: number;
  engagementScore: number;
  designElements: string[];
  colorPalette: string[];
  style: string;
}

const WINNING_CAMPAIGNS: WinningCampaign[] = [
  {
    id: "wc001",
    niche: "wildflower line art",
    product: "tote bag",
    imageUrl: "https://example.com/winning-wildflower-1.jpg",
    sales: 1250,
    revenue: 31250,
    conversionRate: 4.2,
    engagementScore: 8.5,
    designElements: ["minimal line drawing", "single flower", "negative space"],
    colorPalette: ["#000000", "#FFFFFF"],
    style: "minimalist line art"
  },
  {
    id: "wc002",
    niche: "boho aesthetic",
    product: "mug",
    imageUrl: "https://example.com/winning-boho-1.jpg",
    sales: 980,
    revenue: 24500,
    conversionRate: 3.8,
    engagementScore: 7.9,
    designElements: ["geometric patterns", "earthy tones", "hand-drawn feel"],
    colorPalette: ["#D4A574", "#8B7355", "#F5E6D3"],
    style: "boho geometric"
  }
];

async function searchEtsyTopSellers(niche: string, product: string) {
  // In production, this would use Etsy API to find top sellers
  // Example: GET /v3/application/listings/active?keywords={niche}&category={product}&sort_on=score
  
  return {
    note: "Would integrate with Etsy API to find top sellers",
    endpoint: "GET /v3/application/listings/active",
    params: {
      keywords: `${niche} ${product}`,
      sort_on: "score",
      limit: 20
    }
  };
}

async function analyzeCampaignPerformance(campaigns: WinningCampaign[]) {
  // Sort by composite score: sales * conversion rate * engagement
  return campaigns
    .map(c => ({
      ...c,
      compositeScore: (c.sales * c.conversionRate * c.engagementScore) / 1000
    }))
    .sort((a, b) => b.compositeScore - a.compositeScore);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get("niche") || "";
  const product = searchParams.get("product") || "";
  const limit = parseInt(searchParams.get("limit") || "10");
  
  // Filter campaigns by niche/product if provided
  let campaigns = WINNING_CAMPAIGNS;
  if (niche) {
    campaigns = campaigns.filter(c => 
      c.niche.toLowerCase().includes(niche.toLowerCase())
    );
  }
  if (product) {
    campaigns = campaigns.filter(c => 
      c.product.toLowerCase().includes(product.toLowerCase())
    );
  }
  
  // Analyze and rank campaigns
  const rankedCampaigns = await analyzeCampaignPerformance(campaigns);
  
  return NextResponse.json({
    winners: rankedCampaigns.slice(0, limit),
    total: rankedCampaigns.length,
    etsyIntegration: await searchEtsyTopSellers(niche, product),
    note: "In production, this would pull real data from Etsy API, Printify analytics, and your campaign database"
  });
}

export async function POST(req: NextRequest) {
  const { niche, product, minSales = 100, minConversion = 2.0 } = await req.json();
  
  if (!niche || !product) {
    return NextResponse.json({ 
      error: "Provide 'niche' and 'product'" 
    }, { status: 400 });
  }
  
  // Filter by performance thresholds
  const qualifiedCampaigns = WINNING_CAMPAIGNS.filter(c => 
    c.niche.toLowerCase().includes(niche.toLowerCase()) &&
    c.product.toLowerCase().includes(product.toLowerCase()) &&
    c.sales >= minSales &&
    c.conversionRate >= minConversion
  );
  
  const rankedCampaigns = await analyzeCampaignPerformance(qualifiedCampaigns);
  
  return NextResponse.json({
    winners: rankedCampaigns,
    filters: { niche, product, minSales, minConversion },
    count: rankedCampaigns.length,
    etsyIntegration: await searchEtsyTopSellers(niche, product)
  });
}

