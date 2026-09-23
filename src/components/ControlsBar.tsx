import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { GuideStep, AppMode } from '../types';

interface ControlsBarProps {
  angleDeg: number;
  onAngleChange: (angle: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  isGuiding: boolean;
  guideStep: GuideStep;
  onToggleGuide: () => void;
  onNextGuideStep: () => void;
  mode?: AppMode;
}

const PRESET_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180];
const SUPPLEMENTARY_PAIRS = [
  { a: 30, b: 150 },
  { a: 45, b: 135 },
  { a: 60, b: 120 },
  { a: 0, b: 180 },
  { a: 90, b: 90 },
];

export const ControlsBar: React.FC<ControlsBarProps> = ({
  angleDeg,
  onAngleChange,
  isPlaying,
  onTogglePlay,
  onReset,
  isGuiding,
  guideStep,
  onToggleGuide,
  onNextGuideStep,
  mode = 'single_angle',
}) => {
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Auto-play animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
      return;
    }

    const speedDegPerSec = 16; // Gentle, smooth observation speed (~11 seconds for 0° to 180°)

    const step = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSec = (time - lastTimeRef.current) / 1000;
        let nextAngle = angleDeg + speedDegPerSec * deltaSec;
        if (nextAngle >= 180) {
          nextAngle = 180;
          onAngleChange(180);
          onTogglePlay(); // Stop when reaching 180°
          return;
        }
        onAngleChange(nextAngle);
      }
      lastTimeRef.current = time;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, angleDeg, onAngleChange, onTogglePlay]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* 1. Main Slider Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-[210px]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs text-slate-500">Góc α:</span>
            <span className="font-mono font-bold text-base text-blue-700 tabular-nums">
              {Math.round(angleDeg)}°
            </span>
          </div>

          {mode === 'supplementary_angles' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="font-semibold text-xs text-slate-500">180°-α:</span>
              <span className="font-mono font-bold text-base text-amber-700 tabular-nums">
                {Math.round(180 - angleDeg)}°
              </span>
            </div>
          )}
        </div>

        {/* The range slider */}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-slate-400">0°</span>
          <input
            type="range"
            min={0}
            max={180}
            step={0.5}
            value={angleDeg}
            onChange={(e) => onAngleChange(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          />
          <span className="text-xs font-mono font-semibold text-slate-400">180°</span>
        </div>

        {/* Quick Steppers: -1° and +1° for precision */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            onClick={() => onAngleChange(Math.max(0, angleDeg - 1))}
            className="px-2 py-1 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            title="Giảm 1°"
          >
            -1°
          </button>
          <button
            onClick={() => onAngleChange(Math.min(180, angleDeg + 1))}
            className="px-2 py-1 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            title="Tăng 1°"
          >
            +1°
          </button>
        </div>
      </div>

      {/* 2. Controls & Modes */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{mode === 'supplementary_angles' ? 'Quét hai góc bù nhau' : 'Cho M chuyển động'}</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Đặt lại về 0°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>

          {/* Guide Mode Toggle (for single angle) */}
          {mode === 'single_angle' && (
            <button
              onClick={onToggleGuide}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isGuiding
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{isGuiding ? 'Đang hiện mối liên hệ' : 'Hiện mối liên hệ'}</span>
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1 hidden sm:inline">
            {mode === 'supplementary_angles' ? 'Cặp góc bù nhau:' : 'Góc đặc biệt:'}
          </span>
          {mode === 'supplementary_angles'
            ? SUPPLEMENTARY_PAIRS.map((pair) => {
                const isActive = Math.abs(angleDeg - pair.a) < 0.5 || Math.abs(angleDeg - pair.b) < 0.5;
                return (
                  <button
                    key={`${pair.a}-${pair.b}`}
                    onClick={() => onAngleChange(pair.a)}
                    className={`px-2 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {pair.a}° & {pair.b}°
                  </button>
                );
              })
            : PRESET_ANGLES.map((deg) => {
                const isActive = Math.abs(angleDeg - deg) < 0.5;
                return (
                  <button
                    key={deg}
                    onClick={() => onAngleChange(deg)}
                    className={`px-2 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {deg}°
                  </button>
                );
              })}
        </div>
      </div>

      {/* 3. Step-by-step Guided Tour strip if guide is active */}
      {isGuiding && mode === 'single_angle' && (
        <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-900">Bước hướng dẫn:</span>
            <span className="text-purple-800">
              {guideStep === 'point_m' && '1. Điểm M(x₀ ; y₀) nằm trên nửa đường tròn đơn vị sao cho xOM = α'}
              {guideStep === 'proj_ox' && '2. Chiếu vuông góc từ M xuống trục Ox'}
              {guideStep === 'coord_x0' && '3. Xác định hoành độ x₀ tại chân đường chiếu'}
              {guideStep === 'cos_relation' && '4. Định nghĩa giá trị lượng giác: cos α = x₀'}
              {guideStep === 'proj_oy' && '5. Chiếu vuông góc từ M sang trục Oy'}
              {guideStep === 'coord_y0' && '6. Xác định tung độ y₀ tại chân đường chiếu'}
              {guideStep === 'sin_relation' && '7. Định nghĩa giá trị lượng giác: sin α = y₀'}
              {guideStep === 'idle' && 'Khám phá tự do mối liên hệ!'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNextGuideStep}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-xs transition-colors"
            >
              {guideStep === 'sin_relation' ? 'Hoàn tất' : 'Bước tiếp ▶'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
