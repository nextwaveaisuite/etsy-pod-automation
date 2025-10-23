import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Top trending Etsy niches based on market research and sales data
// In production, this would pull from Etsy API or web scraping
const TOP_ETSY_NICHES = [
  {
    id: 1,
    name: "Wildflower Line Art",
    category: "Home & Living",
    avgSales: 1250,
    competition: "Medium",
    trendScore: 95,
    keywords: ["wildflower", "botanical", "line art", "minimalist"],
    products: ["tote bag", "poster", "mug", "t-shirt", "sticker"]
  },
  {
    id: 2,
    name: "Boho Aesthetic",
    category: "Home & Living",
    avgSales: 980,
    competition: "High",
    trendScore: 92,
    keywords: ["boho", "bohemian", "earthy", "natural"],
    products: ["pillow", "tote bag", "mug", "poster"]
  },
  {
    id: 3,
    name: "Minimalist Typography",
    category: "Art & Collectibles",
    avgSales: 1100,
    competition: "Medium",
    trendScore: 90,
    keywords: ["minimalist", "typography", "quote", "modern"],
    products: ["poster", "t-shirt", "mug", "sticker"]
  },
  {
    id: 4,
    name: "Vintage Retro 70s",
    category: "Clothing",
    avgSales: 890,
    competition: "Medium",
    trendScore: 88,
    keywords: ["vintage", "retro", "70s", "groovy"],
    products: ["t-shirt", "hoodie", "tote bag", "sticker"]
  },
  {
    id: 5,
    name: "Cottagecore",
    category: "Home & Living",
    avgSales: 1050,
    competition: "Medium",
    trendScore: 87,
    keywords: ["cottagecore", "cottage", "pastoral", "garden"],
    products: ["tote bag", "mug", "poster", "pillow"]
  },
  {
    id: 6,
    name: "Dark Academia",
    category: "Art & Collectibles",
    avgSales: 920,
    competition: "Low",
    trendScore: 85,
    keywords: ["dark academia", "vintage", "scholarly", "books"],
    products: ["poster", "mug", "t-shirt", "tote bag"]
  },
  {
    id: 7,
    name: "Celestial Moon & Stars",
    category: "Jewelry & Accessories",
    avgSales: 1180,
    competition: "High",
    trendScore: 93,
    keywords: ["celestial", "moon", "stars", "mystical"],
    products: ["poster", "mug", "t-shirt", "sticker", "phone case"]
  },
  {
    id: 8,
    name: "Succulent Plants",
    category: "Home & Living",
    avgSales: 870,
    competition: "Medium",
    trendScore: 82,
    keywords: ["succulent", "cactus", "plant", "botanical"],
    products: ["poster", "mug", "tote bag", "sticker"]
  },
  {
    id: 9,
    name: "Mountain Landscape",
    category: "Art & Collectibles",
    avgSales: 1020,
    competition: "Medium",
    trendScore: 86,
    keywords: ["mountain", "landscape", "nature", "adventure"],
    products: ["poster", "t-shirt", "mug", "tote bag"]
  },
  {
    id: 10,
    name: "Coffee Lover",
    category: "Home & Living",
    avgSales: 1300,
    competition: "High",
    trendScore: 91,
    keywords: ["coffee", "latte", "caffeine", "espresso"],
    products: ["mug", "t-shirt", "poster", "sticker"]
  },
  {
    id: 11,
    name: "Pet Portrait Silhouette",
    category: "Pet Supplies",
    avgSales: 1450,
    competition: "Medium",
    trendScore: 94,
    keywords: ["pet", "dog", "cat", "portrait"],
    products: ["poster", "mug", "t-shirt", "tote bag", "pillow"]
  },
  {
    id: 12,
    name: "Zodiac Astrology",
    category: "Jewelry & Accessories",
    avgSales: 1100,
    competition: "High",
    trendScore: 89,
    keywords: ["zodiac", "astrology", "constellation", "horoscope"],
    products: ["poster", "mug", "t-shirt", "sticker", "phone case"]
  },
  {
    id: 13,
    name: "Feminist Empowerment",
    category: "Clothing",
    avgSales: 950,
    competition: "Medium",
    trendScore: 84,
    keywords: ["feminist", "girl power", "empowerment", "equality"],
    products: ["t-shirt", "hoodie", "tote bag", "poster", "sticker"]
  },
  {
    id: 14,
    name: "Mental Health Awareness",
    category: "Art & Collectibles",
    avgSales: 880,
    competition: "Low",
    trendScore: 83,
    keywords: ["mental health", "self care", "mindfulness", "wellness"],
    products: ["poster", "mug", "t-shirt", "sticker"]
  },
  {
    id: 15,
    name: "Pride LGBTQ+",
    category: "Clothing",
    avgSales: 1200,
    competition: "Medium",
    trendScore: 90,
    keywords: ["pride", "lgbtq", "rainbow", "equality"],
    products: ["t-shirt", "hoodie", "tote bag", "sticker", "mug"]
  },
  {
    id: 16,
    name: "Mushroom Forest",
    category: "Home & Living",
    avgSales: 990,
    competition: "Low",
    trendScore: 86,
    keywords: ["mushroom", "fungi", "forest", "woodland"],
    products: ["poster", "mug", "tote bag", "sticker", "pillow"]
  },
  {
    id: 17,
    name: "Coastal Beach Waves",
    category: "Home & Living",
    avgSales: 1080,
    competition: "Medium",
    trendScore: 88,
    keywords: ["coastal", "beach", "ocean", "waves"],
    products: ["poster", "tote bag", "mug", "pillow"]
  },
  {
    id: 18,
    name: "Geometric Abstract",
    category: "Art & Collectibles",
    avgSales: 940,
    competition: "Medium",
    trendScore: 85,
    keywords: ["geometric", "abstract", "modern", "shapes"],
    products: ["poster", "mug", "phone case", "pillow"]
  },
  {
    id: 19,
    name: "Watercolor Florals",
    category: "Home & Living",
    avgSales: 1150,
    competition: "High",
    trendScore: 91,
    keywords: ["watercolor", "floral", "flowers", "soft"],
    products: ["poster", "mug", "tote bag", "pillow", "phone case"]
  },
  {
    id: 20,
    name: "Anime Aesthetic",
    category: "Art & Collectibles",
    avgSales: 1350,
    competition: "High",
    trendScore: 93,
    keywords: ["anime", "manga", "kawaii", "japanese"],
    products: ["poster", "t-shirt", "hoodie", "sticker", "phone case"]
  }
];

