import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchEtsyData(endpoint: string, token: string) {
  const res = await fetch(`https://openapi.etsy.com/v3/application/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}
