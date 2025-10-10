import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getSupabaseAdmin, SUPABASE_BUCKET } from "@/lib/settings";

export const dynamic = "force-dynamic";

interface MockupRequest {
  product: string;
  designUrl?: string;
  niche?: string;
  autoGenerate?: boolean;
  style?: string;
  colorScheme?: string;
  backgroundColor?: string;
}

// Product mockup templates with realistic positioning
const PRODUCT_TEMPLATES = {
  "tote": {
    canvasWidth: 1600,
    canvasHeight: 1200,
    designWidth: 800,
    designHeight: 800,
    designX: 400,
    designY: 200,
    backgroundColor: "#f5f5f5"
  },
  "mug": {
    canvasWidth: 1600,
    canvasHeight: 1200,
    designWidth: 600,
    designHeight: 600,
    designX: 500,
    designY: 300,
    backgroundColor: "#ffffff"
  },
  "tshirt": {
    canvasWidth: 1600,
    canvasHeight: 1800,
    designWidth: 700,
    designHeight: 700,
    designX: 450,
    designY: 400,
    backgroundColor: "#f8f8f8"
  },
  "poster": {
    canvasWidth: 1200,
    canvasHeight: 1600,
    designWidth: 1000,
    designHeight: 1400,
    designX: 100,
    designY: 100,
    backgroundColor: "#ffffff"
  },
  "sticker": {
    canvasWidth: 1200,
    canvasHeight: 1200,
    designWidth: 1000,
    designHeight: 1000,
    designX: 100,
    designY: 100,
    backgroundColor: "#f0f0f0"
  },
  "phonecase": {
    canvasWidth: 1200,
    canvasHeight: 1600,
    designWidth: 800,
    designHeight: 1200,
    designX: 200,
    designY: 200,
    backgroundColor: "#e8e8e8"
  },
  "pillow": {
    canvasWidth: 1600,
    canvasHeight: 1600,
    designWidth: 1200,
    designHeight: 1200,
    designX: 200,
    designY: 200,
    backgroundColor: "#fafafa"
  },
  "hoodie": {
    canvasWidth: 1600,
    canvasHeight: 1800,
    designWidth: 700,
    designHeight: 700,
    designX: 450,
    designY: 450,
    backgroundColor: "#f5f5f5"
  }
};

async function uploadPNG(buffer: Buffer, key: string): Promise<string> {
  const supa = await getSupabaseAdmin();
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

async function createMockup(
  designUrl: string, 
  productType: string, 
  bgColor?: string
): Promise<Buffer> {
  // Get product template or use default
  const template = PRODUCT_TEMPLATES[productType as keyof typeof PRODUCT_TEMPLATES] 
    || PRODUCT_TEMPLATES.tote;
  
  const { 
    canvasWidth, 
    canvasHeight, 
    designWidth, 
    designHeight, 
    designX, 
    designY, 
    backgroundColor 
  } = template;
  
  // Create base canvas
  const canvas = sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: bgColor || backgroundColor
    }
  });
  
  // Fetch and process design
  const designRes = await fetch(designUrl);
  if (!designRes.ok) {
    throw new Error(`Failed to fetch design: ${designRes.statusText}`);
  }
  
  const designBuffer = Buffer.from(await designRes.arrayBuffer());
  const processedDesign = await sharp(designBuffer)
    .resize(designWidth, designHeight, { 
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
  
  // Composite design onto canvas
  const mockup = await canvas
    .composite([{ 
      input: processedDesign, 
      top: designY, 
      left: designX 
    }])
    .png()
    .toBuffer();
  
  return mockup;
}

export async function POST(req: NextRequest) {
  const body: MockupRequest = await req.json();
  const { 
    product = "tote", 
    designUrl, 
    niche, 
    autoGenerate = false,
    style,
    colorScheme,
    backgroundColor 
  } = body;
  
  try {
    // If auto-generate is enabled and no design URL, trigger AI generation
    if (autoGenerate && !designUrl && niche) {
      return NextResponse.json({
        error: "Auto-generation requires AI integration",
        suggestion: "Call /api/design/redesign first to generate a design",
        niche,
        product,
        style: style || "modern minimalist",
        colorScheme: colorScheme || "trendy"
      }, { status: 400 });
    }
    
    if (!designUrl) {
      return NextResponse.json({ 
        error: "Provide 'designUrl' or enable 'autoGenerate' with 'niche'" 
      }, { status: 400 });
    }
    
    // Normalize product type
    const productType = product.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/bag/g, '')
      .replace(/shirt/g, 'shirt')
      .replace(/case/g, 'case');
    
    // Create mockup
    const mockupBuffer = await createMockup(designUrl, productType, backgroundColor);
    
    // Upload to storage
    const key = `mockups/${productType}-${niche?.replace(/\s+/g, '-') || 'design'}-${Date.now()}.png`;
    const url = await uploadPNG(mockupBuffer, key);
    
    return NextResponse.json({
      success: true,
      url,
      product: productType,
      niche: niche || null,
      designUrl
    });
    
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message 
    }, { status: 500 });
  }
}

