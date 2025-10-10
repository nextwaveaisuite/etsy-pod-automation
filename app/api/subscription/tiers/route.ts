import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Subscription tiers (not exported as route handler)
const TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    features: {
      // Image Management
      imageUpload: true,
      zipUpload: false, // ❌ Locked
      maxImages: 10,
      imageLibrary: true,
      
      // Image Editor
      imageEditor: true,
      editorFeatures: ['resize', 'rotate'], // Limited
      advancedEditing: false, // ❌ No filters, text overlay, etc.
      
      // Providers
      providers: ['printify'], // Only Printify
      multiProvider: false, // ❌ Can't switch providers
      
      // Opportunities
      viewOpportunities: true,
      opportunitiesLimit: 3, // Only see top 3
      detailedAnalysis: false, // ❌ No detailed metrics
      
      // Automation
      autoPublish: false, // ❌ Manual publishing
      autoPrice: false, // ❌ Manual pricing
      autoSEO: false, // ❌ Manual SEO
      autopilot: false, // ❌ No autopilot
      
      // Analytics
      basicAnalytics: true,
      advancedAnalytics: false, // ❌ Limited data
      exportData: false, // ❌ Can't export
      
      // Support
      aiChatbot: true,
      chatLimit: 10, // 10 messages per day
      prioritySupport: false,
      
      // Products
      maxProducts: 5,
      maxListings: 5
    },
    limitations: [
      "Manual upload only (no zip extraction)",
      "Basic image editing (resize, rotate only)",
      "Single provider (Printify)",
      "Top 3 opportunities only",
      "Manual publishing & pricing",
      "Basic analytics",
      "10 AI chat messages/day",
      "Max 5 products"
    ]
  },
  
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    period: 'month',
    features: {
      imageUpload: true,
      zipUpload: true, // ✅ Unlocked
      maxImages: 100,
      imageLibrary: true,
      
      imageEditor: true,
      editorFeatures: ['resize', 'rotate', 'crop', 'brightness', 'contrast', 'filters'],
      advancedEditing: true, // ✅ Most features
      textOverlay: false, // ❌ Still locked
      
      providers: ['printify', 'printful'],
      multiProvider: true,
      
      viewOpportunities: true,
      opportunitiesLimit: 10,
      detailedAnalysis: true,
      
      autoPublish: true, // ✅ Auto-publish
      autoPrice: true, // ✅ Auto-pricing
      autoSEO: false, // ❌ Still manual
      autopilot: false,
      
      basicAnalytics: true,
      advancedAnalytics: true,
      exportData: false,
      
      aiChatbot: true,
      chatLimit: 50,
      prioritySupport: false,
      
      maxProducts: 50,
      maxListings: 50
    },
    limitations: [
      "No text overlay on images",
      "Manual SEO optimization",
      "No autopilot mode",
      "Can't export analytics data",
      "50 AI chat messages/day",
      "Max 50 products"
    ]
  },
  
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: 'month',
    features: {
      imageUpload: true,
      zipUpload: true,
      maxImages: 500,
      imageLibrary: true,
      
      imageEditor: true,
      editorFeatures: ['resize', 'rotate', 'crop', 'brightness', 'contrast', 'filters', 'blur', 'sharpen'],
      advancedEditing: true,
      textOverlay: true, // ✅ Unlocked
      
      providers: ['printify', 'printful', 'gelato', 'customcat'],
      multiProvider: true,
      
      viewOpportunities: true,
      opportunitiesLimit: -1, // Unlimited
      detailedAnalysis: true,
      
      autoPublish: true,
      autoPrice: true,
      autoSEO: true, // ✅ Auto-SEO
      autopilot: false, // ❌ Still locked
      
      basicAnalytics: true,
      advancedAnalytics: true,
      exportData: true, // ✅ Can export
      
      aiChatbot: true,
      chatLimit: 200,
      prioritySupport: true,
      
      maxProducts: 500,
      maxListings: 500
    },
    limitations: [
      "No autopilot mode",
      "200 AI chat messages/day",
      "Max 500 products"
    ]
  },
  
  owner: {
    id: 'owner',
    name: 'Owner',
    price: 0,
    period: 'lifetime',
    features: {
      imageUpload: true,
      zipUpload: true,
      maxImages: -1, // Unlimited
      imageLibrary: true,
      
      imageEditor: true,
      editorFeatures: 'all',
      advancedEditing: true,
      textOverlay: true,
      
      providers: 'all',
      multiProvider: true,
      
      viewOpportunities: true,
      opportunitiesLimit: -1,
      detailedAnalysis: true,
      
      autoPublish: true,
      autoPrice: true,
      autoSEO: true,
      autopilot: true, // ✅ Full autopilot
      
      basicAnalytics: true,
      advancedAnalytics: true,
      exportData: true,
      
      aiChatbot: true,
      chatLimit: -1, // Unlimited
      prioritySupport: true,
      
      maxProducts: -1, // Unlimited
      maxListings: -1, // Unlimited
      
      // Owner-only features
      adminAccess: true,
      userManagement: true,
      platformSettings: true,
      allIntegrations: true
    },
    limitations: []
  }
};

