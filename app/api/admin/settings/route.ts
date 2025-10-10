import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Admin settings storage (in production, use database)
let ADMIN_SETTINGS = {
  platform: {
    mode: "private", // private, public, invite-only
    allowSignups: false,
    requireApproval: true,
    maintenanceMode: false
  },
  users: [
    {
      id: 1,
      email: "admin@example.com",
      role: "owner",
      status: "active",
      createdAt: "2025-01-01",
      lastLogin: "2025-10-10",
      productsCreated: 45,
      totalSales: 247
    }
  ],
  invites: [
    {
      id: 1,
      email: "user@example.com",
      status: "pending",
      sentAt: "2025-10-05",
      expiresAt: "2025-10-12"
    }
  ],
  integrations: {
    etsy: {
      enabled: true,
      shopId: process.env.ETSY_SHOP_ID || "not-configured",
      connected: !!process.env.ETSY_TOKEN
    },
    printify: {
      enabled: true,
      shopId: process.env.PRINTIFY_SHOP_ID || "not-configured",
      connected: !!process.env.PRINTIFY_TOKEN
    },
    printful: {
      enabled: false,
      connected: !!process.env.PRINTFUL_TOKEN
    },
    gelato: {
      enabled: false,
      connected: !!process.env.GELATO_TOKEN
    }
  },
  automation: {
    autoPublish: true,
    autoPrice: true,
    autoSEO: true,
    autoMockups: true,
    autopilotMode: false
  },
  limits: {
    maxUsers: 100,
    maxProducts: 1000,
    maxImagesPerUser: 500,
    apiCallsPerDay: 10000
  },
  stats: {
    totalUsers: 1,
    activeUsers: 1,
    totalProducts: 45,
    totalSales: 247,
    totalRevenue: 6842.50,
    storageUsed: "2.4 GB",
    apiCallsToday: 1247
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  
  if (section) {
    switch (section) {
      case 'platform':
        return NextResponse.json({ settings: ADMIN_SETTINGS.platform });
      case 'users':
        return NextResponse.json({ users: ADMIN_SETTINGS.users });
      case 'invites':
        return NextResponse.json({ invites: ADMIN_SETTINGS.invites });
      case 'integrations':
        return NextResponse.json({ integrations: ADMIN_SETTINGS.integrations });
      case 'automation':
        return NextResponse.json({ automation: ADMIN_SETTINGS.automation });
      case 'limits':
        return NextResponse.json({ limits: ADMIN_SETTINGS.limits });
      case 'stats':
        return NextResponse.json({ stats: ADMIN_SETTINGS.stats });
      default:
        return NextResponse.json({ error: "Unknown section" }, { status: 400 });
    }
  }
  
  return NextResponse.json({
    success: true,
    settings: ADMIN_SETTINGS
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, section, data } = body;
  
  switch (action) {
    case 'update_platform':
      ADMIN_SETTINGS.platform = { ...ADMIN_SETTINGS.platform, ...data };
      return NextResponse.json({ success: true, settings: ADMIN_SETTINGS.platform });
      
    case 'update_automation':
      ADMIN_SETTINGS.automation = { ...ADMIN_SETTINGS.automation, ...data };
      return NextResponse.json({ success: true, settings: ADMIN_SETTINGS.automation });
      
    case 'add_user':
      const newUser = {
        id: ADMIN_SETTINGS.users.length + 1,
        email: data.email,
        role: data.role || 'user',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
        productsCreated: 0,
        totalSales: 0
      };
      ADMIN_SETTINGS.users.push(newUser);
      return NextResponse.json({ success: true, user: newUser });
      
    case 'remove_user':
      ADMIN_SETTINGS.users = ADMIN_SETTINGS.users.filter(u => u.id !== data.userId);
      return NextResponse.json({ success: true });
      
    case 'send_invite':
      const invite = {
        id: ADMIN_SETTINGS.invites.length + 1,
        email: data.email,
        status: 'pending',
        sentAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      ADMIN_SETTINGS.invites.push(invite);
      return NextResponse.json({ success: true, invite });
      
    case 'toggle_integration':
      if (ADMIN_SETTINGS.integrations[data.provider as keyof typeof ADMIN_SETTINGS.integrations]) {
        (ADMIN_SETTINGS.integrations[data.provider as keyof typeof ADMIN_SETTINGS.integrations] as any).enabled = data.enabled;
      }
      return NextResponse.json({ success: true });
      
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

