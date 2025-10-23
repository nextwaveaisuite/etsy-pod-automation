'use client';
import React from 'react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const res = await fetch('/api/analytics/dashboard');
      const data = await res.json();
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading analytics</div>;
  }

  const overview = analytics.overview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            📊 Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track sales, profit, performance, and more
          </p>
          <div className="text-sm text-gray-500 mt-2">
            {overview.period} • Last updated: just now
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-sm text-gray-600 mb-1">Total Sales</div>
            <div className="text-3xl font-bold text-indigo-600">{overview.totalSales}</div>
            <div className="text-xs text-green-600 mt-1">↑ +12% vs last period</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="text-3xl font-bold text-blue-600">${overview.totalRevenue.toFixed(2)}</div>
            <div className="text-xs text-green-600 mt-1">↑ +18% vs last period</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-sm text-gray-600 mb-1">Profit</div>
            <div className="text-3xl font-bold text-green-600">${overview.totalProfit.toFixed(2)}</div>
            <div className="text-xs text-green-600 mt-1">↑ +15% vs last period</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-sm text-gray-600 mb-1">Profit Margin</div>
            <div className="text-3xl font-bold text-purple-600">{overview.profitMargin}%</div>
            <div className="text-xs text-gray-500 mt-1">Healthy margin</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-extrabold mb-6">📈 Daily Sales</h2>
            <div className="space-y-2">
              {analytics.salesByDay.map((day: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="text-xs text-gray-500 w-20">{day.date.slice(5)}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                      style={{ width: `${(day.sales / 20) * 100}%` }}
                    >
                      {day.sales}
                    </div>
                  </div>
                  <div className="text-xs font-semibold w-16">${day.revenue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-extrabold mb-6">🏆 Top Products</h2>
            <div className="space-y-3">
              {analytics.topProducts.slice(0, 6).map((product: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-extrabold text-gray-300">#{i + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold">{product.name}</div>
                    <div className="text-xs text-gray-600">
                      {product.sales} sales • ${product.profit} profit • ⭐ {product.avgReviews}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">${product.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Sales by Product Type */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6">📦 By Product Type</h2>
            <div className="space-y-3">
              {analytics.salesByProduct.map((item: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">{item.product}</span>
                    <span className="text-gray-600">{item.count}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(item.count / 78) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Print Status */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6">🖨️ Print Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-5 bg-yellow-50 rounded">
                <span className="font-semibold">⏳ Pending</span>
                <span className="text-xl font-bold text-yellow-600">{analytics.printStatus.pending}</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-blue-50 rounded">
                <span className="font-semibold">🖨️ Printing</span>
                <span className="text-xl font-bold text-blue-600">{analytics.printStatus.printing}</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-purple-50 rounded">
                <span className="font-semibold">📦 Shipped</span>
                <span className="text-xl font-bold text-purple-600">{analytics.printStatus.shipped}</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-green-50 rounded">
                <span className="font-semibold">✅ Delivered</span>
                <span className="text-xl font-bold text-green-600">{analytics.printStatus.delivered}</span>
              </div>
              {analytics.printStatus.issues > 0 && (
                <div className="flex justify-between items-center p-5 bg-red-50 rounded">
                  <span className="font-semibold">⚠️ Issues</span>
                  <span className="text-xl font-bold text-red-600">{analytics.printStatus.issues}</span>
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6">🚦 Traffic Sources</h2>
            <div className="space-y-3">
              {analytics.trafficSources.map((source: any, i: number) => (
                <div key={i} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">{source.source}</span>
                    <span className="text-xs text-green-600 font-bold">{source.conversionRate}%</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {source.visits} visits → {source.conversions} sales
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-extrabold mb-6">📋 Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 font-bold text-sm">Order ID</th>
                  <th className="text-left py-3 px-2 font-bold text-sm">Date</th>
                  <th className="text-left py-3 px-2 font-bold text-sm">Product</th>
                  <th className="text-right py-3 px-2 font-bold text-sm">Amount</th>
                  <th className="text-right py-3 px-2 font-bold text-sm">Profit</th>
                  <th className="text-center py-3 px-2 font-bold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentOrders.map((order: any, i: number) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm font-mono">{order.id}</td>
                    <td className="py-3 px-2 text-sm">{order.date}</td>
                    <td className="py-3 px-2 text-sm">{order.product}</td>
                    <td className="py-3 px-2 text-sm text-right font-bold">${order.amount}</td>
                    <td className="py-3 px-2 text-sm text-right font-bold text-green-600">${order.profit}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        order.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refunds */}
        {analytics.refunds.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-extrabold mb-6">💸 Recent Refunds</h2>
            <div className="space-y-2">
              {analytics.refunds.map((refund: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-5 bg-red-50 rounded">
                  <div>
                    <div className="font-bold">{refund.id}</div>
                    <div className="text-sm text-gray-600">{refund.product} • {refund.date}</div>
                    <div className="text-xs text-gray-500">{refund.reason}</div>
                  </div>
                  <div className="text-lg font-bold text-red-600">-${refund.amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

