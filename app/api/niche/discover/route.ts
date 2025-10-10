import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Top trending niches with keywords for image search
const TOP_NICHES = [
  { name: "Wildflower Line Art", keywords: ["wildflower line art", "botanical line drawing", "minimal floral art"], category: "botanical" },
  { name: "Boho Aesthetic", keywords: ["boho aesthetic design", "bohemian pattern", "earthy boho art"], category: "lifestyle" },
  { name: "Minimalist Typography", keywords: ["minimalist typography", "modern quote design", "clean text art"], category: "typography" },
  { name: "Vintage Retro", keywords: ["vintage retro design", "70s aesthetic", "retro color palette"], category: "retro" },
  { name: "Geometric Abstract", keywords: ["geometric abstract art", "modern geometric pattern", "abstract shapes"], category: "abstract" },
  { name: "Watercolor Florals", keywords: ["watercolor floral art", "soft flower painting", "pastel botanical"], category: "botanical" },
  { name: "Cottagecore", keywords: ["cottagecore aesthetic", "cottage garden art", "pastoral design"], category: "lifestyle" },
  { name: "Dark Academia", keywords: ["dark academia aesthetic", "vintage book art", "scholarly design"], category: "lifestyle" },
  { name: "Celestial Moon", keywords: ["celestial moon art", "mystical moon design", "lunar phases"], category: "celestial" },
  { name: "Coastal Beach", keywords: ["coastal beach art", "ocean wave design", "nautical aesthetic"], category: "nature" },
  { name: "Mountain Landscape", keywords: ["mountain landscape art", "minimalist mountain", "nature silhouette"], category: "nature" },
  { name: "Succulent Plants", keywords: ["succulent plant art", "cactus illustration", "desert botanical"], category: "botanical" },
  { name: "Coffee Lover", keywords: ["coffee art design", "latte illustration", "coffee quote"], category: "food" },
  { name: "Pet Portraits", keywords: ["pet portrait art", "dog illustration", "cat line drawing"], category: "animals" },
  { name: "Zodiac Astrology", keywords: ["zodiac sign art", "astrology design", "constellation illustration"], category: "celestial" },
  { name: "Feminist Empowerment", keywords: ["feminist art design", "girl power illustration", "empowerment quote"], category: "social" },
  { name: "Mental Health", keywords: ["mental health art", "self care design", "mindfulness illustration"], category: "wellness" },
  { name: "Pride LGBTQ", keywords: ["pride flag art", "lgbtq design", "rainbow illustration"], category: "social" },
  { name: "Anime Aesthetic", keywords: ["anime aesthetic art", "manga style design", "kawaii illustration"], category: "pop-culture" },
  { name: "Mushroom Forest", keywords: ["mushroom forest art", "fungi illustration", "woodland mushroom"], category: "nature" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  
  return NextResponse.json({
    niches: TOP_NICHES.slice(0, limit),
    total: TOP_NICHES.length
  });
}

export async function POST(req: NextRequest) {
  const { niche, product } = await req.json();
  
  // Find matching niche or use custom
  let nicheData = TOP_NICHES.find(n => 
    n.name.toLowerCase().includes(niche.toLowerCase()) ||
    niche.toLowerCase().includes(n.name.toLowerCase())
  );
  
  if (!nicheData) {
    nicheData = {
      name: niche,
      keywords: [niche, `${niche} design`, `${niche} art`],
      category: "custom"
    };
  }
  
  return NextResponse.json({
    niche: nicheData,
    searchTerms: nicheData.keywords.map(k => `${k} ${product}`),
    product
  });
}

