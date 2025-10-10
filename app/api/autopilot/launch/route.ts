import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Complete Automation Pipeline:
 * 1. Select opportunity from low-hanging fruit analyzer
 * 2. Get design from image library (or use winning campaign image)
 * 3. Enhance/edit image if needed
 * 4. Create product on selected print provider
 * 5. Generate mockups
 * 6. Optimize pricing for profit target
 * 7. Generate SEO (title, description, tags)
 * 8. Publish to Etsy
 * 9. Track analytics
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      opportunityId,
      imageSource, // 'library', 'winning', or 'url'
      imagePath,
      provider = 'printify',
      profitTarget = 10,
      autoPublish = true
    } = body;

    const pipeline: any[] = [];
    let currentStep = 1;

    // Step 1: Get opportunity details
    pipeline.push({ step: currentStep++, name: 'Analyze Opportunity', status: 'running' });
    
    const oppRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/opportunities/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId })
    });
    const oppData = await oppRes.json();
    
    if (!oppData.opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }
    
    const opportunity = oppData.opportunity;
    pipeline[pipeline.length - 1].status = 'complete';
    pipeline[pipeline.length - 1].data = { niche: opportunity.niche, product: opportunity.product };

    // Step 2: Get/Prepare Design
    pipeline.push({ step: currentStep++, name: 'Prepare Design', status: 'running' });
    
    let designUrl = imagePath;
    
    if (imageSource === 'winning') {
      // Get winning campaign image
      const winRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/campaigns/winners?niche=${encodeURIComponent(opportunity.niche)}`);
      const winData = await winRes.json();
      designUrl = winData.images?.[0]?.url || designUrl;
    }
    
    pipeline[pipeline.length - 1].status = 'complete';
    pipeline[pipeline.length - 1].data = { designUrl };

    // Step 3: Create Product on Provider
    pipeline.push({ step: currentStep++, name: 'Create on ' + provider, status: 'running' });
    
    // Mock provider creation (in production, call actual API)
    const productData = {
      title: opportunity.niche + ' ' + opportunity.product,
      blueprintId: getProductBlueprint(opportunity.product),
      variants: getProductVariants(opportunity.product),
      design: { imageUrl: designUrl }
    };
    
    pipeline[pipeline.length - 1].status = 'complete';
    pipeline[pipeline.length - 1].data = { productId: 'PROD-' + Date.now() };

    // Step 4: Generate Mockups
    pipeline.push({ step: currentStep++, name: 'Generate Mockups', status: 'running' });
    
    const mockups = [
      `https://via.placeholder.com/800x800/4F46E5/FFFFFF?text=${encodeURIComponent(opportunity.product)}+Front`,
      `https://via.placeholder.com/800x800/7C3AED/FFFFFF?text=${encodeURIComponent(opportunity.product)}+Back`
    ];
    
    pipeline[pipeline.length - 1].status = 'complete';
    pipeline[pipeline.length - 1].data = { mockups, count: mockups.length };

    // Step 5: Optimize Pricing
    pipeline.push({ step: currentStep++, name: 'Optimize Pricing', status: 'running' });
    
    const pricing = {
      podCost: opportunity.podCost,
      suggestedPrice: opportunity.suggestedPrice,
      profit: opportunity.estimatedProfit,
      margin: ((opportunity.estimatedProfit / opportunity.suggestedPrice) * 100).toFixed(2) + '%'
    };
    
    // Adjust if profit target not met
    if (opportunity.estimatedProfit < profitTarget) {
      const newPrice = opportunity.podCost + profitTarget + (opportunity.podCost * 0.25); // Add fees buffer
      pricing.suggestedPrice = parseFloat(newPrice.toFixed(2));
      pricing.profit = profitTarget;
      pricing.margin = ((profitTarget / pricing.suggestedPrice) * 100).toFixed(2) + '%';
    }
    
    pipeline[pipeline.length - 1].status = 'complete';
    pipeline[pipeline.length - 1].data = pricing;

    // Step 6: Generate SEO
    pipeline.push({ step: currentStep++, name: 'Generate SEO', status: 'running' });
    
    const seo = {
      title: `${opportunity.niche} ${opportunity.product} - ${opportunity.keywords[0]}`,
      description: `Beautiful ${opportunity.niche} ${opportunity.product}. Perfect gift for ${opportunity.targetAudience.join(', ')}. High quality print, fast shipping.`,
      tags: opportunity.keywords.slice(0, 13) // Etsy max
    };
    
    pipeline[pipeline.length - 1].status = 'complete';
    pipeline[pipeline.length - 1].data = seo;

    // Step 7: Publish to Etsy (if enabled)
    if (autoPublish) {
      pipeline.push({ step: currentStep++, name: 'Publish to Etsy', status: 'running' });
      
      // Mock Etsy publish (in production, call actual Etsy API)
      const listingId = 'ETSY-' + Date.now();
      
      pipeline[pipeline.length - 1].status = 'complete';
      pipeline[pipeline.length - 1].data = { 
        listingId, 
        url: `https://www.etsy.com/listing/${listingId}`,
        status: 'active'
      };
    }

    // Step 8: Track Analytics
    pipeline.push({ step: currentStep++, name: 'Track Analytics', status: 'running' });
    
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/analytics/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'product_created',
        data: { opportunity: opportunity.niche, product: opportunity.product }
      })
    });
    
    pipeline[pipeline.length - 1].status = 'complete';
    pipeline[pipeline.length - 1].data = { tracked: true };

    return NextResponse.json({
      success: true,
      pipeline,
      summary: {
        opportunity: opportunity.niche,
        product: opportunity.product,
        provider,
        pricing,
        seo,
        published: autoPublish,
        totalSteps: pipeline.length,
        completedSteps: pipeline.filter(p => p.status === 'complete').length
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Automation pipeline failed",
      details: error.message
    }, { status: 500 });
  }
}

function getProductBlueprint(productType: string): number {
  const blueprints: { [key: string]: number } = {
    'tote bag': 26,
    'mug': 11,
    't-shirt': 3,
    'poster': 18,
    'sticker': 445,
    'hoodie': 5,
    'phone case': 53,
    'pillow': 63
  };
  
  return blueprints[productType.toLowerCase()] || 3;
}

function getProductVariants(productType: string): any[] {
  // Simplified variants (in production, fetch from provider API)
  if (productType.toLowerCase().includes('shirt') || productType.toLowerCase().includes('hoodie')) {
    return [
      { id: 1, size: 'S', color: 'White' },
      { id: 2, size: 'M', color: 'White' },
      { id: 3, size: 'L', color: 'White' },
      { id: 4, size: 'XL', color: 'White' }
    ];
  }
  
  return [{ id: 1, variant: 'Standard' }];
}

