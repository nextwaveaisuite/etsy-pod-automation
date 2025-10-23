'use client';
import React from 'react';

export default function EditorPage() {
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [editedImage, setEditedImage] = React.useState<string>('');
  const [operations, setOperations] = React.useState<any[]>([]);
  const [processing, setProcessing] = React.useState(false);
  
  // Edit controls
  const [resizeWidth, setResizeWidth] = React.useState(1000);
  const [resizeHeight, setResizeHeight] = React.useState(1000);
  const [rotateAngle, setRotateAngle] = React.useState(0);
  const [brightness, setBrightness] = React.useState(1);
  const [contrast, setContrast] = React.useState(1);
  const [blurAmount, setBlurAmount] = React.useState(0);
  const [textOverlay, setTextOverlay] = React.useState('');
  const [textSize, setTextSize] = React.useState(48);
  const [textColor, setTextColor] = React.useState('#FFFFFF');
  const [filter, setFilter] = React.useState('none');

  async function selectImageFromLibrary() {
    const res = await fetch('/api/images/upload');
    const data = await res.json();
    
    if (data.images && data.images.length > 0) {
      setSelectedImage(data.images[0].path);
    } else {
      alert('No images in library. Upload some first!');
    }
  }

  function addOperation(type: string, params: any) {
    setOperations([...operations, { type, params }]);
  }

  function clearOperations() {
    setOperations([]);
    setEditedImage('');
  }

  async function applyEdits() {
    if (!selectedImage) {
      alert('Select an image first!');
      return;
    }

    if (operations.length === 0) {
      alert('Add some edits first!');
      return;
    }

    setProcessing(true);
    
    try {
      const res = await fetch('/api/images/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePath: selectedImage,
          operations,
          saveas: `edited_${Date.now()}.jpg`
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setEditedImage(data.url);
        alert('✅ Image edited successfully!');
      } else {
        alert('❌ Edit failed: ' + data.error);
      }
      
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            ✨ Image Editor
          </h1>
          <p className="text-xl text-gray-600">
            Crop, resize, filter, add text - all in-house editing
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Image Source</h2>
              
              <button
                onClick={selectImageFromLibrary}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg mb-2"
              >
                📂 Select from Library
              </button>
              
              {selectedImage && (
                <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded truncate">
                  {selectedImage.split('/').pop()}
                </div>
              )}
            </div>

            {/* Resize */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-3">📐 Resize</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm">Width</label>
                  <input
                    type="number"
                    value={resizeWidth}
                    onChange={e => setResizeWidth(parseInt(e.target.value))}
                    className="w-full border-2 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Height</label>
                  <input
                    type="number"
                    value={resizeHeight}
                    onChange={e => setResizeHeight(parseInt(e.target.value))}
                    className="w-full border-2 rounded px-2 py-1"
                  />
                </div>
                <button
                  onClick={() => addOperation('resize', { width: resizeWidth, height: resizeHeight })}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                  Add Resize
                </button>
              </div>
            </div>

            {/* Rotate */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-3">🔄 Rotate</h3>
              <input
                type="range"
                min="0"
                max="360"
                value={rotateAngle}
                onChange={e => setRotateAngle(parseInt(e.target.value))}
                className="w-full mb-2"
              />
              <div className="text-center mb-2">{rotateAngle}°</div>
              <button
                onClick={() => addOperation('rotate', { angle: rotateAngle })}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
              >
                Add Rotate
              </button>
            </div>

            {/* Adjustments */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-3">🎨 Adjustments</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Brightness: {brightness}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={brightness}
                    onChange={e => setBrightness(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <button
                    onClick={() => addOperation('brightness', { value: brightness })}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded text-sm mt-1"
                  >
                    Add
                  </button>
                </div>

                <div>
                  <label className="text-sm">Contrast: {contrast}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={contrast}
                    onChange={e => setContrast(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <button
                    onClick={() => addOperation('contrast', { value: contrast })}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded text-sm mt-1"
                  >
                    Add
                  </button>
                </div>

                <div>
                  <label className="text-sm">Blur: {blurAmount}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={blurAmount}
                    onChange={e => setBlurAmount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <button
                    onClick={() => addOperation('blur', { sigma: blurAmount })}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded text-sm mt-1"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-3">🌈 Filters</h3>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full border-2 rounded px-2 py-2 mb-2"
              >
                <option value="none">None</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
                <option value="negative">Negative</option>
                <option value="normalize">Normalize</option>
              </select>
              <button
                onClick={() => addOperation('filter', { name: filter })}
                disabled={filter === 'none'}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 rounded"
              >
                Add Filter
              </button>
            </div>

            {/* Text Overlay */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-3">📝 Text Overlay</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={textOverlay}
                  onChange={e => setTextOverlay(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full border-2 rounded px-2 py-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">Size</label>
                    <input
                      type="number"
                      value={textSize}
                      onChange={e => setTextSize(parseInt(e.target.value))}
                      className="w-full border-2 rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs">Color</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={e => setTextColor(e.target.value)}
                      className="w-full border-2 rounded h-8"
                    />
                  </div>
                </div>
                <button
                  onClick={() => addOperation('text', { 
                    text: textOverlay, 
                    fontSize: textSize, 
                    color: textColor,
                    x: 50,
                    y: 50
                  })}
                  disabled={!textOverlay}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 rounded"
                >
                  Add Text
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold mb-3">🎬 Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={applyEdits}
                  disabled={processing || operations.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg"
                >
                  {processing ? '⏳ Processing...' : '✨ Apply All Edits'}
                </button>
                <button
                  onClick={clearOperations}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                >
                  🗑️ Clear All
                </button>
              </div>
              
              {operations.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                  <strong>{operations.length} operation(s) queued</strong>
                  <ul className="mt-1 space-y-1">
                    {operations.map((op, i) => (
                      <li key={i}>• {op.type}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Preview</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Original */}
                <div>
                  <h3 className="font-bold mb-2">Original</h3>
                  {selectedImage ? (
                    <img
                      src={`/api/images/serve?path=${encodeURIComponent(selectedImage)}`}
                      alt="Original"
                      className="w-full border-2 border-gray-200 rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      No image selected
                    </div>
                  )}
                </div>

                {/* Edited */}
                <div>
                  <h3 className="font-bold mb-2">Edited</h3>
                  {editedImage ? (
                    <div>
                      <img
                        src={editedImage}
                        alt="Edited"
                        className="w-full border-2 border-green-500 rounded-lg mb-2"
                      />
                      <a
                        href={editedImage}
                        download
                        className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded"
                      >
                        📥 Download
                      </a>
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      Apply edits to see result
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

