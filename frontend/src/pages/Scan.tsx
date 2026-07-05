import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ScanLine } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { toast } from 'sonner';

export default function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (taskId) {
      interval = setInterval(async () => {
        try {
          const res = await fetchApi(`/scans/${taskId}`);
          if (res.ok) {
            const data = await res.json();
            const scan = data.data;
            if (scan.status === 'completed') {
              setIsScanning(false);
              setTaskId(null);
              setResult(scan.nutrition_data);
              toast.success('Extraction successful!');
            } else if (scan.status === 'failed') {
              setIsScanning(false);
              setTaskId(null);
              toast.error(scan.error_message || 'Failed to extract nutrition data');
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [taskId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetchApi('/scans', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setTaskId(data.data.task_id);
      toast.info('Image uploaded, processing...');
    } catch (error) {
      setIsScanning(false);
      toast.error('Failed to upload image');
    }
  };

  const handleSaveToDiary = async () => {
    if (!result) return;
    try {
      // POST to diary endpoint
      const res = await fetchApi('/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_name: result.name,
          calories: result.calories,
          protein: result.protein,
          carbs: result.carbs,
          fat: result.fat,
          amount_consumed: 1, // default 1 serving
          meal_type: 'snack' // default
        }),
      });

      if (!res.ok) {
         throw new Error('Failed to save to diary');
      }
      toast.success('Saved to your diary!');
      setResult(null);
    } catch (error) {
      toast.error('Could not save to diary');
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">AI Label Scanner</h2>
        <p className="text-slate-400 mt-2">Upload a food image to automatically extract nutrition data via Gemini AI</p>
      </div>

      {!result ? (
        <div 
          className="glass border-dashed border-2 border-slate-600 rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 group cursor-pointer" 
          onClick={() => !isScanning && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          {isScanning ? (
            <div className="flex flex-col items-center">
              <ScanLine className="w-16 h-16 text-emerald-400 animate-pulse mb-4" />
              <p className="text-emerald-300 font-medium">Extracting nutrition info (this takes a few seconds)...</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Tap to Scan or Upload</h3>
              <p className="text-slate-500 text-sm max-w-xs">Supports JPG, PNG formats. Make sure the food is visible.</p>
              
              <button className="mt-6 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 pointer-events-none">
                <Upload className="w-4 h-4" /> Browse Files
              </button>
            </>
          )}

        </div>
      ) : (
        <div className="glass rounded-3xl p-6 border-emerald-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <ScanLine className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Scan Complete!</h3>
              <p className="text-emerald-400 text-sm">Successfully extracted data from Gemini</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-5 mb-6 border border-slate-700/50">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">{result.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {['Calories', 'Protein', 'Fat', 'Carbs'].map((k) => (
                  <div key={k} className="glass rounded-xl p-3 text-center">
                    <div className="text-xs text-slate-400">{k}</div>
                    <div className="text-lg font-bold text-slate-100">{result[k.toLowerCase()]}</div>
                  </div>
               ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleSaveToDiary}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20"
            >
              Save to Diary
            </button>
            <button onClick={() => setResult(null)} className="flex-1 glass hover:bg-white/10 text-slate-300 py-3 rounded-xl font-medium transition-all">
              Scan Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
