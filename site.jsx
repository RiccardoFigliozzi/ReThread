import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Leaf, 
  Scissors, 
  ArrowRight, 
  RefreshCw, 
  History,
  Info,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const App = () => {
  // --- App State ---
  const [view, setView] = useState('landing'); // 'landing' | 'studio' | 'results'
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [vibe, setVibe] = useState('avant-garde');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  // --- AI Config ---
  const apiKey = ""; // Managed by environment
  
  const VIBES = [
    { id: 'minimalist', label: 'Quiet Luxury', desc: 'Sleek, refined, and understated' },
    { id: 'avant-garde', label: 'Avant-Garde', desc: 'Bold structures and artistic flair' },
    { id: 'boho-chic', label: 'Boho Chic', desc: 'Flowing shapes and relaxed patterns' },
    { id: 'streetwear', label: 'Urban Edge', desc: 'Modern, modular, and functional' }
  ];

  // --- Handlers ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result.split(',')[1]); // base64 without prefix
        setPreviewUrl(reader.result);
        setView('studio');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRedesign = async () => {
    if (!selectedImage) return;
    setIsGenerating(true);
    setError(null);

    const prompt = `Redesign this garment into a ${vibe} high-fashion masterpiece. 
    Keep the same fabric texture, color palette, and patterns from the original. 
    The new design should be an upcycled version that transforms the old silhouette 
    into a modern, sophisticated ${VIBES.find(v => v.id === vibe).label} style. 
    Professional fashion photography, white studio background, high detail.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/png", data: selectedImage } }
            ]
          }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
          }
        })
      });

      const result = await response.json();
      const base64Data = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      
      if (base64Data) {
        setGeneratedImage(`data:image/png;base64,${base64Data}`);
        setView('results');
      } else {
        throw new Error("Transformation failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Components ---

  const LandingPage = () => (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-6xl px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
            <Leaf size={16} />
            <span>Sustainability meets Generative AI</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-light leading-tight">
            Give your wardrobe <br />
            <span className="italic font-normal text-emerald-800">another life.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-md leading-relaxed">
            Upload any garment you no longer wear. Our AI reimagines it into a modern masterpiece using the same fabric you already own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 rounded-full cursor-pointer hover:bg-gray-800 transition shadow-xl group">
              <Upload size={20} className="group-hover:-translate-y-1 transition" />
              <span className="font-medium">Upload Garment</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button className="flex items-center justify-center space-x-2 border border-gray-200 px-8 py-4 rounded-full hover:bg-gray-50 transition">
              <span>View Gallery</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="w-80 h-[500px] bg-gray-100 rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1539109132314-3477524c8830?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover grayscale" 
              alt="Model wearing dress"
            />
            <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                <span>Transformation Case #04</span>
                <Sparkles size={14} className="text-emerald-600" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium">Vintage Silk Dress</p>
                  <p className="text-xs text-gray-500">→ Asymmetric Evening Gown</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-700">-85%</p>
                  <p className="text-[10px] text-gray-400 uppercase">Carbon Impact</p>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative floating elements */}
          <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-gray-50 hidden lg:block">
            <Scissors className="text-gray-300 mb-2" />
            <div className="h-2 w-20 bg-gray-100 rounded-full mb-2"></div>
            <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const StudioView = () => (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setView('landing')} className="text-gray-500 flex items-center gap-2 hover:text-black">
          <ArrowRight className="rotate-180" size={18} />
          <span>Cancel</span>
        </button>
        <h2 className="text-2xl font-serif">Redesign Studio</h2>
        <div className="w-10"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 border-2 border-gray-50 shadow-inner relative">
            <img src={previewUrl} className="w-full h-full object-cover" alt="Original" />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs uppercase tracking-widest">
              Original Source
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-600" />
              Choose Transformation Vibe
            </h3>
            <div className="space-y-3">
              {VIBES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVibe(v.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                    vibe === v.id 
                    ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-50' 
                    : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{v.label}</span>
                    {vibe === v.id && <div className="w-2 h-2 rounded-full bg-emerald-600"></div>}
                  </div>
                  <p className="text-sm text-gray-500">{v.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateRedesign}
            disabled={isGenerating}
            className="mt-12 w-full bg-emerald-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-emerald-950 transition-all shadow-lg shadow-emerald-900/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" />
                <span>AI Reimagining Pattern...</span>
              </>
            ) : (
              <>
                <Maximize2 size={20} />
                <span>Begin Transformation</span>
              </>
            )}
          </button>
          
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );

  const ResultsView = () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-2">A New Legacy</h2>
        <p className="text-gray-500 italic">Redesigned into {VIBES.find(v => v.id === vibe).label}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={previewUrl} className="w-full h-full object-cover" alt="Original" />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <h4 className="text-xs font-bold uppercase text-gray-400 mb-1">Source Material</h4>
              <p className="text-sm">Maintained fabric integrity and color palette.</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/6] rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white border border-gray-100">
              <img src={generatedImage} className="w-full h-full object-cover" alt="Redesign" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-black text-white p-6 rounded-3xl shadow-xl">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <Leaf size={16} />
                <span className="text-xs font-bold">ECO IMPACT</span>
              </div>
              <p className="text-3xl font-light">12.4<span className="text-lg">kg</span></p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Carbon Footprint Saved</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-serif">Tailoring Guide</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <div>
                  <p className="font-bold text-sm">Deconstruct Seams</p>
                  <p className="text-xs text-gray-500">Carefully separate the side panels while preserving the fabric grain.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <div>
                  <p className="font-bold text-sm">Re-Draping</p>
                  <p className="text-xs text-gray-500">Apply the new bias cut as shown in the AI silhouette for the {vibe} effect.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                <div>
                  <p className="font-bold text-sm">Finishing</p>
                  <p className="text-xs text-gray-500">Use invisible stitching on the hems to maintain the luxury finish.</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition">
              <Scissors size={18} />
              <span>Connect with Tailor</span>
            </button>
            <button 
              onClick={() => setView('studio')}
              className="w-full py-4 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <RefreshCw size={18} />
              <span>Try New Vibe</span>
            </button>
          </div>

          <div className="p-6 bg-gray-900 rounded-3xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Info size={20} />
              </div>
              <span className="font-bold">Why Upcycle?</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              "Redesigning a single dress saves approximately 2,500 liters of water compared to buying new."
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
              <span>WATER SAVED</span>
              <span>2.5K L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFCFA] text-black font-sans selection:bg-emerald-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white">
            <RefreshCw size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight uppercase">ReThread</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-12 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-black transition">How it Works</a>
          <a href="#" className="hover:text-black transition">Environmental Impact</a>
          <a href="#" className="hover:text-black transition">Find Tailors</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden sm:block text-sm font-medium hover:text-emerald-700 transition">Login</button>
          <button className="bg-emerald-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 hover:bg-emerald-950 transition">
            Start Designing
          </button>
        </div>
      </nav>

      <main>
        {view === 'landing' && <LandingPage />}
        {view === 'studio' && <StudioView />}
        {view === 'results' && <ResultsView />}
      </main>

      <footer className="mt-20 border-t border-gray-100 py-20 px-8 text-center bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center space-x-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-200"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          </div>
          <p className="text-4xl font-serif max-w-2xl mx-auto leading-tight">
            The most sustainable garment is the one already in your closet.
          </p>
          <div className="flex flex-wrap justify-center gap-8 pt-10 border-t border-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>TikTok</span>
            <span>Sustainability Report 2024</span>
          </div>
          <p className="text-gray-300 text-xs pt-8">© 2024 ReThread AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
