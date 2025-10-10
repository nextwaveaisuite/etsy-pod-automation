import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface AutoLaunchRequest {
  niche?: string;
  product: string;
  autoDiscoverNiche?: boolean;
  style?: string;
  colorScheme?: string;
  sourceImageUrls?: string[];
  generateDesign?: boolean;
  printify?: {
    blueprint_id?: number;
    print_provider_id?: number;
    variants?: Array<{ id: number; price: number; is_enabled?: boolean }>;
  };
}

async function post(path: string, json: any) {
  const res = await fetch(path, { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(json) 
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function get(path: string) {
  const res = await fetch(path);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function POST(req: NextRequest) {
  const body: AutoLaunchRequest = await req.json();
  const { 
    niche,
    product,
    autoDiscoverNiche = false,
    style = "modern minimalist",
    colorScheme = "trendy",
    sourceImageUrls = [],
    generateDesign = true,
    printify
  } = body;
  
  if (!product) {
    return NextResponse.json({ 
      error: "Provide 'product' (e.g., 'tote bag', 'mug', 't-shirt')" 
    }, { status: 400 });
  }
  
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const steps: any[] = [];
  
  try {
    // Step 1: Discover or validate niche
    let selectedNiche = niche;
    if (autoDiscoverNiche || !niche) {
      const nicheData = await get(`${base}/api/niche/discover?limit=20`);
      selectedNiche = nicheData.niches[0]?.name || "Modern Minimalist";
      steps.push({ 
        step: "niche_discovery", 
        niche: selectedNiche,
        availableNiches: nicheData.niches.length 
      });
    } else {
      const nicheData = await post(`${base}/api/niche/discover`, { niche, product });
      steps.push({ 
        step: "niche_validation", 
        niche: nicheData.niche.name,
        searchTerms: nicheData.searchTerms 
      });
    }
    
    // Step 2: Source images (if URLs provided)
    let storedImages: string[] = [];
    if (sourceImageUrls.length > 0) {
      const imageData = await post(`${base}/api/niche/images`, {
        niche: selectedNiche,
        product,
        imageUrls: sourceImageUrls
      });
      storedImages = imageData.sourceImages || [];
      steps.push({ 
        step: "image_sourcing", 
        count: storedImages.length,
        images: storedImages 
      });
    }
    
    // Step 3: Generate/redesign design
    let designUrl = storedImages[0] || null;
    if (generateDesign) {
      const redesignData = await post(`${base}/api/design/redesign`, {
        niche: selectedNiche,
        product,
        style,
        colorScheme,
        sourceImageUrl: storedImages[0] || null
      });
      steps.push({ 
        step: "design_generation", 
        prompt: redesignData.prompt,
        style: redesignData.style,
        colorScheme: redesignData.colorScheme,
        note: "Ready for AI API integration"
      });
      
      // In production, this would use the AI-generated image
      // For now, use source image or placeholder
      designUrl = storedImages[0] || designUrl;
    }
    
    // Step 4: Generate SEO content
    const seo = await post(`${base}/api/seo/suggest`, { 
      niche: selectedNiche, 
      product 
    });
    steps.push({ 
      step: "seo_generation", 
      title: seo.title,
      tags: seo.tags.length 
    });
    
    // Step 5: Create mockup (if we have a design)
    let mockupUrl = null;
    if (designUrl) {
      const mockup = await post(`${base}/api/mockups/enhanced`, {
        product,
        designUrl,
        niche: selectedNiche,
        style,
        colorScheme
      });
      mockupUrl = mockup.url;
      steps.push({ 
        step: "mockup_generation", 
        url: mockupUrl 
      });
    }
    
    // Step 6: Calculate pricing
    const calc = await post(`${base}/api/calc/etsy`, { 
      itemPrice: 24.95, 
      buyerShipping: 6.95, 
      podBase: 12.20, 
      podShip: 7.50 
    });
    steps.push({ 
      step: "pricing_calculation", 
      profit: calc.outputs?.profit,
      breakeven: calc.outputs?.breakevenItemPrice 
    });
    
    // Step 7: Create Printify product (if design available)
    let printifyProduct = null;
    if (designUrl && printify) {
      printifyProduct = await post(`${base}/api/pod/printify/product`, {
        title: seo.title,
        description: seo.description,
        blueprint_id: printify.blueprint_id ?? 6,
        print_provider_id: printify.print_provider_id ?? 1,
        variants: printify.variants ?? [{ id: 401, price: 1895, is_enabled: true }],
        print_areas: [{
          variant_ids: (printify.variants ?? [{ id: 401 }]).map((v: any) => v.id),
          placeholders: [{ 
            position: "front", 
            images: [{ src: designUrl }] 
          }]
        }],
        tags: seo.tags
      });
      steps.push({ 
        step: "printify_product", 
        productId: printifyProduct.id 
      });
    }
    
    // Step 8: Publish to Etsy (if mockup available)
    let etsyListing = null;
    if (mockupUrl) {
      etsyListing = await post(`${base}/api/publish/etsy`, {
        title: seo.title,
        description: seo.description,
        price: calc.outputs?.breakevenItemPrice 
          ? Math.max(24.95, calc.outputs.breakevenItemPrice + 5) 
          : 24.95,
        quantity: 50,
        taxonomy_id: 1100,
        tags: seo.tags,
        materials: ["cotton", "ink"],
        shipping_profile_id: Number(process.env.DEFAULT_SHIPPING_PROFILE_ID || 0) || undefined,
        image_urls: [mockupUrl]
      });
      steps.push({ 
        step: "etsy_listing", 
        listingId: etsyListing.listing_id 
      });
    }
    
    return NextResponse.json({
      success: true,
      niche: selectedNiche,
      product,
      steps,
      results: {
        seo,
        calc,
        printifyProduct,
        etsyListing,
        mockupUrl,
        designUrl
      }
    });
    
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message || "Auto-launch failed",
      steps,
      details: err
    }, { status: 500 });
  }
}

