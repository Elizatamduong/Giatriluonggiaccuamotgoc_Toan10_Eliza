import { useState, useCallback, useEffect, useRef } from 'react';
import { UnitCircleCanvas } from './components/UnitCircleCanvas';
import { ValuesPanel } from './components/ValuesPanel';
import { SupplementaryPanel } from './components/SupplementaryPanel';
import { ControlsBar } from './components/ControlsBar';
import { ObservationQuestions } from './components/ObservationQuestions';
import { computeTrigValues } from './utils/math';
import { GuideStep, AppMode } from './types';
import { BookOpen, Sparkles, HelpCircle, Compass, ArrowLeftRight, Phone } from 'lucide-react';

const GUIDE_SEQUENCE: GuideStep[] = [
  'point_m',
  'proj_ox',
  'coord_x0',
  'cos_relation',
  'proj_oy',
  'coord_y0',
  'sin_relation',
];

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('single_angle');
  const [angleDeg, setAngleDeg] = useState<number>(35); // Default clean angle for immediate clarity
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGuiding, setIsGuiding] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<GuideStep>('idle');
  const [guideIndex, setGuideIndex] = useState<number>(0);
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  const guideTimerRef = useRef<number | null>(null);

  const trigValues = computeTrigValues(angleDeg);
  const suppValues = computeTrigValues(180 - angleDeg);

  // Synchronous angle updater
  const handleAngleChange = useCallback((newAngle: number) => {
    setAngleDeg(newAngle);
  }, []);

  // Play / Pause auto movement
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    if (isGuiding) {
      setIsGuiding(false);
      setGuideStep('idle');
    }
  }, [isGuiding]);

  // Reset to 0 degrees
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setIsGuiding(false);
    setGuideStep('idle');
    setAngleDeg(0);
  }, []);

  // Switch mode handler
  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    setIsPlaying(false);
    setIsGuiding(false);
    setGuideStep('idle');
    if (guideTimerRef.current) clearTimeout(guideTimerRef.current);
    if (mode === 'supplementary_angles' && (angleDeg === 0 || angleDeg === 180)) {
      setAngleDeg(30); // Default to a visually rich angle for supplementary view
    }
  };

  // Guided connection cycle
  const handleToggleGuide = useCallback(() => {
    if (isGuiding) {
      setIsGuiding(false);
      setGuideStep('idle');
      if (guideTimerRef.current) clearTimeout(guideTimerRef.current);
    } else {
      setIsPlaying(false);
      setIsGuiding(true);
      setGuideIndex(0);
      setGuideStep(GUIDE_SEQUENCE[0]);
    }
  }, [isGuiding]);

  const handleNextGuideStep = useCallback(() => {
    if (guideIndex + 1 < GUIDE_SEQUENCE.length) {
      const nextIdx = guideIndex + 1;
      setGuideIndex(nextIdx);
      setGuideStep(GUIDE_SEQUENCE[nextIdx]);
    } else {
      // Completed cycle
      setIsGuiding(false);
      setGuideStep('idle');
    }
  }, [guideIndex]);

  // Auto advance guide steps gently every 3.5 seconds if guiding
  useEffect(() => {
    if (!isGuiding) return;

    guideTimerRef.current = window.setTimeout(() => {
      handleNextGuideStep();
    }, 3500);

    return () => {
      if (guideTimerRef.current) clearTimeout(guideTimerRef.current);
    };
  }, [isGuiding, guideIndex, handleNextGuideStep]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-100">
      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Zone 1: Brand title, single element */}
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-slate-900 text-sm sm:text-base md:text-lg font-sans">
            Toán 10 · Giá trị lượng giác từ 0° đến 180°
          </span>
        </div>

        {/* Zone 2: Activity Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => handleModeChange('single_angle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              appMode === 'single_angle'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khám phá góc đơn α</span>
            <span className="sm:hidden">Góc α</span>
          </button>

          <button
            onClick={() => handleModeChange('supplementary_angles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              appMode === 'supplementary_angles'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Hai góc bù nhau (α & 180°-α)</span>
            <span className="sm:hidden">Hai góc bù</span>
          </button>
        </div>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTheoryModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Tóm tắt bài học</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE / SANDBOX */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Context Briefing / Sub-banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {appMode === 'supplementary_angles'
                ? 'Hoạt động: Quan hệ giá trị lượng giác của hai góc bù nhau'
                : 'Mô phỏng trực quan nửa đường tròn đơn vị (0° đến 180°)'}
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {appMode === 'supplementary_angles' ? (
                <>
                  Hai điểm <strong className="text-blue-700">M(x₀ ; y₀)</strong> và <strong className="text-amber-800">M'(-x₀ ; y₀)</strong> đối xứng nhau qua <strong>trục tung Oy</strong>. Vì vậy: <span className="font-semibold text-emerald-700">sin(180° - α) = sin α</span> (cùng tung độ y₀), trong khi <span className="font-semibold text-blue-700">cos, tan, cot đối dấu nhau</span>!
                </>
              ) : (
                <>
                  Kéo trực tiếp <strong>điểm M</strong> trên nửa đường tròn hoặc dùng <strong>thanh trượt góc α</strong> để quan sát: vị trí điểm M xác định tọa độ <span className="font-mono text-blue-700 font-semibold">(x₀ ; y₀)</span>, từ đó xác định trực tiếp các giá trị lượng giác <span className="font-semibold text-blue-700">cos α = x₀</span> và <span className="font-semibold text-emerald-700">sin α = y₀</span>.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {appMode === 'single_angle' ? (
              <button
                onClick={handleToggleGuide}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                  isGuiding
                    ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-current" />
                <span>{isGuiding ? 'Dừng hướng dẫn' : 'Hiện mối liên hệ'}</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                <span>M và M' đối xứng qua Oy</span>
              </div>
            )}
          </div>
        </div>

        {/* Core Dual Zone: Visual Canvas (Left ~68%) + Dynamic Values Panel (Right ~32%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT ZONE: Interactive Stage */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <UnitCircleCanvas
                trigValues={trigValues}
                suppValues={suppValues}
                mode={appMode}
                onAngleChange={handleAngleChange}
                guideStep={guideStep}
              />
            </div>

            {/* Slider & Mode Controls */}
            <ControlsBar
              angleDeg={angleDeg}
              onAngleChange={handleAngleChange}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              isGuiding={isGuiding}
              guideStep={guideStep}
              onToggleGuide={handleToggleGuide}
              onNextGuideStep={handleNextGuideStep}
              mode={appMode}
            />
          </div>

          {/* RIGHT ZONE: Dynamic Values or Supplementary Comparison */}
          <div className="lg:col-span-4 flex flex-col">
            {appMode === 'supplementary_angles' ? (
              <SupplementaryPanel
                alphaValues={trigValues}
                suppValues={suppValues}
              />
            ) : (
              <ValuesPanel
                trigValues={trigValues}
                guideStep={guideStep}
              />
            )}
          </div>
        </div>

        {/* 3. SECTION: EM HÃY QUAN SÁT (EXPLORATION OBSERVATION QUESTIONS) */}
        <ObservationQuestions
          onSetAngle={handleAngleChange}
          mode={appMode}
        />
      </main>

      {/* 4. FOOTER */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-4 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="text-center md:text-left">
            <span>Toán 10 · Bộ sách Kết nối tri thức với cuộc sống · Bài 5: Giá trị lượng giác của một góc từ 0° đến 180°</span>
          </div>

          <div className="flex items-center gap-2 font-medium text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 font-serif">©</span>
            <span>Bản quyền: <strong className="text-indigo-900 font-semibold">Eliza Tâm Dương</strong></span>
            <span className="text-slate-300">·</span>
            <a
              href="tel:0962571826"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              title="Gọi điện liên hệ"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>SĐT: 0962571826</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Theory & Pedagogical Reference Modal */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Kiến thức trọng tâm (SGK Toán 10)
                </h3>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3.5 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">1. Định nghĩa giá trị lượng giác:</h4>
                <p>
                  Với mỗi góc <span className="font-serif italic font-semibold">α (0° ≤ α ≤ 180°)</span>, ta xác định một điểm duy nhất <span className="font-mono font-semibold">M(x₀ ; y₀)</span> trên nửa đường tròn đơn vị sao cho góc <span className="font-serif italic">xOM = α</span>.
                </p>

                <div className="mt-1.5 p-2.5 bg-slate-50 rounded-xl space-y-1 border border-slate-200 font-mono text-xs">
                  <div className="text-blue-700 font-bold">cos α = x₀ (hoành độ của M)</div>
                  <div className="text-emerald-700 font-bold">sin α = y₀ (tung độ của M)</div>
                  <div className="text-amber-800 font-bold">tan α = y₀ / x₀ (với x₀ ≠ 0, tức α ≠ 90°)</div>
                  <div className="text-purple-800 font-bold">cot α = x₀ / y₀ (với y₀ ≠ 0, tức α ≠ 0° và α ≠ 180°)</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">2. Giá trị lượng giác của hai góc bù nhau:</h4>
                <p>
                  Hai góc bù nhau có tổng bằng 180°: góc <span className="font-serif italic">α</span> và góc <span className="font-serif italic">(180° - α)</span>. Điểm biểu diễn <span className="font-semibold">M(x₀ ; y₀)</span> và <span className="font-semibold">M'(-x₀ ; y₀)</span> đối xứng nhau qua trục tung <span className="font-semibold">Oy</span>.
                </p>

                <div className="mt-1.5 p-2.5 bg-amber-50/70 rounded-xl space-y-1 border border-amber-200 font-mono text-xs">
                  <div className="text-emerald-700 font-bold">sin(180° - α) = sin α</div>
                  <div className="text-blue-700 font-bold">cos(180° - α) = -cos α</div>
                  <div className="text-amber-800 font-bold">tan(180° - α) = -tan α  (α ≠ 90°)</div>
                  <div className="text-purple-800 font-bold">cot(180° - α) = -cot α  (α ≠ 0°, 180°)</div>
                </div>
                <p className="mt-1 text-slate-500 italic">
                  Khẩu quyết ghi nhớ: <strong>"Sin bù"</strong> (hai góc bù nhau chỉ có sin bằng nhau, còn cos, tan, cot đối nhau).
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs">3. Dấu của các giá trị lượng giác:</h4>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                  <li>Khi <strong className="text-slate-800">0° &lt; α &lt; 90°</strong> (nhọn): <span className="text-blue-600 font-medium">cos α &gt; 0</span>, <span className="text-emerald-600 font-medium">sin α &gt; 0</span>, <span className="text-amber-600 font-medium">tan α &gt; 0</span>, <span className="text-purple-600 font-medium">cot α &gt; 0</span>.</li>
                  <li>Khi <strong className="text-slate-800">90° &lt; α &lt; 180°</strong> (tù): <span className="text-blue-600 font-medium">cos α &lt; 0</span>, <span className="text-emerald-600 font-medium">sin α &gt; 0</span>, <span className="text-amber-600 font-medium">tan α &lt; 0</span>, <span className="text-purple-600 font-medium">cot α &lt; 0</span>.</li>
                  <li><strong className="text-slate-800">sin α luôn không âm</strong> với mọi <span className="font-serif italic">α ∈ [0°; 180°]</span> vì nửa đường tròn nằm phía trên trục hoành.</li>
                </ul>
              </div>

              {/* Author Attribution in Modal */}
              <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Bản quyền tác giả: <strong className="text-slate-800">Eliza Tâm Dương</strong></span>
                <a href="tel:0962571826" className="text-indigo-600 font-medium hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  0962571826
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
