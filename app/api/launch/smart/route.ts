import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SmartLaunchRequest {
  niche: string;
  product: string;
  enhancementLevel?: "subtle" | "moderate" | "significant";
  sourceImageUrl?: string;
  autoFindWinners?: boolean;
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

export async function POST(req: NextRequest) {
  const body: SmartLaunchRequest = await req.json();
  const { 
    niche,
    product,
    enhancementLevel = "subtle",
    sourceImageUrl,
    autoFindWinners = true,
    printify
  } = body;
  
  if (!niche || !product) {
    return NextResponse.json({ 
      error: "Provide 'niche' and 'product'" 
    }, { status: 400 });
  }
  
  
  const steps: any[] = [];
  
  try {
    steps.push({ 
      step: "smart_launch_started",
      niche,
      product,
      enhancementLevel,
      autoFindWinners
    });
    
    // Step 1: Smart mockup generation (finds winners, enhances, creates mockup)
    const smartMockup = await post(`/api/mockups/smart`, {
      niche,
      product,
      autoFindWinners,
      enhancementLevel,
      sourceImageUrl
    });
    
    steps.push(...smartMockup.steps);
    
    // Step 2: Generate SEO content
    const seo = await post(`/api/seo/suggest`, { niche, product });
    steps.push({ 
      step: "seo_generated", 
      title: seo.title,
      tags: seo.tags.length 
    });
    
    // Step 3: Calculate pricing
    const calc = await post(`/api/calc/etsy`, { 
      itemPrice: 24.95, 
      buyerShipping: 6.95, 
      podBase: 12.20, 
      podShip: 7.50 
    });
    steps.push({ 
      step: "pricing_calculated", 
      profit: calc.outputs?.profit,
      breakeven: calc.outputs?.breakevenItemPrice 
    });
    
    // Step 4: Create Printify product (if config provided)
    let printifyProduct = null;
    if (printify && smartMockup.results.enhancedDesign) {
      printifyProduct = await post(`/api/pod/printify/product`, {
        title: seo.title,
        description: seo.description,
        blueprint_id: printify.blueprint_id ?? 6,
        print_provider_id: printify.print_provider_id ?? 1,
        variants: printify.variants ?? [{ id: 401, price: 1895, is_enabled: true }],
        print_areas: [{
          variant_ids: (printify.variants ?? [{ id: 401 }]).map((v: any) => v.id),
          placeholders: [{ 
            position: "front", 
            images: [{ src: smartMockup.results.enhancedDesign }] 
          }]
        }],
        tags: seo.tags
      });
      steps.push({ 
        step: "printify_product_created", 
        productId: printifyProduct.id 
      });
    }
    
    // Step 5: Publish to Etsy
    let etsyListing = null;
    if (smartMockup.results.mockup) {
      const price = calc.outputs?.breakevenItemPrice 
        ? Math.max(24.95, calc.outputs.breakevenItemPrice + 5) 
        : 24.95;
        
      etsyListing = await post(`/api/publish/etsy`, {
        title: seo.title,
        description: seo.description,
        price,
        quantity: 50,
        taxonomy_id: 1100,
        tags: seo.tags,
        materials: ["cotton", "ink"],
        shipping_profile_id: Number(process.env.DEFAULT_SHIPPING_PROFILE_ID || 0) || undefined,
        image_urls: [smartMockup.results.mockup]
      });
      steps.push({ 
        step: "etsy_listing_created", 
        listingId: etsyListing.listing_id 
      });
    }
    
    return NextResponse.json({
      success: true,
      niche,
      product,
      enhancementLevel,
      steps,
      results: {
        smartMockup: smartMockup.results,
        seo,
        calc,
        printifyProduct,
        etsyListing
      },
      summary: {
        originalImage: smartMockup.results.originalWinningImage,
        enhancedDesign: smartMockup.results.enhancedDesign,
        mockup: smartMockup.results.mockup,
        profit: calc.outputs?.profit,
        listingId: etsyListing?.listing_id
      }
    });
    
  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message || "Smart launch failed",
      steps,
      details: err
    }, { status: 500 });
  }
}

