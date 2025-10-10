'use client';
import React from 'react';

export default function Page() {
  const [niche, setNiche] = React.useState('wildflower line art');
  const [product, setProduct] = React.useState('tote bag');
  const [imageUrls, setImageUrls] = React.useState<string>('');
  const [log, setLog] = React.useState<string[]>([]);
  const [calc, setCalc] = React.useState<any>(null);
  const [seo, setSeo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [taxonomy, setTaxonomy] = React.useState<number|null>(null);
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(()=>{
    (async()=>{
      const s = await fetch('/api/settings').then(r=>r.json());
      setSettings(s);
      const t = await fetch('/api/etsy/taxonomy?product='+encodeURIComponent(product)).then(r=>r.json());
      setTaxonomy(t.taxonomy_id ?? null);
    })();
  },[]);

  async function uploadFiles(files: FileList|null) {
    if(!files || !files.length) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    const res = await fetch('/api/uploads', { method: 'POST', body: fd });
    const j = await res.json();
    if(j.urls) {
      const newList = (imageUrls ? imageUrls.split('\n') : []).concat(j.urls);
      setImageUrls(newList.join('\n'));
      setLog(l => [`Uploaded ${j.urls.length} file(s)`, ...l]);
    } else {
      setLog(l => [`Upload failed: ${JSON.stringify(j)}`, ...l]);
    }
  }

  async function generateMockup() {
    const designUrl = (imageUrls || '').split('\n').filter(Boolean)[0];
    if(!designUrl) { setLog(l => ['Add at least one design URL first', ...l]); return; }
    const res = await fetch('/api/mockups', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ product: product.includes('mug')?'mug':(product.includes('poster')?'poster':'tote'), designUrl }) });
    const j = await res.json();
    if(j.url){
      setImageUrls(prev => (prev ? prev + '\n' : '') + j.url);
      setLog(l => ['Mockup generated', ...l]);
    } else {
      setLog(l => ['Mockup generation failed', ...l]);
    }
  }

  async function oneButton() {
    setLoading(true);
    setLog(l => ['Launching one-button flow…', ...l]);
    try {
      // SEO
      const seoRes = await fetch('/api/seo/suggest', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ niche, product }) });
      const seoJ = await seoRes.json();
      setSeo(seoJ);
      setLog(l => ['SEO generated', ...l]);
      // Calc demo
      const calcRes = await fetch('/api/calc/etsy', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ itemPrice: 24.95, buyerShipping: 6.95, podBase: 12.2, podShip: 7.5 }) });
      const calcJ = await calcRes.json();
      setCalc(calcJ);
      setLog(l => ['Calc done', ...l]);
      // Publish
      const imgs = (imageUrls||'').split('\n').filter(Boolean);
      if(!imgs.length){ throw new Error('Add at least one image URL or generate a mockup'); }
      const pubRes = await fetch('/api/publish/etsy', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
        title: seoJ.title, description: seoJ.description, price: 24.95, quantity: 50,
        taxonomy_id: taxonomy ?? 1100, tags: seoJ.tags, materials: ['cotton','ink'], image_urls: imgs
      })});
      const pubJ = await pubRes.json();
      setLog(l => [`Etsy draft listing created: ${pubJ.listing_id}`, ...l]);
    } catch(e:any){
      setLog(l => [`Error: ${e?.message || JSON.stringify(e)}`, ...l]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">Inputs</h2>
          <label className="block mb-2">
            <span className="text-sm">Niche</span>
            <input value={niche} onChange={e=>setNiche(e.target.value)} className="w-full border rounded p-2" />
          </label>
          <label className="block mb-2">
            <span className="text-sm">Product</span>
            <input value={product} onChange={async (e)=>{
              setProduct(e.target.value);
              const t = await fetch('/api/etsy/taxonomy?product='+encodeURIComponent(e.target.value)).then(r=>r.json());
              setTaxonomy(t.taxonomy_id ?? null);
            }} className="w-full border rounded p-2" />
          </label>
          <label className="block mb-2">
            <span className="text-sm">Mockup Image URLs (one per line)</span>
            <textarea value={imageUrls} onChange={e=>setImageUrls(e.target.value)} className="w-full border rounded p-2 h-28" />
          </label>
          <div className="flex gap-2">
            <input type="file" multiple onChange={e=>uploadFiles(e.target.files)} />
            <button onClick={generateMockup} className="border rounded px-3 py-2">Generate Mockup</button>
          </div>
          <div className="text-xs mt-2 text-gray-600">Taxonomy ID: {taxonomy ?? 'n/a'}</div>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">One-Button Launcher</h2>
          <button onClick={oneButton} disabled={loading} className="border rounded px-4 py-2">{loading?'Working…':'Launch'}</button>
          <div className="mt-3 text-sm">
            <div><strong>SEO:</strong> {seo?.title || '—'}</div>
            <div><strong>Profit:</strong> {calc?.outputs?.profit ?? '—'} AUD</div>
          </div>
        </div>
      </section>

      <section className="border rounded p-4">
        <h2 className="font-bold mb-2">Activity</h2>
        <ul className="text-sm">
          {log.map((l,i)=><li key={i}>• {l}</li>)}
        </ul>
      </section>
    </div>
  );
}
