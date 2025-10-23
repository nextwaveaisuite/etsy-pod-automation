import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Low-hanging fruit opportunities: High traffic + Low competition + High profit
const OPPORTUNITIES = [
  {
    id: 1,
    niche: "Nurse Appreciation Gifts",
    product: "Tote Bag",
    monthlySearches: 18500,
    competition: 320,
    avgListings: 320,
    avgReviews: 12,
    avgPrice: 28.95,
    suggestedPrice: 29.95,
    estimatedProfit: 16.45,
    podCost: 13.00,
    trendScore: 92,
    seasonality: "Year-round with May spike",
    opportunityScore: 94.2,
    difficulty: "Easy",
    reasoning: [
      "High search volume (18.5K/month)",
      "Low competition (320 listings)",
      "Low average reviews (12) - easy to rank",
      "Consistent demand year-round",
      "High profit margin ($16.45)"
    ],
    keywords: ["nurse tote bag", "nurse appreciation gift", "nurse bag", "nursing student gift"],
    targetAudience: ["nurses", "nursing students", "healthcare workers"],
    designIdeas: ["Stethoscope illustrations", "Nurse quotes", "Medical symbols", "Heartbeat designs"]
  },
  {
    id: 2,
    niche: "Dog Mom Mugs",
    product: "Mug",
    monthlySearches: 24300,
    competition: 450,
    avgListings: 450,
    avgReviews: 18,
    avgPrice: 16.95,
    suggestedPrice: 17.95,
    estimatedProfit: 10.45,
    podCost: 7.00,
    trendScore: 96,
    seasonality: "Stable year-round",
    opportunityScore: 96.8,
    difficulty: "Easy",
    reasoning: [
      "Very high search volume (24.3K/month)",
      "Moderate competition (450 listings)",
      "Passionate niche - high conversion",
      "Repeat buyers common",
      "Easy to create variations"
    ],
    keywords: ["dog mom mug", "dog lover gift", "pet mom mug", "dog mama coffee mug"],
    targetAudience: ["dog owners", "pet lovers", "dog moms"],
    designIdeas: ["Paw prints", "Dog breed specific", "Funny dog quotes", "Dog mom typography"]
  },
  {
    id: 3,
    niche: "Teacher Planner Stickers",
    product: "Sticker Sheet",
    monthlySearches: 15200,
    competition: 280,
    avgListings: 280,
    avgReviews: 8,
    avgPrice: 4.95,
    suggestedPrice: 5.95,
    estimatedProfit: 4.45,
    podCost: 1.50,
    trendScore: 88,
    seasonality: "Aug-Sep peak, steady rest of year",
    opportunityScore: 91.5,
    difficulty: "Easy",
    reasoning: [
      "Good search volume (15.2K/month)",
      "Very low competition (280 listings)",
      "Very low avg reviews (8) - easy entry",
      "Teachers buy in bulk",
      "High profit margin (75%)"
    ],
    keywords: ["teacher planner stickers", "teacher stickers", "planner stickers", "classroom stickers"],
    targetAudience: ["teachers", "homeschool parents", "tutors"],
    designIdeas: ["Apple icons", "Grade stamps", "Subject icons", "Motivational phrases"]
  },
  {
    id: 4,
    niche: "Boho Wall Art",
    product: "Poster",
    monthlySearches: 22100,
    competition: 520,
    avgListings: 520,
    avgReviews: 15,
    avgPrice: 18.95,
    suggestedPrice: 19.95,
    estimatedProfit: 13.45,
    podCost: 6.50,
    trendScore: 94,
    seasonality: "Stable, slight spring increase",
    opportunityScore: 93.7,
    difficulty: "Easy",
    reasoning: [
      "High search volume (22.1K/month)",
      "Moderate competition (520 listings)",
      "Trending aesthetic",
      "High perceived value",
      "Easy to create variations"
    ],
    keywords: ["boho wall art", "bohemian poster", "boho printable", "neutral wall art"],
    targetAudience: ["home decorators", "millennials", "boho enthusiasts"],
    designIdeas: ["Neutral tones", "Abstract shapes", "Line art", "Minimalist botanicals"]
  },
  {
    id: 5,
    niche: "Gym Motivation Shirts",
    product: "T-Shirt",
    monthlySearches: 19800,
    competition: 410,
    avgListings: 410,
    avgReviews: 22,
    avgPrice: 24.95,
    suggestedPrice: 26.95,
    estimatedProfit: 13.45,
    podCost: 13.50,
    trendScore: 90,
    seasonality: "Jan peak (New Year), steady rest",
    opportunityScore: 89.3,
    difficulty: "Medium",
    reasoning: [
      "Strong search volume (19.8K/month)",
      "Moderate competition (410 listings)",
      "January spike opportunity",
      "Passionate niche",
      "Good profit margin"
    ],
    keywords: ["gym shirt", "workout shirt", "fitness tee", "motivation shirt"],
    targetAudience: ["gym goers", "fitness enthusiasts", "athletes"],
    designIdeas: ["Bold typography", "Motivational quotes", "Minimalist designs", "Gym humor"]
  },
  {
    id: 6,
    niche: "Grandma Est. Year Shirts",
    product: "T-Shirt",
    monthlySearches: 12400,
    competition: 190,
    avgListings: 190,
    avgReviews: 6,
    avgPrice: 22.95,
    suggestedPrice: 24.95,
    estimatedProfit: 11.45,
    podCost: 13.50,
    trendScore: 87,
    seasonality: "Mother's Day spike, steady rest",
    opportunityScore: 95.1,
    difficulty: "Easy",
    reasoning: [
      "Good search volume (12.4K/month)",
      "Very low competition (190 listings)",
      "Extremely low avg reviews (6) - EASY!",
      "Gift-giving occasions",
      "Personalization premium"
    ],
    keywords: ["grandma est shirt", "grandma established", "new grandma gift", "nana shirt"],
    targetAudience: ["new grandmothers", "gift buyers", "family"],
    designIdeas: ["Est. 2024 typography", "Floral accents", "Heart designs", "Vintage fonts"]
  },
  {
    id: 7,
    niche: "Reading Tracker Printables",
    product: "Planner/Printable",
    monthlySearches: 11200,
    competition: 165,
    avgListings: 165,
    avgReviews: 4,
    avgPrice: 3.95,
    suggestedPrice: 4.95,
    estimatedProfit: 4.95,
    podCost: 0,
    trendScore: 85,
    seasonality: "Jan spike, steady rest",
    opportunityScore: 97.8,
    difficulty: "Easy",
    reasoning: [
      "Solid search volume (11.2K/month)",
      "Very low competition (165 listings)",
      "Extremely low avg reviews (4) - EASIEST!",
      "Zero production cost (digital)",
      "100% profit margin",
      "Repeat buyers"
    ],
    keywords: ["reading tracker", "book tracker printable", "reading log", "book journal"],
    targetAudience: ["book lovers", "students", "book clubs"],
    designIdeas: ["Minimalist layouts", "Colorful designs", "Monthly/yearly formats", "Goal trackers"]
  },
  {
    id: 8,
    niche: "Plant Lady Tote Bags",
    product: "Tote Bag",
    monthlySearches: 14600,
    competition: 340,
    avgListings: 340,
    avgReviews: 14,
    avgPrice: 26.95,
    suggestedPrice: 28.95,
    estimatedProfit: 15.45,
    podCost: 13.00,
    trendScore: 91,
    seasonality: "Spring peak, stable rest",
    opportunityScore: 92.4,
    difficulty: "Easy",
    reasoning: [
      "Strong search volume (14.6K/month)",
      "Low competition (340 listings)",
      "Passionate niche community",
      "High profit margin",
      "Eco-friendly appeal"
    ],
    keywords: ["plant lady tote", "plant mom bag", "plant lover tote", "botanical tote bag"],
    targetAudience: ["plant enthusiasts", "millennials", "eco-conscious"],
    designIdeas: ["Botanical illustrations", "Plant quotes", "Minimalist leaves", "Funny plant puns"]
  },
  {
    id: 9,
    niche: "Camping Coffee Mugs",
    product: "Mug",
    monthlySearches: 16800,
    competition: 380,
    avgListings: 380,
    avgReviews: 16,
    avgPrice: 15.95,
    suggestedPrice: 17.95,
    estimatedProfit: 10.45,
    podCost: 7.00,
    trendScore: 89,
    seasonality: "Summer peak, steady rest",
    opportunityScore: 90.6,
    difficulty: "Easy",
    reasoning: [
      "Good search volume (16.8K/month)",
      "Moderate competition (380 listings)",
      "Gift-giving occasions",
      "Outdoor trend growing",
      "Good profit margin"
    ],
    keywords: ["camping mug", "outdoor coffee mug", "adventure mug", "camp coffee cup"],
    targetAudience: ["campers", "outdoor enthusiasts", "hikers"],
    designIdeas: ["Mountain scenes", "Campfire illustrations", "Adventure quotes", "Nature themes"]
  },
  {
    id: 10,
    niche: "Sarcastic Office Posters",
    product: "Poster",
    monthlySearches: 13500,
    competition: 295,
    avgListings: 295,
    avgReviews: 11,
    avgPrice: 16.95,
    suggestedPrice: 18.95,
    estimatedProfit: 12.45,
    podCost: 6.50,
    trendScore: 86,
    seasonality: "Stable year-round",
    opportunityScore: 91.2,
    difficulty: "Easy",
    reasoning: [
      "Solid search volume (13.5K/month)",
      "Low competition (295 listings)",
      "Low avg reviews (11) - easy to rank",
      "Office gift market",
      "High shareability"
    ],
    keywords: ["funny office poster", "sarcastic wall art", "office humor print", "work meme poster"],
    targetAudience: ["office workers", "remote workers", "gift buyers"],
    designIdeas: ["Bold typography", "Minimalist humor", "Office jokes", "Relatable quotes"]
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const minScore = parseFloat(searchParams.get("minScore") || "85");
  const maxCompetition = parseInt(searchParams.get("maxCompetition") || "500");
  const minProfit = parseFloat(searchParams.get("minProfit") || "8");
  const productType = searchParams.get("product");
  const sort = searchParams.get("sort") || "score"; // score, profit, traffic, competition
  
  let filtered = OPPORTUNITIES.filter(opp => 
    opp.opportunityScore >= minScore &&
    opp.competition <= maxCompetition &&
    opp.estimatedProfit >= minProfit
  );
  
  if (productType) {
    filtered = filtered.filter(opp => 
      opp.product.toLowerCase().includes(productType.toLowerCase())
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case 'profit':
        return b.estimatedProfit - a.estimatedProfit;
      case 'traffic':
        return b.monthlySearches - a.monthlySearches;
      case 'competition':
        return a.competition - b.competition;
      case 'score':
      default:
        return b.opportunityScore - a.opportunityScore;
    }
  });
  
  return NextResponse.json({
    opportunities: filtered,
    total: filtered.length,
    filters: { minScore, maxCompetition, minProfit, productType, sort },
    summary: {
      avgOpportunityScore: filtered.reduce((sum, o) => sum + o.opportunityScore, 0) / filtered.length,
      avgProfit: filtered.reduce((sum, o) => sum + o.estimatedProfit, 0) / filtered.length,
      avgCompetition: filtered.reduce((sum, o) => sum + o.competition, 0) / filtered.length,
      totalMonthlySearches: filtered.reduce((sum, o) => sum + o.monthlySearches, 0)
    }
  });
}

