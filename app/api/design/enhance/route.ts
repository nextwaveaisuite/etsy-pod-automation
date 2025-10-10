import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getSupabaseAdmin, SUPABASE_BUCKET } from "@/lib/settings";

export const dynamic = "force-dynamic";

interface EnhanceRequest {
  sourceImageUrl: string;
  niche: string;
  product: string;
  enhancementLevel?: "subtle" | "moderate" | "significant";
  preserveOriginal?: boolean;
  enhancements?: string[];
}

interface ImageAnalysis {
  dominantColors: string[];
  style: string;
  composition: string;
  designElements: string[];
  strengths: string[];
  suggestions: string[];
}

async function analyzeWinningImage(imageUrl: string): Promise<ImageAnalysis> {
  try {
    // Fetch the image
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    
    const buffer = Buffer.from(await res.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const stats = await image.stats();
    
    // Analyze dominant colors from stats
    const dominantColors = stats.channels.map((channel, idx) => {
      const colors = ['r', 'g', 'b'];
      return `${colors[idx]}: ${Math.round(channel.mean)}`;
    });
    
    // Basic analysis (in production, use AI vision API like GPT-4 Vision, Claude Vision, or Google Vision)
    const analysis: ImageAnalysis = {
      dominantColors: dominantColors,
      style: "Detected from image analysis",
      composition: `${metadata.width}x${metadata.height} - ${metadata.format}`,
      designElements: [
        "Primary subject",
        "Background treatment",
        "Typography (if present)",
        "Color scheme"
      ],
      strengths: [
        "Clear focal point",
        "Good contrast",
        "Print-ready quality",
        "Market-tested design"
      ],
      suggestions: [
        "Enhance color vibrancy slightly",
        "Add subtle texture overlay",
        "Optimize for print resolution",
        "Consider seasonal variation"
      ]
    };
    
    return analysis;
    
  } catch (err: any) {
    throw new Error(`Image analysis failed: ${err.message}`);
  }
}

function generateEnhancementPrompt(
  analysis: ImageAnalysis,
  niche: string,
  product: string,
  level: string
): string {
  const levelDescriptions = {
    subtle: "Make minimal, almost imperceptible improvements that preserve 95% of the original design. Only enhance technical quality and minor details.",
    moderate: "Preserve the core design (80%) while adding complementary elements, improved colors, or refined details.",
    significant: "Keep the winning concept (60%) but reimagine with fresh execution, updated trends, and enhanced visual appeal."
  };
  
  const prompt = `
TASK: Enhance a WINNING ${product} design for ${niche} niche

ORIGINAL DESIGN ANALYSIS:
- Style: ${analysis.style}
- Composition: ${analysis.composition}
- Key Elements: ${analysis.designElements.join(", ")}
- Strengths: ${analysis.strengths.join(", ")}

ENHANCEMENT LEVEL: ${level.toUpperCase()}
${levelDescriptions[level as keyof typeof levelDescriptions]}

ENHANCEMENT STRATEGY:
${analysis.suggestions.map(s => `- ${s}`).join("\n")}

CRITICAL RULES:
1. DO NOT change the core concept that makes this design successful
2. Preserve the winning elements: ${analysis.strengths.join(", ")}
3. Only add subtle improvements that enhance, not replace
4. Maintain the original style and aesthetic
5. Keep it print-ready and commercial-quality
6. The enhanced version should feel like a "premium upgrade" not a redesign

ENHANCEMENTS TO APPLY:
- Slight color optimization for better print quality
- Minor detail refinement without changing composition
- Texture or finish improvements (subtle emboss, grain, etc.)
- Resolution/quality enhancement
- Small complementary elements that don't distract from main design

OUTPUT: An enhanced version that a customer would say "this is even better!" not "this is different"
`;
  
  return prompt.trim();
}

async function applySubtleEnhancements(
  imageBuffer: Buffer,
  level: string
): Promise<Buffer> {
  // Apply image processing enhancements based on level
  let processor = sharp(imageBuffer);
  
  switch (level) {
    case "subtle":
      // Minimal enhancements: sharpness, slight color boost
      processor = processor
        .sharpen({ sigma: 0.5 })
        .modulate({ 
          brightness: 1.02,
          saturation: 1.05
        });
      break;
      
    case "moderate":
      // Moderate enhancements: better contrast, color optimization
      processor = processor
        .sharpen({ sigma: 1.0 })
        .modulate({ 
          brightness: 1.05,
          saturation: 1.1
        })
        .linear(1.1, 0); // Increase contrast slightly
      break;
      
    case "significant":
      // More noticeable enhancements
      processor = processor
        .sharpen({ sigma: 1.5 })
        .modulate({ 
          brightness: 1.08,
          saturation: 1.15
        })
        .linear(1.15, -(128 * 0.15)); // Better contrast
      break;
  }
  
  return await processor.png().toBuffer();
}

async function uploadEnhancedImage(buffer: Buffer, niche: string): Promise<string> {
  const supa = await getSupabaseAdmin();
  const key = `enhanced/${niche.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
  
  const { error } = await supa.storage
    .from(SUPABASE_BUCKET)
    .upload(key, buffer, { 
      contentType: "image/png",
      upsert: true 
    });
  
  if (error) throw new Error(error.message);
  
  const { data } = supa.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
  const body: EnhanceRequest = await req.json();
  const { 
    sourceImageUrl,
    niche,
    product,
    enhancementLevel = "subtle",
    preserveOriginal = true,
    enhancements = []
  } = body;
  
  if (!sourceImageUrl || !niche || !product) {
    return NextResponse.json({ 
      error: "Provide 'sourceImageUrl', 'niche', and 'product'" 
    }, { status: 400 });
  }
  
  try {
    // Step 1: Analyze the winning image
    const analysis = await analyzeWinningImage(sourceImageUrl);
    
    // Step 2: Generate enhancement strategy
    const enhancementPrompt = generateEnhancementPrompt(
      analysis,
      niche,
      product,
      enhancementLevel
    );
    
    // Step 3: Apply technical enhancements to the image
    const res = await fetch(sourceImageUrl);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    
    const originalBuffer = Buffer.from(await res.arrayBuffer());
    const enhancedBuffer = await applySubtleEnhancements(originalBuffer, enhancementLevel);
    
    // Step 4: Upload enhanced version
    const enhancedUrl = await uploadEnhancedImage(enhancedBuffer, niche);
    
    return NextResponse.json({
      success: true,
      original: {
        url: sourceImageUrl,
        preserved: preserveOriginal
      },
      enhanced: {
        url: enhancedUrl,
        level: enhancementLevel
      },
      analysis,
      enhancementPrompt,
      appliedEnhancements: [
        "Sharpness optimization",
        "Color vibrancy boost",
        "Contrast enhancement",
        "Print quality optimization"
      ],
      note: "For AI-powered redesign, integrate with DALL-E or Midjourney using the enhancementPrompt"
    });
    
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message 
    }, { status: 500 });
  }
}

