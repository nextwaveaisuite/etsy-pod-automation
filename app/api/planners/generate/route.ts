import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const dynamic = "force-dynamic";

interface PlannerGenerateRequest {
  templateId: number;
  customization?: {
    colors?: string[];
    title?: string;
    addLogo?: boolean;
    logoUrl?: string;
    style?: "minimalist" | "colorful" | "professional" | "cute";
  };
}

// SVG template generators for different planner types
function generateDailyPlannerSVG(customization: any) {
  const primaryColor = customization?.colors?.[0] || "#000000";
  const bgColor = customization?.colors?.[1] || "#FFFFFF";
  const title = customization?.title || "Daily Planner";
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="2480" height="3508" viewBox="0 0 2480 3508" xmlns="http://www.w3.org/2000/svg">
  <!-- A4 size at 300 DPI -->
  <rect width="2480" height="3508" fill="${bgColor}"/>
  
  <!-- Header -->
  <text x="1240" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="${primaryColor}">
    ${title}
  </text>
  
  <!-- Date field -->
  <rect x="200" y="280" width="2080" height="100" fill="none" stroke="${primaryColor}" stroke-width="3"/>
  <text x="220" y="345" font-family="Arial, sans-serif" font-size="36" fill="${primaryColor}">
    Date: ___________________
  </text>
  
  <!-- Top 3 Priorities -->
  <text x="200" y="480" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${primaryColor}">
    Top 3 Priorities
  </text>
  <rect x="200" y="520" width="2080" height="80" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  <text x="220" y="575" font-family="Arial, sans-serif" font-size="32" fill="${primaryColor}">1. </text>
  <rect x="200" y="610" width="2080" height="80" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  <text x="220" y="665" font-family="Arial, sans-serif" font-size="32" fill="${primaryColor}">2. </text>
  <rect x="200" y="700" width="2080" height="80" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  <text x="220" y="755" font-family="Arial, sans-serif" font-size="32" fill="${primaryColor}">3. </text>
  
  <!-- Schedule -->
  <text x="200" y="880" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${primaryColor}">
    Schedule
  </text>
  
  ${Array.from({ length: 12 }, (_, i) => {
    const hour = 6 + i;
    const y = 920 + (i * 120);
    return `
    <line x1="200" y1="${y}" x2="1600" y2="${y}" stroke="${primaryColor}" stroke-width="1"/>
    <text x="220" y="${y + 35}" font-family="Arial, sans-serif" font-size="28" fill="${primaryColor}">
      ${hour}:00
    </text>
    <line x1="400" y1="${y}" x2="400" y2="${y + 120}" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="5,5"/>
    `;
  }).join('')}
  
  <!-- Notes section -->
  <text x="1700" y="880" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${primaryColor}">
    Notes
  </text>
  <rect x="1700" y="920" width="580" height="1500" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  
  <!-- Water tracker -->
  <text x="1700" y="2520" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${primaryColor}">
    Water Intake
  </text>
  ${Array.from({ length: 8 }, (_, i) => {
    const x = 1700 + (i * 72);
    return `<circle cx="${x + 30}" cy="2600" r="25" fill="none" stroke="${primaryColor}" stroke-width="2"/>`;
  }).join('')}
  
  <!-- Gratitude -->
  <text x="200" y="2520" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${primaryColor}">
    Today I'm grateful for:
  </text>
  <rect x="200" y="2560" width="1400" height="400" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  
  <!-- Footer -->
  <text x="1240" y="3400" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="${primaryColor}" opacity="0.5">
    Created with Etsy POD Builder
  </text>
</svg>`;
}

function generateToDoListSVG(customization: any) {
  const primaryColor = customization?.colors?.[0] || "#4A90E2";
  const bgColor = customization?.colors?.[1] || "#FFFFFF";
  const title = customization?.title || "To-Do List";
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1754" height="2480" viewBox="0 0 1754 2480" xmlns="http://www.w3.org/2000/svg">
  <!-- A5 size at 300 DPI -->
  <rect width="1754" height="2480" fill="${bgColor}"/>
  
  <!-- Header -->
  <text x="877" y="150" font-family="Arial, sans-serif" font-size="64" font-weight="bold" text-anchor="middle" fill="${primaryColor}">
    ${title}
  </text>
  
  <!-- Date -->
  <rect x="150" y="220" width="1454" height="80" fill="none" stroke="${primaryColor}" stroke-width="2"/>
  <text x="170" y="275" font-family="Arial, sans-serif" font-size="32" fill="${primaryColor}">
    Date: ___________________
  </text>
  
  <!-- Priority Matrix -->
  <line x1="877" y1="380" x2="877" y2="2200" stroke="${primaryColor}" stroke-width="3"/>
  <line x1="150" y1="1290" x2="1604" y2="1290" stroke="${primaryColor}" stroke-width="3"/>
  
  <!-- Quadrant labels -->
  <text x="513" y="430" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="${primaryColor}">
    URGENT &amp; IMPORTANT
  </text>
  <text x="1240" y="430" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="${primaryColor}">
    IMPORTANT
  </text>
  <text x="513" y="1340" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="${primaryColor}">
    URGENT
  </text>
  <text x="1240" y="1340" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="${primaryColor}">
    NEITHER
  </text>
  
  <!-- Checkboxes in each quadrant -->
  ${Array.from({ length: 4 }, (_, quad) => {
    const startX = quad % 2 === 0 ? 170 : 897;
    const startY = quad < 2 ? 480 : 1390;
    return Array.from({ length: 10 }, (_, i) => {
      const y = startY + (i * 75);
      return `
        <rect x="${startX}" y="${y}" width="30" height="30" fill="none" stroke="${primaryColor}" stroke-width="2"/>
        <line x1="${startX + 50}" y1="${y + 25}" x2="${startX + 650}" y2="${y + 25}" stroke="${primaryColor}" stroke-width="1" opacity="0.3"/>
      `;
    }).join('');
  }).join('')}
  
  <!-- Footer -->
  <text x="877" y="2400" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="${primaryColor}" opacity="0.5">
    Eisenhower Matrix - Created with Etsy POD Builder
  </text>
</svg>`;
}