// Get single opportunity details
export async function POST(req: NextRequest) {
  const { opportunityId } = await req.json();
  
  const opportunity = OPPORTUNITIES.find(o => o.id === opportunityId);
  
  if (!opportunity) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }
  
  // Calculate detailed metrics
  const competitionRatio = opportunity.monthlySearches / opportunity.competition;
  const profitMargin = (opportunity.estimatedProfit / opportunity.suggestedPrice) * 100;
  const easeOfEntry = 100 - (opportunity.avgReviews * 2); // Lower reviews = easier
  
  return NextResponse.json({
    opportunity,
    metrics: {
      competitionRatio: competitionRatio.toFixed(2),
      profitMargin: profitMargin.toFixed(2) + '%',
      easeOfEntry: easeOfEntry.toFixed(1),
      estimatedMonthlySales: Math.round(opportunity.monthlySearches * 0.02), // 2% conversion estimate
      estimatedMonthlyRevenue: Math.round(opportunity.monthlySearches * 0.02 * opportunity.suggestedPrice),
      estimatedMonthlyProfit: Math.round(opportunity.monthlySearches * 0.02 * opportunity.estimatedProfit)
    },
    recommendation: {
      action: "CREATE NOW",
      priority: opportunity.opportunityScore >= 95 ? "HIGH" : opportunity.opportunityScore >= 90 ? "MEDIUM" : "NORMAL",
      timeToMarket: "1-2 days",
      expectedROI: "300-500%"
    }
  });
}