// Helper functions (not exported as route handlers)
function hasAccess(userTier: string, feature: string): boolean {
  const tier = TIERS[userTier as keyof typeof TIERS];
  if (!tier) return false;
  
  // Owner has access to everything
  if (userTier === 'owner') return true;
  
  // Check specific feature
  return (tier.features as any)[feature] === true || (tier.features as any)[feature] === 'all';
}

function getTierLimit(userTier: string, limitType: string): number {
  const tier = TIERS[userTier as keyof typeof TIERS];
  if (!tier) return 0;
  
  const limit = (tier.features as any)[limitType];
  return typeof limit === 'number' ? limit : 0;
}

// API endpoints
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  if (action === 'compare') {
    return NextResponse.json({
      tiers: Object.values(TIERS).filter(t => t.id !== 'owner'),
      comparison: generateComparison()
    });
  }
  
  return NextResponse.json({
    tiers: TIERS
  });
}

// Check access
export async function POST(req: NextRequest) {
  const { userTier, feature } = await req.json();
  
  const access = hasAccess(userTier, feature);
  const tier = TIERS[userTier as keyof typeof TIERS];
  
  return NextResponse.json({
    access,
    tier: tier?.name,
    upgradeRequired: !access,
    suggestedTier: access ? null : getSuggestedUpgrade(feature)
  });
}

function getSuggestedUpgrade(feature: string): string {
  // Determine which tier unlocks this feature
  for (const [tierId, tier] of Object.entries(TIERS)) {
    if (tierId === 'owner') continue;
    if ((tier.features as any)[feature] === true || (tier.features as any)[feature] === 'all') {
      return tierId;
    }
  }
  return 'pro';
}

function generateComparison() {
  return {
    features: [
      {
        category: "Image Management",
        items: [
          { name: "Upload Images", free: "✅", starter: "✅", pro: "✅" },
          { name: "Zip Upload & Extract", free: "❌", starter: "✅", pro: "✅" },
          { name: "Max Images", free: "10", starter: "100", pro: "500" }
        ]
      },
      {
        category: "Image Editor",
        items: [
          { name: "Basic Editing", free: "✅", starter: "✅", pro: "✅" },
          { name: "Filters & Effects", free: "❌", starter: "✅", pro: "✅" },
          { name: "Text Overlay", free: "❌", starter: "❌", pro: "✅" }
        ]
      },
      {
        category: "Print Providers",
        items: [
          { name: "Printify", free: "✅", starter: "✅", pro: "✅" },
          { name: "Multiple Providers", free: "❌", starter: "✅", pro: "✅" },
          { name: "All Providers", free: "❌", starter: "❌", pro: "✅" }
        ]
      },
      {
        category: "Automation",
        items: [
          { name: "Auto-Publish", free: "❌", starter: "✅", pro: "✅" },
          { name: "Auto-Pricing", free: "❌", starter: "✅", pro: "✅" },
          { name: "Auto-SEO", free: "❌", starter: "❌", pro: "✅" },
          { name: "Autopilot Mode", free: "❌", starter: "❌", pro: "❌" }
        ]
      },
      {
        category: "Analytics",
        items: [
          { name: "Basic Analytics", free: "✅", starter: "✅", pro: "✅" },
          { name: "Advanced Analytics", free: "❌", starter: "✅", pro: "✅" },
          { name: "Export Data", free: "❌", starter: "❌", pro: "✅" }
        ]
      },
      {
        category: "Support",
        items: [
          { name: "AI Chatbot", free: "10/day", starter: "50/day", pro: "200/day" },
          { name: "Priority Support", free: "❌", starter: "❌", pro: "✅" }
        ]
      }
    ]
  };
}

