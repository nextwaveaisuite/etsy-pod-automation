import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI();

const SYSTEM_PROMPT = `You are an expert AI assistant for an Etsy Print-on-Demand (POD) automation platform. You help users with:

**Platform Features:**
- Image upload & management (zip extraction, library browsing)
- Built-in image editor (resize, crop, filters, text overlay)
- Multi-provider integration (Printify, Printful, Gelato, CustomCat)
- Low-hanging fruit opportunity analyzer (finds high-profit, low-competition niches)
- Analytics dashboard (sales, profit, performance tracking)
- Admin console (user management, access control, automation settings)
- Complete automation pipeline (design → provider → Etsy)

**POD Best Practices:**
- Focus on niches with 10K+ monthly searches and <500 competition
- Target $8-16 profit margins per product
- Use SEO-optimized titles with 3-5 keywords
- Create 13 tags per listing (max Etsy allows)
- Price competitively but maintain healthy margins (40-50%+)
- Test multiple designs per niche
- Monitor analytics and double down on winners

**Top Performing Niches:**
1. Reading Tracker Printables (97.8 score, 165 competition)
2. Dog Mom Mugs (96.8 score, 450 competition)
3. Grandma Est. Shirts (95.1 score, 190 competition)
4. Nurse Appreciation Gifts (94.2 score, 320 competition)
5. Boho Wall Art (93.7 score, 520 competition)

**Product Types:**
- Tote Bags ($13 POD cost, sell $28-30)
- Mugs ($7 POD cost, sell $17-19)
- T-Shirts ($13.50 POD cost, sell $24-27)
- Posters ($6.50 POD cost, sell $18-20)
- Stickers ($1.50 POD cost, sell $5-6)
- Planners/Printables ($0 POD cost, sell $4-5)

**Etsy Fees (Australia):**
- Listing fee: $0.20 USD
- Transaction fee: 6.5% of sale price
- Payment processing: 4% + $0.30
- Offsite ads: 15% (if applicable)

**Automation Features:**
- Auto-publish to Etsy
- Auto-pricing optimization
- Auto-SEO generation
- Auto-mockup creation
- 100% autopilot mode available

Be helpful, concise, and actionable. Provide specific numbers and examples. Guide users to profitable decisions.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";

    return NextResponse.json({
      success: true,
      response,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({
      error: "Failed to generate response",
      details: error.message
    }, { status: 500 });
  }
}

// Get common questions
export async function GET(req: NextRequest) {
  const commonQuestions = [
    {
      category: "Getting Started",
      questions: [
        "How do I upload my designs?",
        "What's the best way to find profitable niches?",
        "How do I connect my Etsy account?",
        "What print providers should I use?"
      ]
    },
    {
      category: "Pricing & Profit",
      questions: [
        "What profit margin should I target?",
        "How do I calculate Etsy fees?",
        "What's a good price for t-shirts?",
        "How much do POD products cost?"
      ]
    },
    {
      category: "Optimization",
      questions: [
        "How do I optimize my Etsy listings?",
        "What makes a good product title?",
        "How many tags should I use?",
        "How do I improve my conversion rate?"
      ]
    },
    {
      category: "Automation",
      questions: [
        "Can I automate everything?",
        "How does autopilot mode work?",
        "What gets automated?",
        "Is automation safe for my Etsy shop?"
      ]
    },
    {
      category: "Analytics",
      questions: [
        "How do I track my sales?",
        "What metrics should I monitor?",
        "How do I find my best-selling products?",
        "How do I analyze my profit margins?"
      ]
    }
  ];

  return NextResponse.json({
    commonQuestions
  });
}

