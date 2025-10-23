'use client';
import React from 'react';

export default function LibraryPage() {
  const [images, setImages] = React.useState<any[]>([]);
  const [folders, setFolders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  React.useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    setLoading(true);
    try {
      const res = await fetch('/api/images/upload');
      const data = await res.json();
      setImages(data.images || []);
      setFolders(data.folders || []);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        
        if (data.success) {
          if (data.type === 'zip') {
            alert(`✅ Extracted ${data.imageCount} images from ${file.name}`);
          } else {
            alert(`✅ Uploaded ${file.name}`);
          }
        } else {
          alert(`❌ Failed to upload ${file.name}: ${data.error}`);
        }
      }
      
      // Reload library
      await loadLibrary();
      
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  function toggleImageSelection(path: string) {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedImages(newSelected);
  }

  async function deleteSelected() {
    if (selectedImages.size === 0) return;
    
    if (!confirm(`Delete ${selectedImages.size} selected image(s)?`)) return;
    
    try {
      for (const path of Array.from(selectedImages)) {
        await fetch(`/api/images/upload?path=${encodeURIComponent(path)}`, {
          method: 'DELETE'
        });
      }
      
      setSelectedImages(new Set());
      await loadLibrary();
      alert('✅ Deleted successfully');
      
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            🖼️ Image Library
          </h1>
          <p className="text-xl text-gray-600">
            Upload zip files or individual images - manage your design collection
          </p>
        </header>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold">Upload Images</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              >
                List
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".zip,.jpg,.jpeg,.png,.gif,.webp"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              {uploading ? '⏳ Uploading...' : '📤 Choose Files or Zip'}
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Supports: ZIP files (auto-extract), JPG, PNG, GIF, WEBP
            </p>
          </div>

          {selectedImages.size > 0 && (
            <div className="mt-4 p-6 bg-indigo-50 rounded-lg flex items-center justify-between">
              <span className="font-semibold">{selectedImages.size} image(s) selected</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedImages(new Set())}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Clear Selection
                </button>
                <button
                  onClick={deleteSelected}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  🗑️ Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-indigo-600">{images.length}</div>
            <div className="text-sm text-gray-600">Total Images</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">{folders.length}</div>
            <div className="text-sm text-gray-600">Folders</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-pink-600">{selectedImages.size}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </div>
        </div>

        {/* Image Gallery */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading library...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-500 mb-6">📂 Your library is empty</p>
            <p className="text-gray-400">Upload some images or zip files to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-extrabold mb-6">Your Images ({images.length})</h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => toggleImageSelection(img.path)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                      selectedImages.has(img.path) ? 'ring-4 ring-indigo-600' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedImages.has(img.path) && (
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 truncate">
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => toggleImageSelection(img.path)}
                    className={`flex items-center gap-6 p-5 rounded-lg cursor-pointer transition-all ${
                      selectedImages.has(img.path) ? 'bg-indigo-100 ring-2 ring-indigo-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{img.name}</div>
                      <div className="text-xs text-gray-500">{img.folder || '/'}</div>
                    </div>
                    {selectedImages.has(img.path) && (
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
