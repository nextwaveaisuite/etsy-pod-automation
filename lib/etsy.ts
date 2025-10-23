export async function getEtsy(endpoint: string, token: string) {
  const res = await fetch(`https://openapi.etsy.com/v3/application/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Etsy API error: ${res.status}`);
  return res.json();
}
