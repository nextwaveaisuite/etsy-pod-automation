'use client';
import React from 'react';

export default function PlannersPage() {
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [generating, setGenerating] = React.useState(false);
  const [generatedPlanner, setGeneratedPlanner] = React.useState<any>(null);
  const [customization, setCustomization] = React.useState({
    colors: ['#000000', '#FFFFFF'],
    title: '',
    style: 'minimalist' as 'minimalist' | 'colorful' | 'professional' | 'cute'
  });
  const [filterCategory, setFilterCategory] = React.useState('all');

  React.useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const res = await fetch('/api/planners/templates?limit=50');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  }

  async function generatePlanner() {
    if (!selectedTemplate) return;
    
    setGenerating(true);
    setGeneratedPlanner(null);
    
    try {
      const res = await fetch('/api/planners/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          customization: {
            ...customization,
            title: customization.title || selectedTemplate.name
          }
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setGeneratedPlanner(data);
      } else {
        alert('Failed to generate planner: ' + data.error);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setGenerating(false);
    }
  }

  const categories = ['all', ...new Set(templates.map(t => t.category))];
  const filteredTemplates = filterCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            📋 Productivity Planners Generator
          </h1>
          <p className="text-xl text-gray-600">
            Create beautiful, print-ready planners, trackers, and organizers for your POD store
          </p>
          <div className="mt-4 p-6 bg-green-100 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-900">
              <strong>15 ready-to-use templates!</strong> Daily planners, to-do lists, habit trackers, meal planners, and more. 
              All lightweight, easy to customize, and perfect for Etsy POD.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading templates...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Template Browser */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-extrabold">Browse Templates ({filteredTemplates.length})</h2>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-4 py-2"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-h-[800px] overflow-y-auto pr-2">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate?.id === template.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-lg">{template.name}</h3>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {template.difficulty}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        <div>📁 {template.category}</div>
                        <div>📄 {template.format}</div>
                        <div>💰 ${template.avgPrice}</div>
                        <div>⭐ Popularity: {template.popularity}%</div>
                        <div>⏱️ Design time: {template.designTime}</div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.colors.map((color: string, i: number) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <div className="text-xs text-gray-500">
                        {template.keywords.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customization & Generation Panel */}
            <div className="space-y-6">
              {selectedTemplate ? (
                <>
                  {/* Template Details */}
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-extrabold mb-6">Selected Template</h2>
                    <h3 className="text-xl font-bold text-purple-600 mb-3">
                      {selectedTemplate.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm mb-6">
                      <div><strong>Category:</strong> {selectedTemplate.category}</div>
                      <div><strong>Format:</strong> {selectedTemplate.format}</div>
                      <div><strong>Best for:</strong> {selectedTemplate.bestFor.join(', ')}</div>
                    </div>

                    <div className="mb-4">
                      <strong className="text-sm">Includes:</strong>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        {selectedTemplate.elements.slice(0, 5).map((el: string, i: number) => (
                          <li key={i}>✓ {el}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <strong className="text-sm">Print Options:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedTemplate.printOptions.map((opt: string) => (
                          <span key={opt} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customization */}
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-bold mb-6">Customize</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-4">Title (optional)</label>
                        <input
                          type="text"
                          value={customization.title}
                          onChange={e => setCustomization({...customization, title: e.target.value})}
                          placeholder={selectedTemplate.name}
                          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-4">Primary Color</label>
                        <input
                          type="color"
                          value={customization.colors[0]}
                          onChange={e => setCustomization({
                            ...customization, 
                            colors: [e.target.value, customization.colors[1]]
                          })}
                          className="w-full h-10 border-2 border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-4">Background Color</label>
                        <input
                          type="color"
                          value={customization.colors[1]}
                          onChange={e => setCustomization({
                            ...customization, 
                            colors: [customization.colors[0], e.target.value]
                          })}
                          className="w-full h-10 border-2 border-gray-300 rounded-lg"
                        />
                      </div>

                      <button
                        onClick={generatePlanner}
                        disabled={generating}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                      >
                        {generating ? '⏳ Generating...' : '🎨 Generate Planner'}
                      </button>
                    </div>
                  </div>

                  {/* Generated Result */}
                  {generatedPlanner && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h2 className="text-xl font-bold mb-6">✅ Generated!</h2>
                      
                      <div className="mb-4">
                        <img 
                          src={generatedPlanner.planner.imageUrl} 
                          alt="Generated planner" 
                          className="w-full border-2 border-gray-200 rounded-lg"
                        />
                      </div>

                      <div className="text-sm space-y-1 mb-6">
                        <div><strong>Format:</strong> {generatedPlanner.planner.format}</div>
                        <div><strong>Size:</strong> {generatedPlanner.planner.dimensions}</div>
                        <div><strong>DPI:</strong> {generatedPlanner.planner.dpi}</div>
                        <div><strong>File Size:</strong> {generatedPlanner.planner.fileSize}</div>
                      </div>

                      <div className="space-y-2">
                        <a
                          href={generatedPlanner.downloadFormats.png}
                          download={`${selectedTemplate.name.replace(/\s+/g, '-')}.png`}
                          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center"
                        >
                          📥 Download PNG
                        </a>
                        <a
                          href={generatedPlanner.downloadFormats.svg}
                          download={`${selectedTemplate.name.replace(/\s+/g, '-')}.svg`}
                          className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-center"
                        >
                          📥 Download SVG
                        </a>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg mb-4">👈 Select a template</p>
                    <p className="text-sm">Choose from {templates.length} ready-to-use planner templates</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

