import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  RotateCcw, 
  Leaf
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { toast } from 'sonner';

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium?: number;
  fiber?: number;
}

export default function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<NutritionData | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [mealType, setMealType] = useState('lunch');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (taskId) {
      interval = setInterval(async () => {
        try {
          const res = await apiClient.get<any>(`/scans/${taskId}`);
          const scan = res.data;
          if (scan.status === 'completed') {
            setIsScanning(false);
            setTaskId(null);
            setResult(scan.nutrition_data);
            toast.success('Nutritional breakdown analyzed successfully ✨');
          } else if (scan.status === 'failed') {
            setIsScanning(false);
            setTaskId(null);
            toast.error(scan.error_message || 'Image analysis was inconclusive');
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

    setPreviewUrl(URL.createObjectURL(file));
    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiClient.post<any>('/scans', formData);
      setTaskId(res.data.task_id);
      toast.info('Analyzing meal photo with mindful AI vision...');
    } catch {
      setIsScanning(false);
      toast.error('Failed to submit photo for analysis');
    }
  };

  const handleSaveToDiary = async () => {
    if (!result) return;
    try {
      await apiClient.post('/diary', {
        food_name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        amount_consumed: 1,
        meal_type: mealType
      });
      toast.success(`Logged ${result.name} to ${mealType} journal 🌱`);
      setResult(null);
      setPreviewUrl(null);
    } catch {
      toast.error('Could not save entry to journal');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 antialiased text-[#1f2937]">
      
      {/* Scanner Header */}
      <div className="text-center space-y-2 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#15803d]">
          <Leaf className="w-3.5 h-3.5 fill-[#15803d]" />
          <span>SMART MEAL VISION</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1f2937] tracking-tight">
          Visual Food & Label Scanner
        </h1>
        <p className="text-xs text-[#6b7280] max-w-md mx-auto leading-relaxed">
          Snap your plate or upload packaging barcode photos to estimate calories, macros, and nutrients effortlessly.
        </p>
      </div>

      {!result ? (
        <div className="card-zen rounded-3xl p-6 sm:p-8 space-y-6 bg-[#fcfdf9]">
          
          {/* Calming Dropzone Container */}
          <div 
            onClick={() => !isScanning && fileInputRef.current?.click()}
            className="relative h-72 sm:h-80 w-full bg-[#f8faf7] rounded-2xl border-2 border-dashed border-[#bbf7d0] hover:border-[#15803d] hover:bg-[#f0fdf4] flex flex-col items-center justify-center overflow-hidden cursor-pointer group transition-all"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            {/* Preview Image if selected */}
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Selected plate preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            )}

            {/* Status Feedback */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
              {isScanning ? (
                <>
                  <Loader2 className="w-9 h-9 animate-spin text-[#15803d]" />
                  <span className="font-heading text-sm text-[#15803d] font-semibold">
                    Recognizing nutrients and ingredients...
                  </span>
                  <span className="text-xs text-[#6b7280]">
                    Task queued • Processing OCR and vision tags
                  </span>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-[#e5e7eb] flex items-center justify-center text-[#15803d] group-hover:scale-105 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm text-[#1f2937]">
                      Click to capture or drag meal photo here
                    </p>
                    <p className="text-xs text-[#6b7280] mt-0.5">
                      Supports JPG, PNG, HEIC up to 10MB
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#15803d] text-white text-xs font-semibold shadow-sm group-hover:bg-[#166534] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo File</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Calming Guide Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#4b5563]">
            <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e5e7eb]">
              <span className="font-semibold text-[#15803d] block mb-0.5">Plate Identification</span>
              Recognizes home-cooked meals, salads, bowls, and whole foods.
            </div>
            <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e5e7eb]">
              <span className="font-semibold text-[#15803d] block mb-0.5">Nutrition Facts Label</span>
              Reads standard FDA/USDA nutrition panels accurately.
            </div>
          </div>

        </div>
      ) : (
        /* Result Breakdown Card */
        <div className="card-zen rounded-3xl p-6 sm:p-8 space-y-6 bg-[#fcfdf9]">
          <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f0]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1f2937]">
                  Nutrition Breakdown Analyzed
                </h3>
                <span className="text-xs text-[#15803d] font-medium">
                  Verified against wholesome nutritional database
                </span>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setPreviewUrl(null); }}
              className="px-3 py-1.5 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#4b5563] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rescan</span>
            </button>
          </div>

          {/* Extracted Entity Header */}
          <div className="p-4 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#6b7280] block">Identified Item</span>
              <span className="font-heading font-bold text-lg text-[#1f2937] capitalize">
                {result.name || 'Identified Food'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6b7280] block">Estimated Energy</span>
              <span className="font-heading font-bold text-xl text-[#15803d] tabular-numbers">
                {result.calories || 0} <span className="text-xs font-normal text-[#6b7280]">kcal</span>
              </span>
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb]">
              <span className="text-xs font-medium text-[#166534] block">Protein</span>
              <span className="text-lg font-bold text-[#1f2937] tabular-numbers">{result.protein || 0}g</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb]">
              <span className="text-xs font-medium text-[#92400e] block">Carbs</span>
              <span className="text-lg font-bold text-[#1f2937] tabular-numbers">{result.carbs || 0}g</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb]">
              <span className="text-xs font-medium text-[#3f6212] block">Healthy Fats</span>
              <span className="text-lg font-bold text-[#1f2937] tabular-numbers">{result.fat || 0}g</span>
            </div>
          </div>

          {/* Commit to Diary Options */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#4b5563] block mb-2">Assign to Meal Category</label>
              <div className="grid grid-cols-4 gap-2">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMealType(type)}
                    className={`py-2 px-3 rounded-full capitalize text-xs font-semibold transition-all border ${
                      mealType === type
                        ? 'bg-[#15803d] border-[#15803d] text-white shadow-sm'
                        : 'bg-[#f8faf7] border-[#e5e7eb] text-[#4b5563] hover:text-[#1f2937]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveToDiary}
              className="w-full py-3 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Log Meal to Daily Journal</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
