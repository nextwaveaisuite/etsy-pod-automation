'use client';
import React from 'react';

export default function SmartDashboard() {
  const [niche, setNiche] = React.useState('');
  const [product, setProduct] = React.useState('tote bag');
  const [enhancementLevel, setEnhancementLevel] = React.useState<'subtle' | 'moderate' | 'significant'>('subtle');
  const [autoFindWinners, setAutoFindWinners] = React.useState(true);
  const [sourceImageUrl, setSourceImageUrl] = React.useState('');
  const [log, setLog] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<any>(null);
  const [etsyNiches, setEtsyNiches] = React.useState<any[]>([]);
  const [topProducts, setTopProducts] = React.useState<any[]>([]);
  const [loadingNiches, setLoadingNiches] = React.useState(true);

  React.useEffect(() => {
    // Auto-load top Etsy niches on mount
    async function loadEtsyData() {
      try {
        setLog(['🔍 Loading top Etsy niches...']);
        const res = await fetch('/api/etsy/top-niches?includeProducts=true&limit=20');
        const data = await res.json();
        
        if (data.niches && data.niches.length > 0) {
          setEtsyNiches(data.niches);
          setNiche(data.niches[0].name); // Set first niche as default
          setLog(prev => [...prev, `✅ Loaded ${data.niches.length} top Etsy niches`]);
        }
        
        if (data.topProducts) {
          setTopProducts(data.topProducts);
        }
      } catch (err: any) {
        setLog(prev => [...prev, `⚠️ Could not load niches: ${err.message}`]);
        // Fallback to manual input
        setNiche('wildflower line art');
      } finally {
        setLoadingNiches(false);
      }
    }
    
    loadEtsyData();
  }, []);

  async function smartLaunch() {
    setLoading(true);
    setLog(['🎯 Starting smart launch with winning image analysis...']);
    setResults(null);

    try {
      const res = await fetch('/api/launch/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          product,
          enhancementLevel,
          autoFindWinners,
          sourceImageUrl: sourceImageUrl.trim() || undefined,
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
          const emoji = step.step.includes('found') ? '🔍' : 
                       step.step.includes('enhanced') ? '✨' : 
                       step.step.includes('mockup') ? '🎨' : 
                       step.step.includes('seo') ? '📝' : 
                       step.step.includes('pricing') ? '💰' : 
                       step.step.includes('printify') ? '🖨️' : 
                       step.step.includes('etsy') ? '🛍️' : '✅';
          setLog(prev => [...prev, `${emoji} ${step.step}`]);
        });
        setLog(prev => [...prev, '🎉 Smart launch completed successfully!']);
      } else {
        setLog(prev => [...prev, `❌ Error: ${data.error}`]);
      }
    } catch (err: any) {
      setLog(prev => [...prev, `❌ Failed: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  }

  async function testSmartMockup() {
    setLoading(true);
    setLog(['🧪 Testing smart mockup generation...']);

    try {
      const res = await fetch('/api/mockups/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          product,
          autoFindWinners,
          enhancementLevel,
          sourceImageUrl: sourceImageUrl.trim() || undefined
        })
      });

      const data = await res.json();

      if (data.success) {
        setLog(prev => [...prev, '✅ Smart mockup generated!']);
        setLog(prev => [...prev, `📊 Analysis: ${JSON.stringify(data.results.analysis).substring(0, 100)}...`]);
        setLog(prev => [...prev, `🎨 Mockup URL: ${data.results.mockup}`]);
        
        // Display the mockup
        setResults({ smartMockup: data.results });
      } else {
        setLog(prev => [...prev, `❌ Error: ${data.error}`]);
      }
    } catch (err: any) {
      setLog(prev => [...prev, `❌ Failed: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  }

  const selectedNicheData = etsyNiches.find(n => n.name === niche);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            🧠 Smart POD Builder
          </h1>
          <p className="text-xl text-gray-600">
            Automatically finds winning campaigns and creates enhanced versions
          </p>
          <div className="mt-4 p-6 bg-blue-100 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-900">
              <strong>How it works:</strong> The system finds top-performing images from successful campaigns,
              analyzes what makes them winners, then creates enhanced versions that preserve the winning elements
              while adding subtle improvements for even better performance.
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-2">
              ⚙️ Configuration
            </h2>

            {loadingNiches ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading top Etsy niches...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Niche Dropdown */}
                <div>
                  <label className="block text-sm font-semibold mb-4">
                    🎯 Niche {etsyNiches.length > 0 && <span className="text-xs text-green-600">(Auto-loaded from Etsy)</span>}
                  </label>
                  <select
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    {etsyNiches.map(n => (
                      <option key={n.id} value={n.name}>
                        {n.name} (Score: {n.trendScore}, Sales: {n.avgSales})
                      </option>
                    ))}
                  </select>
                  {selectedNicheData && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <div><strong>Category:</strong> {selectedNicheData.category}</div>
                      <div><strong>Competition:</strong> {selectedNicheData.competition}</div>
                      <div><strong>Keywords:</strong> {selectedNicheData.keywords.join(', ')}</div>
                    </div>
                  )}
                </div>

                {/* Product Dropdown */}
                <div>
                  <label className="block text-sm font-semibold mb-4">
                    📦 Product {selectedNicheData && <span className="text-xs text-green-600">(Recommended for this niche)</span>}
                  </label>
                  <select
                    value={product}
                    onChange={e => setProduct(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    {selectedNicheData ? (
                      selectedNicheData.products.map((p: string) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="tote bag">Tote Bag</option>
                        <option value="mug">Mug</option>
                        <option value="t-shirt">T-Shirt</option>
                        <option value="hoodie">Hoodie</option>
                        <option value="poster">Poster</option>
                        <option value="sticker">Sticker</option>
                        <option value="phone case">Phone Case</option>
                        <option value="pillow">Pillow</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Auto-find winners */}
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoFindWinners}
                      onChange={e => setAutoFindWinners(e.target.checked)}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <span className="text-sm font-extrabold text-green-900">🔍 Auto-find winning campaigns</span>
                      <p className="text-xs text-green-700">Automatically pull images from top-performing campaigns</p>
                    </div>
                  </label>
                </div>

                {/* Manual image URL */}
                {!autoFindWinners && (
                  <div>
                    <label className="block text-sm font-semibold mb-4">🖼️ Source Image URL (optional)</label>
                    <input
                      type="text"
                      value={sourceImageUrl}
                      onChange={e => setSourceImageUrl(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none text-sm"
                      placeholder="https://example.com/winning-design.jpg"
                    />
                  </div>
                )}

                {/* Enhancement level */}
                <div>
                  <label className="block text-sm font-semibold mb-4">✨ Enhancement Level</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-5 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="enhancement"
                        value="subtle"
                        checked={enhancementLevel === 'subtle'}
                        onChange={e => setEnhancementLevel('subtle')}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-semibold">Subtle (Recommended)</div>
                        <div className="text-xs text-gray-600">Preserves 95% of original, minimal improvements</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 p-5 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="enhancement"
                        value="moderate"
                        checked={enhancementLevel === 'moderate'}
                        onChange={e => setEnhancementLevel('moderate')}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-semibold">Moderate</div>
                        <div className="text-xs text-gray-600">Keeps 80% of original, adds complementary elements</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 p-5 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="enhancement"
                        value="significant"
                        checked={enhancementLevel === 'significant'}
                        onChange={e => setEnhancementLevel('significant')}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-semibold">Significant</div>
                        <div className="text-xs text-gray-600">Preserves 60% concept, fresh execution</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-4">
                  <button
                    onClick={smartLaunch}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
                  >
                    {loading ? '⏳ Processing...' : '🚀 Smart Launch (Full Pipeline)'}
                  </button>
                  <button
                    onClick={testSmartMockup}
                    disabled={loading}
                    className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {loading ? '⏳ Processing...' : '🧪 Test Mockup Only'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
                📊 Activity Log
              </h2>
              <div className="bg-gray-900 text-green-400 rounded-lg p-6 h-96 overflow-y-auto font-mono text-sm">
                {log.length === 0 ? (
                  <div className="text-gray-500">Ready to launch...</div>
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
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-extrabold mb-6">🎨 Results</h2>
                
                {results.smartMockup && (
                  <>
                    {results.smartMockup.mockup && (
                      <div className="mb-6">
                        <h3 className="font-bold mb-4 text-lg">Generated Mockup</h3>
                        <img 
                          src={results.smartMockup.mockup} 
                          alt="Product mockup" 
                          className="w-full rounded-lg border-4 border-blue-200 shadow-md"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {results.smartMockup.originalWinningImage && (
                        <div>
                          <h4 className="text-sm font-extrabold mb-1">Original Winner</h4>
                          <div className="text-xs text-gray-600 p-2 bg-gray-100 rounded">
                            {results.smartMockup.originalWinningImage.substring(0, 50)}...
                          </div>
                        </div>
                      )}
                      {results.smartMockup.enhancedDesign && (
                        <div>
                          <h4 className="text-sm font-extrabold mb-1">Enhanced Version</h4>
                          <div className="text-xs text-gray-600 p-2 bg-green-100 rounded">
                            {results.smartMockup.enhancedDesign.substring(0, 50)}...
                          </div>
                        </div>
                      )}
                    </div>

                    {results.smartMockup.analysis && (
                      <div className="mb-4 p-5 bg-blue-50 rounded-lg">
                        <h4 className="font-bold mb-4 text-sm">Image Analysis</h4>
                        <div className="text-xs space-y-1">
                          <div><strong>Strengths:</strong> {results.smartMockup.analysis.strengths?.join(', ')}</div>
                          <div><strong>Applied:</strong> {results.smartMockup.appliedEnhancements?.join(', ')}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {results.seo && (
                  <div className="mb-4 p-5 bg-purple-50 rounded-lg">
                    <h4 className="font-bold mb-4 text-sm">SEO Content</h4>
                    <div className="text-xs space-y-1">
                      <div><strong>Title:</strong> {results.seo.title}</div>
                      <div><strong>Tags:</strong> {results.seo.tags.join(', ')}</div>
                    </div>
                  </div>
                )}

                {results.calc && (
                  <div className="mb-4 p-5 bg-green-50 rounded-lg">
                    <h4 className="font-bold mb-4 text-sm">Pricing</h4>
                    <div className="text-xs space-y-1">
                      <div><strong>Profit:</strong> ${results.calc.outputs?.profit || 'N/A'} AUD</div>
                      <div><strong>Breakeven:</strong> ${results.calc.outputs?.breakevenItemPrice || 'N/A'} AUD</div>
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

