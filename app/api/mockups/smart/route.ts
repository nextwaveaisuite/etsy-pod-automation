import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SmartMockupRequest {
  niche: string;
  product: string;
  autoFindWinners?: boolean;
  enhancementLevel?: "subtle" | "moderate" | "significant";
  sourceImageUrl?: string;
}

async function post(path: string, json: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  const res = await fetch(url, { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(json) 
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function get(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function POST(req: NextRequest) {
  const body: SmartMockupRequest = await req.json();
  const { 
    niche,
    product,
    autoFindWinners = true,
    enhancementLevel = "subtle",
    sourceImageUrl
  } = body;
  
  if (!niche || !product) {
    return NextResponse.json({ 
      error: "Provide 'niche' and 'product'" 
    }, { status: 400 });
  }
  
  const steps: any[] = [];
  
  try {
    let winningImageUrl = sourceImageUrl;
    
    // Step 1: Find winning campaigns if auto-discover is enabled
    if (autoFindWinners && !sourceImageUrl) {
      steps.push({ step: "finding_winners", status: "in_progress" });
      
      const winners = await get(
        `/api/campaigns/winners?niche=${encodeURIComponent(niche)}&product=${encodeURIComponent(product)}&limit=5`
      );
      
      if (winners.winners && winners.winners.length > 0) {
        winningImageUrl = winners.winners[0].imageUrl;
        steps.push({ 
          step: "winners_found", 
          count: winners.winners.length,
          topWinner: winners.winners[0],
          imageUrl: winningImageUrl
        });
      } else {
        steps.push({ 
          step: "no_winners_found", 
          note: "No winning campaigns found, will use placeholder or provided image"
        });
      }
    }
    
    // If still no image, we need one
    if (!winningImageUrl) {
      return NextResponse.json({
        error: "No winning image found. Provide 'sourceImageUrl' or ensure winning campaigns exist for this niche/product",
        steps,
        suggestion: "Add winning campaign data or provide a source image URL"
      }, { status: 400 });
    }
    
    // Step 2: Analyze and enhance the winning image
    steps.push({ step: "analyzing_image", imageUrl: winningImageUrl });
    
    const enhanced = await post(`/api/design/enhance`, {
      sourceImageUrl: winningImageUrl,
      niche,
      product,
      enhancementLevel,
      preserveOriginal: true
    });
    
    steps.push({ 
      step: "image_enhanced",
      analysis: enhanced.analysis,
      enhancedUrl: enhanced.enhanced.url,
      level: enhancementLevel
    });
    
    // Step 3: Generate mockup with enhanced image
    steps.push({ step: "generating_mockup" });
    
    const mockup = await post(`/api/mockups/enhanced`, {
      product,
      designUrl: enhanced.enhanced.url,
      niche
    });
    
    steps.push({ 
      step: "mockup_generated",
      mockupUrl: mockup.url
    });
    
    return NextResponse.json({
      success: true,
      niche,
      product,
      steps,
      results: {
        originalWinningImage: winningImageUrl,
        enhancedDesign: enhanced.enhanced.url,
        mockup: mockup.url,
        analysis: enhanced.analysis,
        enhancementLevel,
        appliedEnhancements: enhanced.appliedEnhancements
      },
      workflow: {
        step1: "Found winning campaign image",
        step2: `Applied ${enhancementLevel} enhancements while preserving winning elements`,
        step3: "Generated product mockup with enhanced design"
      }
    });
    
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message || "Smart mockup generation failed",
      steps,
      details: err
    }, { status: 500 });
  }
}

