'use client';
import React from 'react';

export default function PricingPage() {
  const [productType, setProductType] = React.useState('tote bag');
  const [minProfit, setMinProfit] = React.useState(5);
  const [maxProfit, setMaxProfit] = React.useState(13);
  const [targetProfit, setTargetProfit] = React.useState(10);
  const [customPrice, setCustomPrice] = React.useState('');
  const [results, setResults] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch('/api/calc/profit-optimizer');
      const data = await res.json();
      setProducts(data.allProducts || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }

  async function calculatePricing() {
    setLoading(true);
    try {
      const res = await fetch('/api/calc/profit-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          minProfit,
          maxProfit,
          targetProfit,
          itemPrice: customPrice ? parseFloat(customPrice) : undefined
        })
      });
      
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            💰 Profit Optimizer
          </h1>
          <p className="text-xl text-gray-600">
            Calculate optimal pricing to hit your $5-13 AUD profit targets
          </p>
          <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-900">
              <strong>Smart Pricing:</strong> Set your profit targets and we'll calculate the perfect price point. 
              Includes all Etsy fees, POD costs, and shipping calculations.
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Configure Your Product</h2>
            
            <div className="space-y-4">
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium mb-2">📦 Product Type</label>
                <select
                  value={productType}
                  onChange={e => setProductType(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profit Range */}
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <h3 className="font-bold text-green-900 mb-3">💵 Your Profit Targets (AUD)</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum Profit</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="3"
                        max="10"
                        step="0.5"
                        value={minProfit}
                        onChange={e => setMinProfit(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={minProfit}
                        onChange={e => setMinProfit(parseFloat(e.target.value) || 5)}
                        className="w-20 border-2 border-gray-300 rounded px-2 py-1 text-sm"
                        step="0.5"
                      />
                      <span className="text-sm font-bold">${minProfit}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Target Profit</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="5"
                        max="15"
                        step="0.5"
                        value={targetProfit}
                        onChange={e => setTargetProfit(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={targetProfit}
                        onChange={e => setTargetProfit(parseFloat(e.target.value) || 10)}
                        className="w-20 border-2 border-gray-300 rounded px-2 py-1 text-sm"
                        step="0.5"
                      />
                      <span className="text-sm font-bold">${targetProfit}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Maximum Profit</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="8"
                        max="20"
                        step="0.5"
                        value={maxProfit}
                        onChange={e => setMaxProfit(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={maxProfit}
                        onChange={e => setMaxProfit(parseFloat(e.target.value) || 13)}
                        className="w-20 border-2 border-gray-300 rounded px-2 py-1 text-sm"
                        step="0.5"
                      />
                      <span className="text-sm font-bold">${maxProfit}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-white rounded text-xs">
                  <strong>Your Range:</strong> ${minProfit} - ${maxProfit} AUD profit per sale
                </div>
              </div>

              {/* Test Custom Price */}
              <div>
                <label className="block text-sm font-medium mb-2">🧪 Test Custom Price (optional)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={e => setCustomPrice(e.target.value)}
                  placeholder="e.g., 24.95"
                  step="0.01"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a price to see if it meets your profit targets
                </p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculatePricing}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
              >
                {loading ? '⏳ Calculating...' : '💰 Calculate Optimal Pricing'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Current Price Analysis */}
                {results.currentPricing && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      {results.currentPricing.inRange ? '✅' : '⚠️'} Your Custom Price
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Item Price:</span>
                        <span className="text-xl font-bold">${results.currentPricing.itemPrice}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Gross Revenue:</span>
                        <span className="font-bold">${results.currentPricing.gross}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <span className="font-medium">Total Costs & Fees:</span>
                        <span className="font-bold text-red-600">-${results.currentPricing.costs + results.currentPricing.totalFees}</span>
                      </div>
                      <div className={`flex justify-between items-center p-4 rounded ${
                        results.currentPricing.inRange ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <span className="font-bold text-lg">Your Profit:</span>
                        <span className={`text-2xl font-bold ${
                          results.currentPricing.inRange ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          ${results.currentPricing.profit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="font-medium">Profit Margin:</span>
                        <span className="font-bold text-blue-600">{results.currentPricing.marginPct}%</span>
                      </div>
                    </div>

                    {!results.currentPricing.inRange && (
                      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <p className="text-sm text-yellow-900">
                          {results.currentPricing.profit < minProfit 
                            ? `⚠️ Profit is below your minimum target of $${minProfit}. Consider increasing price.`
                            : `⚠️ Profit exceeds your maximum target of $${maxProfit}. You could lower price for more sales.`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommended Pricing */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">🎯 Recommended Pricing</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="p-4 border-2 border-green-500 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-green-900">⭐ Optimal Price</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${results.pricingTiers.recommended.optimal.itemPrice}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Profit:</span>
                          <span className="font-bold">${results.pricingTiers.recommended.optimal.profit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margin:</span>
                          <span className="font-bold">{results.pricingTiers.recommended.optimal.marginPct}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-gray-300 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Conservative</div>
                        <div className="font-bold text-lg">${results.pricingTiers.recommended.conservative.itemPrice}</div>
                        <div className="text-xs text-gray-600">Profit: ${results.pricingTiers.recommended.conservative.profit}</div>
                      </div>
                      <div className="p-3 border border-gray-300 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Premium</div>
                        <div className="font-bold text-lg">${results.pricingTiers.recommended.premium.itemPrice}</div>
                        <div className="text-xs text-gray-600">Profit: ${results.pricingTiers.recommended.premium.profit}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">💡 Strategy</h3>
                    <p className="text-sm text-blue-800">
                      {results.marketInsights.recommendation.pricingStrategy}
                    </p>
                  </div>
                </div>

                {/* Pricing Tiers */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">📊 Pricing Tiers</h2>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Minimum (${minProfit} profit)</div>
                          <div className="text-xs text-gray-600">Lowest acceptable price</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${results.pricingTiers.minimum.itemPrice}</div>
                          <div className="text-xs text-gray-600">{results.pricingTiers.minimum.marginPct}% margin</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded border-2 border-green-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-green-900">Target (${targetProfit} profit)</div>
                          <div className="text-xs text-green-700">Your goal price</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl text-green-600">${results.pricingTiers.target.itemPrice}</div>
                          <div className="text-xs text-green-700">{results.pricingTiers.target.marginPct}% margin</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Maximum (${maxProfit} profit)</div>
                          <div className="text-xs text-gray-600">Upper limit price</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${results.pricingTiers.maximum.itemPrice}</div>
                          <div className="text-xs text-gray-600">{results.pricingTiers.maximum.marginPct}% margin</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">📈 Market Insights</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Competitive Price Range</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">${results.marketInsights.competitivePriceRange.low}</span>
                        <div className="flex-1 h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded"></div>
                        <span className="text-sm">${results.marketInsights.competitivePriceRange.high}</span>
                      </div>
                      <div className="text-center mt-1">
                        <span className="text-xs text-gray-600">Average: ${results.marketInsights.competitivePriceRange.average}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-sm font-medium mb-2">💡 Recommendation:</div>
                      <ul className="text-xs space-y-1">
                        {results.marketInsights.recommendation.reasoning.map((reason: string, i: number) => (
                          <li key={i} className="text-gray-700">• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">👈 Configure your product</p>
                  <p className="text-sm">Set your profit targets and click Calculate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

