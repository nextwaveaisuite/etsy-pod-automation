import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Multi-provider configuration
const PROVIDERS = {
  printify: {
    name: "Printify",
    apiBase: process.env.PRINTIFY_API_BASE || "https://api.printify.com/v1",
    shopId: process.env.PRINTIFY_SHOP_ID,
    token: process.env.PRINTIFY_TOKEN,
    enabled: true,
    products: ["t-shirt", "hoodie", "mug", "tote bag", "poster", "phone case", "pillow", "sticker"],
    features: ["mockups", "variants", "auto-fulfill"]
  },
  printful: {
    name: "Printful",
    apiBase: "https://api.printful.com",
    token: process.env.PRINTFUL_TOKEN,
    enabled: !!process.env.PRINTFUL_TOKEN,
    products: ["t-shirt", "hoodie", "mug", "tote bag", "poster", "phone case", "pillow", "leggings"],
    features: ["mockups", "variants", "auto-fulfill", "warehousing"]
  },
  gelato: {
    name: "Gelato",
    apiBase: "https://api.gelato.com/v1",
    token: process.env.GELATO_TOKEN,
    enabled: !!process.env.GELATO_TOKEN,
    products: ["poster", "canvas", "mug", "t-shirt", "tote bag", "phone case", "pillow"],
    features: ["mockups", "local-production", "fast-shipping"]
  },
  customcat: {
    name: "CustomCat",
    apiBase: "https://api.customcat.com/v1",
    token: process.env.CUSTOMCAT_TOKEN,
    enabled: !!process.env.CUSTOMCAT_TOKEN,
    products: ["t-shirt", "hoodie", "mug", "tote bag", "poster", "blanket"],
    features: ["mockups", "variants"]
  }
};

// Get all providers
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  
  if (action === "list") {
    return NextResponse.json({
      providers: Object.entries(PROVIDERS).map(([id, config]) => ({
        id,
        ...config,
        configured: config.enabled && !!config.token
      }))
    });
  }
  
  if (action === "products") {
    const providerId = searchParams.get("provider");
    if (!providerId || !PROVIDERS[providerId as keyof typeof PROVIDERS]) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }
    
    const provider = PROVIDERS[providerId as keyof typeof PROVIDERS];
    return NextResponse.json({
      provider: providerId,
      products: provider.products,
      features: provider.features
    });
  }
  
  return NextResponse.json({ providers: PROVIDERS });
}

// Create product on provider
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { provider, product, design, options } = body;
  
  if (!provider || !PROVIDERS[provider as keyof typeof PROVIDERS]) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }
  
  const providerConfig = PROVIDERS[provider as keyof typeof PROVIDERS];
  
  if (!providerConfig.enabled || !providerConfig.token) {
    return NextResponse.json({ 
      error: `${providerConfig.name} not configured. Add API token to environment variables.` 
    }, { status: 400 });
  }
  
  try {
    // Route to appropriate provider
    switch (provider) {
      case 'printify':
        return await createPrintifyProduct(providerConfig, product, design, options);
      case 'printful':
        return await createPrintfulProduct(providerConfig, product, design, options);
      case 'gelato':
        return await createGelatoProduct(providerConfig, product, design, options);
      case 'customcat':
        return await createCustomCatProduct(providerConfig, product, design, options);
      default:
        return NextResponse.json({ error: "Provider not implemented" }, { status: 501 });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: `Failed to create product on ${providerConfig.name}`,
      details: error.message
    }, { status: 500 });
  }
}

// Printify implementation
async function createPrintifyProduct(config: any, product: any, design: any, options: any) {
  const res = await fetch(`${config.apiBase}/shops/${config.shopId}/products.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: options.title || product.title,
      description: options.description || product.description,
      blueprint_id: product.blueprintId || 3, // T-shirt default
      print_provider_id: product.printProviderId || 99,
      variants: product.variants || [],
      print_areas: [{
        variant_ids: product.variants?.map((v: any) => v.id) || [],
        placeholders: [{
          position: 'front',
          images: [{
            id: design.imageId,
            x: 0.5,
            y: 0.5,
            scale: 1,
            angle: 0
          }]
        }]
      }]
    })
  });
  
  const data = await res.json();
  
  return NextResponse.json({
    success: true,
    provider: 'printify',
    productId: data.id,
    data
  });
}

// Printful implementation
async function createPrintfulProduct(config: any, product: any, design: any, options: any) {
  const res = await fetch(`${config.apiBase}/store/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sync_product: {
        name: options.title || product.title,
        thumbnail: design.imageUrl
      },
      sync_variants: product.variants || []
    })
  });
  
  const data = await res.json();
  
  return NextResponse.json({
    success: true,
    provider: 'printful',
    productId: data.result?.id,
    data: data.result
  });
}

// Gelato implementation
async function createGelatoProduct(config: any, product: any, design: any, options: any) {
  const res = await fetch(`${config.apiBase}/products`, {
    method: 'POST',
    headers: {
      'X-API-KEY': config.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productUid: product.productUid || 'poster_30x40cm',
      files: [{
        url: design.imageUrl,
        type: 'default'
      }],
      quantity: 1
    })
  });
  
  const data = await res.json();
  
  return NextResponse.json({
    success: true,
    provider: 'gelato',
    productId: data.productId,
    data
  });
}

// CustomCat implementation
async function createCustomCatProduct(config: any, product: any, design: any, options: any) {
  const res = await fetch(`${config.apiBase}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: options.title || product.title,
      sku: product.sku,
      design_url: design.imageUrl,
      product_type: product.type || 'tshirt'
    })
  });
  
  const data = await res.json();
  
  return NextResponse.json({
    success: true,
    provider: 'customcat',
    productId: data.id,
    data
  });
}