function generateHabitTrackerSVG(customization: any) {
  const colors = customization?.colors || ["#FF6B6B", "#4ECDC4", "#45B7D1"];
  const bgColor = "#FFFFFF";
  const title = customization?.title || "30 Day Habit Tracker";
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="2480" height="3508" viewBox="0 0 2480 3508" xmlns="http://www.w3.org/2000/svg">
  <rect width="2480" height="3508" fill="${bgColor}"/>
  
  <!-- Header -->
  <text x="1240" y="180" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="${colors[0]}">
    ${title}
  </text>
  
  <!-- Month/Year -->
  <rect x="200" y="250" width="2080" height="100" fill="none" stroke="${colors[0]}" stroke-width="3"/>
  <text x="220" y="315" font-family="Arial, sans-serif" font-size="36" fill="${colors[0]}">
    Month: ___________________  Year: _______
  </text>
  
  <!-- Grid header - Days -->
  <text x="200" y="450" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${colors[0]}">
    Habit
  </text>
  ${Array.from({ length: 30 }, (_, i) => {
    const x = 600 + (i * 62);
    return `<text x="${x}" y="450" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="${colors[1]}">${i + 1}</text>`;
  }).join('')}
  
  <!-- Habit rows -->
  ${Array.from({ length: 10 }, (_, row) => {
    const y = 500 + (row * 120);
    return `
      <!-- Habit name field -->
      <rect x="200" y="${y}" width="380" height="100" fill="none" stroke="${colors[0]}" stroke-width="2"/>
      
      <!-- Day checkboxes -->
      ${Array.from({ length: 30 }, (_, day) => {
        const x = 600 + (day * 62);
        return `<rect x="${x - 15}" y="${y + 35}" width="30" height="30" fill="none" stroke="${colors[2]}" stroke-width="2" rx="5"/>`;
      }).join('')}
    `;
  }).join('')}
  
  <!-- Legend -->
  <text x="200" y="1850" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${colors[0]}">
    How to use:
  </text>
  <text x="200" y="1920" font-family="Arial, sans-serif" font-size="28" fill="#333333">
    1. Write your habits in the left column
  </text>
  <text x="200" y="1980" font-family="Arial, sans-serif" font-size="28" fill="#333333">
    2. Check off each day you complete the habit
  </text>
  <text x="200" y="2040" font-family="Arial, sans-serif" font-size="28" fill="#333333">
    3. Track your progress and build consistency!
  </text>
  
  <!-- Footer -->
  <text x="1240" y="3400" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="${colors[0]}" opacity="0.5">
    Created with Etsy POD Builder
  </text>
</svg>`;
}

export async function POST(req: NextRequest) {
  const body: PlannerGenerateRequest = await req.json();
  const { templateId, customization } = body;
  
  if (!templateId) {
    return NextResponse.json({ 
      error: "Provide 'templateId' to generate planner" 
    }, { status: 400 });
  }
  
  try {
    let svgContent: string;
    
    // Generate SVG based on template ID
    switch (templateId) {
      case 1: // Daily Planner
        svgContent = generateDailyPlannerSVG(customization);
        break;
      case 2: // To-Do List
        svgContent = generateToDoListSVG(customization);
        break;
      case 3: // Habit Tracker
        svgContent = generateHabitTrackerSVG(customization);
        break;
      default:
        // For other templates, use a generic layout
        svgContent = generateDailyPlannerSVG(customization);
    }
    
    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .png({ quality: 95 })
      .toBuffer();
    
    // In production, upload to Supabase Storage
    // For now, return as base64
    const base64Image = pngBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;
    
    return NextResponse.json({
      success: true,
      planner: {
        templateId,
        imageUrl: dataUrl,
        format: "PNG",
        dimensions: templateId === 2 ? "A5" : "A4",
        dpi: 300,
        fileSize: `${(pngBuffer.length / 1024).toFixed(2)} KB`,
        printReady: true
      },
      downloadFormats: {
        png: dataUrl,
        // In production, also generate PDF
        pdf: null,
        svg: `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`
      },
      note: "In production, this would upload to Supabase Storage and return public URLs"
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

