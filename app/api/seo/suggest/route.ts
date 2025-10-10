import { NextRequest, NextResponse } from "next/server";

async function mockKeywordIdeas(niche: string, product: string) {
  const base = [
    `${niche} ${product} australia`,
    `${niche} ${product} gift`,
    `personalized ${niche} ${product}`,
    `minimal ${niche} ${product}`,
    `${niche} ${product} for her`,
    `${niche} ${product} for him`,
    `${niche} ${product} boho`,
    `${niche} ${product} vintage`,
    `${niche} ${product} custom`,
    `${niche} ${product} eco`,
    `${niche} ${product} handmade`,
    `${niche} ${product} unique`,
    `${niche} ${product} aesthetic`,
    `${niche} ${product} minimalist`,
    `${niche} ${product} modern`
  ];
  const scored = base.map(k => ({ k, comp: Math.min(100, Math.max(5, k.length - 10)) }));
  return scored.sort((a,b)=>a.comp-b.comp).slice(0,18);
}

function capitalize(s: string){ return s.charAt(0).toUpperCase()+s.slice(1); }
function buildTitle(primary: string, seconds: string[], product: string) {
  const extras = seconds.slice(0,2).map(s => s.replace(/ australia$/i,'')).join(" — ");
  return `${capitalize(primary)} — ${extras || `Premium ${capitalize(product)}`}`.slice(0,139);
}
function buildTags(keywords: string[]) {
  const uniq = Array.from(new Set(keywords.map(k => k.toLowerCase()))).slice(0,13);
  return uniq.map(t => t.slice(0,20));
}
function buildDescription(primary: string, seconds: string[], product: string) {
  const p = product;
  const s1 = seconds.slice(0,5).map(s => s.split(" ").map(w => w[0].toUpperCase()+w.slice(1)).join(" "));
  return [
    `**${primary.split(" ").map(w => w[0].toUpperCase()+w.slice(1)).join(" ")}**`,
    ``,
    `Bring your idea to life with our ${p} designed for everyday use in Australia. Thoughtfully crafted and printed on demand with premium materials.`,
    ``,
    `**Why you'll love it:**`,
    `• On-trend design inspired by ${s1.join(", ")}.`,
    `• Durable materials and crisp print quality (300 DPI).`,
    `• Gift-ready: perfect for birthdays, holidays, and just-because moments.`,
    ``,
    `**Details:**`,
    `• Materials & sizing: see variants for exact specs`,
    `• Care: gentle machine wash / wipe clean as applicable`,
    `• Printing: made-to-order to reduce waste`,
    ``,
    `**Shipping (AU-friendly):**`,
    `Printed and shipped via our Australia-routed partners when available for faster delivery.`,
    ``,
    `**Personalization (optional):**`,
    `Add a name/date/initials—type your request in the personalization box.`,
    ``,
    `Add to cart now and enjoy your new ${product}!`
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const { niche, product } = await req.json();
  if (!niche || !product) return NextResponse.json({ error: "Provide 'niche' and 'product'." }, { status: 400 });
  const ideas = await mockKeywordIdeas(String(niche), String(product));
  const primary = ideas[0].k;
  const seconds = ideas.slice(1).map(i=>i.k);
  const title = buildTitle(primary, seconds, product);
  const tags = buildTags([primary, ...seconds]);
  const description = buildDescription(primary, seconds, product);
  return NextResponse.json({
    input: { niche, product },
    primary_keyword: primary,
    secondary_keywords: seconds.slice(0,12),
    seo_score: 92,
    title, tags, description
  });
}
