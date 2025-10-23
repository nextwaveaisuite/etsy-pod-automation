'use client';
import React from 'react';

export default function PricingPage() {
  const [tiers, setTiers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadTiers();
  }, []);

  async function loadTiers() {
    try {
      const res = await fetch('/api/subscription/tiers');
      const data = await res.json();
      // Filter out owner tier from public display
      const publicTiers = Object.values(data.tiers).filter((t: any) => t.id !== 'owner');
      setTiers(publicTiers);
    } catch (err) {
      console.error('Failed to load tiers:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-2xl text-gray-600 mb-2">
            Start free, upgrade as you grow
          </p>
          <p className="text-lg text-gray-500">
            All plans include core features. Unlock advanced automation as you scale.
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier: any) => (
            <div
              key={tier.id}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:scale-105 ${
                tier.id === 'pro' ? 'ring-4 ring-indigo-600 relative' : ''
              }`}
            >
              {tier.id === 'pro' && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-indigo-600">${tier.price}</span>
                  {tier.price > 0 && <span className="text-gray-600">/{tier.period}</span>}
                  {tier.price === 0 && <span className="text-gray-600"> forever</span>}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all ${
                    tier.id === 'free'
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      : tier.id === 'pro'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900'
                  }`}
                >
                  {tier.id === 'free' ? 'Get Started Free' : `Upgrade to ${tier.name}`}
                </button>

                <div className="mt-8 space-y-4">
                  <div className="font-bold text-gray-900 mb-3">What's included:</div>
                  
                  {/* Image Management */}
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">📸 Images</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {tier.features.zipUpload ? (
                        <div>✅ Zip upload & extract</div>
                      ) : (
                        <div>❌ Manual upload only</div>
                      )}
                      <div>• Up to {tier.features.maxImages} images</div>
                    </div>
                  </div>

                  {/* Editor */}
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">✏️ Editor</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {tier.features.advancedEditing ? (
                        <div>✅ Advanced editing</div>
                      ) : (
                        <div>❌ Basic only (resize, rotate)</div>
                      )}
                      {tier.features.textOverlay ? (
                        <div>✅ Text overlay</div>
                      ) : (
                        <div>❌ No text overlay</div>
                      )}
                    </div>
                  </div>

                  {/* Providers */}
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">🏭 Providers</div>
                    <div className="text-sm text-gray-600">
                      {Array.isArray(tier.features.providers) ? (
                        <div>• {tier.features.providers.length} provider{tier.features.providers.length > 1 ? 's' : ''}</div>
                      ) : (
                        <div>• All providers</div>
                      )}
                    </div>
                  </div>

                  {/* Automation */}
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">🤖 Automation</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {tier.features.autoPublish ? <div>✅ Auto-publish</div> : <div>❌ Manual publish</div>}
                      {tier.features.autoPrice ? <div>✅ Auto-pricing</div> : <div>❌ Manual pricing</div>}
                      {tier.features.autoSEO ? <div>✅ Auto-SEO</div> : <div>❌ Manual SEO</div>}
                    </div>
                  </div>

                  {/* Analytics */}
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">📊 Analytics</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {tier.features.advancedAnalytics ? (
                        <div>✅ Advanced analytics</div>
                      ) : (
                        <div>❌ Basic only</div>
                      )}
                      {tier.features.exportData ? (
                        <div>✅ Export data</div>
                      ) : (
                        <div>❌ No export</div>
                      )}
                    </div>
                  </div>

                  {/* Support */}
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">💬 Support</div>
                    <div className="text-sm text-gray-600">
                      • {tier.features.chatLimit} AI messages/day
                      {tier.features.prioritySupport && <div>✅ Priority support</div>}
                    </div>
                  </div>

                  {/* Limits */}
                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">📦 Limits</div>
                    <div className="text-sm text-gray-600">
                      • {tier.features.maxProducts} products max
                      • {tier.features.opportunitiesLimit === -1 ? 'Unlimited' : tier.features.opportunitiesLimit} opportunities
                    </div>
                  </div>
                </div>
              </div>

              {tier.limitations && tier.limitations.length > 0 && (
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-700 mb-2">Limitations:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {tier.limitations.slice(0, 3).map((limit: string, i: number) => (
                      <li key={i}>• {limit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Success Story */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">✅ Even Free Users Can Succeed!</h2>
            <p className="text-xl mb-6">
              With the free plan, you can still create profitable products - it just requires more manual work.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm">Products on free plan</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold">$8-13</div>
                <div className="text-sm">Profit per sale</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold">$40-65</div>
                <div className="text-sm">Monthly potential</div>
              </div>
            </div>
            <p className="mt-6 text-sm opacity-90">
              Upgrade when you're ready to scale with automation and advanced features!
            </p>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Detailed Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold">Feature</th>
                  <th className="text-center py-4 px-4 font-bold">Free</th>
                  <th className="text-center py-4 px-4 font-bold">Starter</th>
                  <th className="text-center py-4 px-4 font-bold bg-indigo-50">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Image Upload", free: "✅", starter: "✅", pro: "✅" },
                  { name: "Zip Upload & Extract", free: "❌", starter: "✅", pro: "✅" },
                  { name: "Max Images", free: "10", starter: "100", pro: "500" },
                  { name: "Basic Image Editing", free: "✅", starter: "✅", pro: "✅" },
                  { name: "Advanced Filters", free: "❌", starter: "✅", pro: "✅" },
                  { name: "Text Overlay", free: "❌", starter: "❌", pro: "✅" },
                  { name: "Print Providers", free: "1", starter: "2", pro: "4+" },
                  { name: "Opportunities View", free: "3", starter: "10", pro: "All" },
                  { name: "Auto-Publish", free: "❌", starter: "✅", pro: "✅" },
                  { name: "Auto-Pricing", free: "❌", starter: "✅", pro: "✅" },
                  { name: "Auto-SEO", free: "❌", starter: "❌", pro: "✅" },
                  { name: "Advanced Analytics", free: "❌", starter: "✅", pro: "✅" },
                  { name: "Export Data", free: "❌", starter: "❌", pro: "✅" },
                  { name: "AI Chat Messages", free: "10/day", starter: "50/day", pro: "200/day" },
                  { name: "Max Products", free: "5", starter: "50", pro: "500" },
                  { name: "Priority Support", free: "❌", starter: "❌", pro: "✅" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{row.name}</td>
                    <td className="py-3 px-4 text-center">{row.free}</td>
                    <td className="py-3 px-4 text-center">{row.starter}</td>
                    <td className="py-3 px-4 text-center bg-indigo-50 font-bold">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
