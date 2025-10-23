import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock analytics data - in production, this would query your database
const ANALYTICS_DATA = {
  overview: {
    totalSales: 247,
    totalRevenue: 6842.50,
    totalProfit: 3156.75,
    totalOrders: 247,
    avgOrderValue: 27.70,
    profitMargin: 46.1,
    period: "Last 30 days"
  },
  salesByDay: [
    { date: "2025-10-01", sales: 12, revenue: 334.80, profit: 154.20 },
    { date: "2025-10-02", sales: 8, revenue: 221.60, profit: 102.08 },
    { date: "2025-10-03", sales: 15, revenue: 415.50, profit: 191.43 },
    { date: "2025-10-04", sales: 10, revenue: 277.00, profit: 127.63 },
    { date: "2025-10-05", sales: 18, revenue: 498.60, profit: 229.76 },
    { date: "2025-10-06", sales: 14, revenue: 387.80, profit: 178.75 },
    { date: "2025-10-07", sales: 11, revenue: 304.70, profit: 140.47 },
    { date: "2025-10-08", sales: 9, revenue: 249.30, profit: 114.88 },
    { date: "2025-10-09", sales: 16, revenue: 443.20, profit: 204.27 },
    { date: "2025-10-10", sales: 13, revenue: 360.10, profit: 165.85 }
  ],
  topProducts: [
    { name: "Dog Mom Mug", sales: 45, revenue: 762.75, profit: 470.25, avgReviews: 4.8 },
    { name: "Nurse Tote Bag", sales: 38, revenue: 1137.62, profit: 625.10, avgReviews: 4.9 },
    { name: "Boho Wall Art", sales: 32, revenue: 638.40, profit: 430.40, avgReviews: 4.7 },
    { name: "Plant Lady Tote", sales: 28, revenue: 810.60, profit: 432.60, avgReviews: 4.6 },
    { name: "Teacher Stickers", sales: 52, revenue: 309.40, profit: 231.40, avgReviews: 4.9 },
    { name: "Grandma Est. Shirt", sales: 24, revenue: 598.80, profit: 274.80, avgReviews: 5.0 },
    { name: "Gym Motivation Shirt", sales: 18, revenue: 485.10, profit: 242.10, avgReviews: 4.5 },
    { name: "Reading Tracker", sales: 10, revenue: 49.50, profit: 49.50, avgReviews: 4.8 }
  ],
  salesByProduct: [
    { product: "Tote Bag", count: 78, revenue: 2184.60, profit: 1204.80 },
    { product: "Mug", count: 62, revenue: 1113.80, profit: 648.10 },
    { product: "T-Shirt", count: 52, revenue: 1403.40, profit: 624.80 },
    { product: "Poster", count: 35, revenue: 663.25, profit: 470.75 },
    { product: "Sticker", count: 20, revenue: 119.00, profit: 89.00 }
  ],
  recentOrders: [
    { id: "ORD-1234", date: "2025-10-10", product: "Dog Mom Mug", amount: 17.95, status: "fulfilled", profit: 10.45 },
    { id: "ORD-1235", date: "2025-10-10", product: "Nurse Tote Bag", amount: 29.95, status: "processing", profit: 16.45 },
    { id: "ORD-1236", date: "2025-10-09", product: "Teacher Stickers", amount: 5.95, status: "fulfilled", profit: 4.45 },
    { id: "ORD-1237", date: "2025-10-09", product: "Boho Wall Art", amount: 19.95, status: "fulfilled", profit: 13.45 },
    { id: "ORD-1238", date: "2025-10-08", product: "Plant Lady Tote", amount: 28.95, status: "fulfilled", profit: 15.45 }
  ],
  refunds: [
    { id: "REF-101", date: "2025-10-08", product: "Gym Shirt", amount: 26.95, reason: "Size issue" },
    { id: "REF-102", date: "2025-10-05", product: "Mug", amount: 17.95, reason: "Damaged in shipping" }
  ],
  printStatus: {
    pending: 12,
    printing: 8,
    shipped: 215,
    delivered: 204,
    issues: 2
  },
  trafficSources: [
    { source: "Etsy Search", visits: 1842, conversions: 156, conversionRate: 8.5 },
    { source: "Etsy Ads", visits: 523, conversions: 48, conversionRate: 9.2 },
    { source: "Direct", visits: 234, conversions: 28, conversionRate: 12.0 },
    { source: "Social Media", visits: 156, conversions: 15, conversionRate: 9.6 }
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30days";
  const metric = searchParams.get("metric");
  
  // Return specific metric if requested
  if (metric) {
    switch (metric) {
      case 'sales':
        return NextResponse.json({ data: ANALYTICS_DATA.salesByDay });
      case 'products':
        return NextResponse.json({ data: ANALYTICS_DATA.topProducts });
      case 'orders':
        return NextResponse.json({ data: ANALYTICS_DATA.recentOrders });
      case 'refunds':
        return NextResponse.json({ data: ANALYTICS_DATA.refunds });
      case 'print':
        return NextResponse.json({ data: ANALYTICS_DATA.printStatus });
      case 'traffic':
        return NextResponse.json({ data: ANALYTICS_DATA.trafficSources });
      default:
        return NextResponse.json({ error: "Unknown metric" }, { status: 400 });
    }
  }
  
  // Return full dashboard data
  return NextResponse.json({
    success: true,
    period,
    analytics: ANALYTICS_DATA,
    lastUpdated: new Date().toISOString()
  });
}

// Track new event
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event, data } = body;
  
  // In production, save to database
  console.log('Analytics event:', event, data);
  
  return NextResponse.json({
    success: true,
    event,
    tracked: true,
    timestamp: new Date().toISOString()
  });
}
