import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, SUPABASE_BUCKET } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function searchImages(query: string, count: number = 5) {
  // This would integrate with image search APIs in production
  // For now, we'll return structured data for the AI redesign system
  const searchTerms = [
    `${query} design`,
    `${query} illustration`,
    `${query} art`,
    `${query} pattern`,
    `${query} aesthetic`
  ];
  
  return {
    query,
    searchTerms,
    count,
    // In production, this would fetch actual URLs from image search APIs
    // like Unsplash, Pexels, or custom scraping
    note: "Image URLs would be fetched from search APIs in production"
  };
}

async function downloadAndStore(imageUrl: string, key: string) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    
    const buffer = Buffer.from(await res.arrayBuffer());
    const supa = await getSupabaseAdmin();
    
    const { error } = await supa.storage
      .from(SUPABASE_BUCKET)
      .upload(key, buffer, { 
        contentType: res.headers.get('content-type') || 'image/jpeg',
        upsert: true 
      });
    
    if (error) throw new Error(error.message);
    
    const { data } = supa.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
    return data.publicUrl;
  } catch (err: any) {
    throw new Error(`Download failed: ${err.message}`);
  }
}

export async function POST(req: NextRequest) {
  const { niche, product, count = 5, imageUrls = [] } = await req.json();
  
  if (!niche || !product) {
    return NextResponse.json({ 
      error: "Provide 'niche' and 'product'" 
    }, { status: 400 });
  }
  
  // If image URLs are provided, download and store them
  if (imageUrls && imageUrls.length > 0) {
    const stored = [];
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const key = `niche-source/${niche.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${i}.jpg`;
        const url = await downloadAndStore(imageUrls[i], key);
        stored.push(url);
      } catch (err: any) {
        console.error(`Failed to download image ${i}:`, err.message);
      }
    }
    
    return NextResponse.json({
      niche,
      product,
      sourceImages: stored,
      count: stored.length
    });
  }
  
  // Otherwise, return search data for manual/API integration
  const searchData = await searchImages(`${niche} ${product}`, count);
  
  return NextResponse.json({
    niche,
    product,
    searchData,
    note: "Provide imageUrls array to download and store images"
  });
}

