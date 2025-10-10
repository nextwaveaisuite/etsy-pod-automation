'use client';
import React from 'react';

export default function SettingsPage(){
  const [data, setData] = React.useState<any>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(()=>{ (async()=>{
    const j = await fetch('/api/settings').then(r=>r.json());
    setData(j);
  })(); },[]);

  if(!data) return <div>Loading…</div>;

  const def = data.saved?.printify || data.defaults.printify;
  const fees = data.saved?.fees || data.defaults.fees;
  const ship = data.saved?.default_shipping_profile_id ?? data.defaults.default_shipping_profile_id;

  async function save(){
    setSaving(true);
    await fetch('/api/settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
      default_shipping_profile_id: Number((document.getElementById('ship') as HTMLInputElement).value || 0),
      printify: {
        shop_id: (document.getElementById('pfy_shop') as HTMLInputElement).value,
        provider_id: Number((document.getElementById('pfy_provider') as HTMLInputElement).value || 1),
        blueprint_id: Number((document.getElementById('pfy_blueprint') as HTMLInputElement).value || 6),
        variants: [{ id: Number((document.getElementById('pfy_variant') as HTMLInputElement).value || 401), price: 1895, is_enabled: true }]
      },
      fees: {
        listing_fee: Number((document.getElementById('fee_list') as HTMLInputElement).value || 0.3),
        txn_pct: Number((document.getElementById('fee_txn') as HTMLInputElement).value || 6.5),
        pay_pct: Number((document.getElementById('fee_paypct') as HTMLInputElement).value || 3),
        pay_fixed: Number((document.getElementById('fee_payfix') as HTMLInputElement).value || 0.3),
        offsite_ads_pct: Number((document.getElementById('fee_off') as HTMLInputElement).value || 0)
      }
    })});
    setSaving(false);
    alert('Saved!');
  }

  return (
    <div className="grid gap-6">
      <div className="border rounded p-4">
        <h2 className="font-bold mb-2">Shipping Profile</h2>
        <input id="ship" defaultValue={ship || ''} className="border rounded p-2 w-full" placeholder="Default Etsy shipping_profile_id" />
      </div>

      <div className="border rounded p-4">
        <h2 className="font-bold mb-2">Printify Defaults</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input id="pfy_shop" defaultValue={def.shop_id || ''} className="border rounded p-2" placeholder="Printify Shop ID" />
          <input id="pfy_provider" defaultValue={def.provider_id || 1} className="border rounded p-2" placeholder="Provider ID" />
          <input id="pfy_blueprint" defaultValue={def.blueprint_id || 6} className="border rounded p-2" placeholder="Blueprint ID" />
          <input id="pfy_variant" defaultValue={(def.variants?.[0]?.id) || 401} className="border rounded p-2" placeholder="Variant ID (e.g., 401)" />
        </div>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-bold mb-2">AU Fee Profile</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input id="fee_list" defaultValue={fees.listing_fee} className="border rounded p-2" placeholder="Listing fee A$" />
          <input id="fee_txn" defaultValue={fees.txn_pct} className="border rounded p-2" placeholder="Transaction % (e.g., 6.5)" />
          <input id="fee_paypct" defaultValue={fees.pay_pct} className="border rounded p-2" placeholder="Payment % (e.g., 3.0)" />
          <input id="fee_payfix" defaultValue={fees.pay_fixed} className="border rounded p-2" placeholder="Payment fixed A$ (e.g., 0.30)" />
          <input id="fee_off" defaultValue={fees.offsite_ads_pct} className="border rounded p-2" placeholder="Offsite Ads % (0/12/15)" />
        </div>
      </div>

      <button onClick={save} disabled={saving} className="border rounded px-4 py-2">{saving?'Saving…':'Save Settings'}</button>
    </div>
  );
}
