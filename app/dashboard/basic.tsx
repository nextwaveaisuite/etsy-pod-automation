'use client';
import React from 'react';

export default function DashboardPage() {
  const [niche, setNiche] = React.useState('');
  const [product, setProduct] = React.useState('tote bag');
  const [style, setStyle] = React.useState('modern minimalist');
  const [colorScheme, setColorScheme] = React.useState('trendy');
  const [autoDiscover, setAutoDiscover] = React.useState(false);
  const [generateDesign, setGenerateDesign] = React.useState(true);
  const [sourceUrls, setSourceUrls] = React.useState('');
  const [log, setLog] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<any>(null);
  const [availableNiches, setAvailableNiches] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Load available niches
    fetch('/api/niche/discover?limit=20')
      .then(r => r.json())
      .then(data => {
        setAvailableNiches(data.niches || []);
        if (data.niches?.length > 0) {
          setNiche(data.niches[0].name);
        }
      })
      .catch(err => console.error('Failed to load niches:', err));
  }, []);

  async function autoLaunch() {
    setLoading(true);
    setLog(['🚀 Starting auto-launch...']);
    setResults(null);

    try {
      const sourceImageUrls = sourceUrls
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean);

      const res = await fetch('/api/launch/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: autoDiscover ? undefined : niche,
          product,
          autoDiscoverNiche: autoDiscover,
          style,
          colorScheme,
          sourceImageUrls,
          generateDesign,
          printify: {
            blueprint_id: 6,
            print_provider_id: 1,
            variants: [{ id: 401, price: 1895, is_enabled: true }]
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.results);
        data.steps.forEach((step: any) => {
          setLog(prev => [...prev, `✅ ${step.step}: ${JSON.stringify(step).substring(0, 100)}...`]);
        });
        setLog(prev => [...prev, '🎉 Auto-launch completed successfully!']);
      } else {
        setLog(prev => [...prev, `❌ Error: ${data.error}`]);
      }
    } catch (err: any) {
      setLog(prev => [...prev, `❌ Failed: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎨 Etsy POD Auto-Builder
          </h1>
          <p className="text-gray-600">
            Automatically discover niches, redesign images, and launch products
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Configuration</h2>

            <div className="space-y-4">
              {/* Auto-discover toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoDiscover}
                  onChange={e => setAutoDiscover(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Auto-discover trending niche</span>
              </label>

              {/* Niche selection */}
              {!autoDiscover && (
                <div>
                  <label className="block text-sm font-medium mb-1">Niche</label>
                  <select
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    {availableNiches.map(n => (
                      <option key={n.name} value={n.name}>
                        {n.name} ({n.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Product type */}
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="tote bag">Tote Bag</option>
                  <option value="mug">Mug</option>
                  <option value="t-shirt">T-Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="poster">Poster</option>
                  <option value="sticker">Sticker</option>
                  <option value="phone case">Phone Case</option>
                  <option value="pillow">Pillow</option>
                </select>
              </div>

              {/* Design style */}
              <div>
                <label className="block text-sm font-medium mb-1">Design Style</label>
                <select
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="modern minimalist">Modern Minimalist</option>
                  <option value="vintage retro">Vintage Retro</option>
                  <option value="boho aesthetic">Boho Aesthetic</option>
                  <option value="bold graphic">Bold Graphic</option>
                  <option value="watercolor soft">Watercolor Soft</option>
                  <option value="line art">Line Art</option>
                </select>
              </div>

              {/* Color scheme */}
              <div>
                <label className="block text-sm font-medium mb-1">Color Scheme</label>
                <select
                  value={colorScheme}
                  onChange={e => setColorScheme(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="trendy">Trendy</option>
                  <option value="pastel">Pastel</option>
                  <option value="earth tones">Earth Tones</option>
                  <option value="monochrome">Monochrome</option>
                  <option value="vibrant">Vibrant</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              {/* AI generation toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={generateDesign}
                  onChange={e => setGenerateDesign(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Generate design with AI</span>
              </label>

              {/* Source images */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Source Image URLs (optional, one per line)
                </label>
                <textarea
                  value={sourceUrls}
                  onChange={e => setSourceUrls(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-24 text-sm font-mono"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>

              {/* Launch button */}
              <button
                onClick={autoLaunch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? '⏳ Processing...' : '🚀 Auto-Launch Product'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Activity Log */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
              <div className="bg-gray-900 text-green-400 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
                {log.length === 0 ? (
                  <div className="text-gray-500">Waiting to launch...</div>
                ) : (
                  log.map((entry, i) => (
                    <div key={i} className="mb-1">
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Results Display */}
            {results && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Results</h2>
                
                {results.mockupUrl && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Generated Mockup</h3>
                    <img 
                      src={results.mockupUrl} 
                      alt="Product mockup" 
                      className="w-full rounded border"
                    />
                  </div>
                )}

                {results.seo && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">SEO Content</h3>
                    <div className="text-sm space-y-1">
                      <div><strong>Title:</strong> {results.seo.title}</div>
                      <div><strong>Tags:</strong> {results.seo.tags.join(', ')}</div>
                    </div>
                  </div>
                )}

                {results.calc && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Pricing</h3>
                    <div className="text-sm space-y-1">
                      <div><strong>Profit:</strong> ${results.calc.outputs?.profit || 'N/A'} AUD</div>
                      <div><strong>Breakeven:</strong> ${results.calc.outputs?.breakevenItemPrice || 'N/A'} AUD</div>
                    </div>
                  </div>
                )}

                {results.etsyListing && (
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">Etsy Listing</h3>
                    <div className="text-sm">
                      <div><strong>Listing ID:</strong> {results.etsyListing.listing_id}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