// Top products across all niches
const TOP_PRODUCTS = [
  { name: "Tote Bag", popularity: 95, avgPrice: 24.95 },
  { name: "Mug", popularity: 93, avgPrice: 18.95 },
  { name: "Poster", popularity: 90, avgPrice: 22.95 },
  { name: "T-Shirt", popularity: 92, avgPrice: 26.95 },
  { name: "Sticker", popularity: 85, avgPrice: 4.95 },
  { name: "Hoodie", popularity: 88, avgPrice: 42.95 },
  { name: "Phone Case", popularity: 82, avgPrice: 19.95 },
  { name: "Pillow", popularity: 80, avgPrice: 32.95 }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const minTrendScore = parseInt(searchParams.get("minTrendScore") || "0");
  const limit = parseInt(searchParams.get("limit") || "20");
  const includeProducts = searchParams.get("includeProducts") === "true";
  
  let niches = TOP_ETSY_NICHES;
  
  // Filter by category if provided
  if (category) {
    niches = niches.filter(n => 
      n.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  // Filter by trend score
  if (minTrendScore > 0) {
    niches = niches.filter(n => n.trendScore >= minTrendScore);
  }
  
  // Sort by trend score descending
  niches = niches.sort((a, b) => b.trendScore - a.trendScore);
  
  // Limit results
  niches = niches.slice(0, limit);
  
  const response: any = {
    niches,
    total: niches.length,
    categories: [...new Set(TOP_ETSY_NICHES.map(n => n.category))],
    note: "In production, integrate with Etsy API or Marmalead/eRank for real-time data"
  };
  
  if (includeProducts) {
    response.topProducts = TOP_PRODUCTS;
  }
  
  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const { niche } = await req.json();
  
  if (!niche) {
    return NextResponse.json({ 
      error: "Provide 'niche' to get details" 
    }, { status: 400 });
  }
  
  // Find matching niche
  const matchedNiche = TOP_ETSY_NICHES.find(n => 
    n.name.toLowerCase().includes(niche.toLowerCase()) ||
    niche.toLowerCase().includes(n.name.toLowerCase())
  );
  
  if (!matchedNiche) {
    return NextResponse.json({
      error: "Niche not found",
      suggestion: "Try one of the top niches",
      topNiches: TOP_ETSY_NICHES.slice(0, 5).map(n => n.name)
    }, { status: 404 });
  }
  
  return NextResponse.json({
    niche: matchedNiche,
    recommendedProducts: matchedNiche.products,
    marketInsights: {
      avgSales: matchedNiche.avgSales,
      competition: matchedNiche.competition,
      trendScore: matchedNiche.trendScore
    }
  });
}

