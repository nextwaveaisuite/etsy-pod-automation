import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
    }

    const uploaded: string[] = [];

    for (const file of files) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const fileName = `uploads/${Date.now()}_${file.name}`;

      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .upload(fileName, bytes, {
          contentType: file.type,
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .getPublicUrl(fileName);

      uploaded.push(data.publicUrl);
    }

    return NextResponse.json({ success: true, files: uploaded });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
