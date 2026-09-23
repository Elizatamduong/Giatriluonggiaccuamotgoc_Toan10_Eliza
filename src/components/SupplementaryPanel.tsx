import React from 'react';
import { TrigValues } from '../types';
import { formatNumber } from '../utils/math';
import { Check, ArrowLeftRight } from 'lucide-react';

interface SupplementaryPanelProps {
  alphaValues: TrigValues;
  suppValues: TrigValues;
}

export const SupplementaryPanel: React.FC<SupplementaryPanelProps> = ({
  alphaValues,
  suppValues,
}) => {
  const { angleDeg: aDeg, x0: ax0, y0: ay0, tan: aTan, cot: aCot, isTanDefined: aTanDef, isCotDefined: aCotDef } = alphaValues;
  const { angleDeg: bDeg, x0: bx0, y0: by0, tan: bTan, cot: bCot, isTanDefined: bTanDef, isCotDefined: bCotDef } = suppValues;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* 1. Header: Hai góc bù nhau */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            HAI GÓC BÙ NHAU (TỔNG = 180°)
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            α + (180° - α) = 180°
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center pt-1">
          {/* Angle alpha */}
          <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200">
            <div className="text-[11px] text-blue-700 font-semibold mb-0.5">Góc ban đầu α</div>
            <div className="text-xl font-bold font-mono text-blue-900 tabular-nums">
              {aDeg.toFixed(1)}°
            </div>
            <div className="text-[11px] font-mono text-blue-700 mt-0.5 font-medium">
              M({ax0.toFixed(2)} ; {ay0.toFixed(2)})
            </div>
          </div>

          {/* Angle 180 - alpha */}
          <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200">
            <div className="text-[11px] text-amber-800 font-semibold mb-0.5">Góc bù (180° - α)</div>
            <div className="text-xl font-bold font-mono text-amber-950 tabular-nums">
              {bDeg.toFixed(1)}°
            </div>
            <div className="text-[11px] font-mono text-amber-800 mt-0.5 font-medium">
              M'({bx0.toFixed(2)} ; {by0.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Symmetry Callout */}
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            <strong className="text-slate-800">M</strong> và <strong className="text-slate-800">M'</strong> đối xứng nhau qua trục tung <strong className="text-indigo-700">Oy</strong>
          </span>
        </div>
      </div>

      {/* 2. Formulas & Live Values Comparison */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2.5">
            CÔNG THỨC GIÁ TRỊ LƯỢNG GIÁC HAI GÓC BÙ NHAU
          </div>

          <div className="space-y-2">
            {/* 1. SIN: BẰNG NHAU */}
            <div className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    sin(180° - α) = sin α
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-800" />
                  Bằng nhau
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs font-mono font-bold text-emerald-900 tabular-nums">
                <span>sin({bDeg.toFixed(0)}°) = {formatNumber(by0)}</span>
                <span className="text-slate-400 font-sans font-normal">=</span>
                <span>sin({aDeg.toFixed(0)}°) = {formatNumber(ay0)}</span>
              </div>
              <div className="text-[10px] text-emerald-700 mt-0.5">
                Cùng bằng tung độ <span className="font-mono font-bold">y₀ = {ay0.toFixed(2)}</span>
              </div>
            </div>

            {/* 2. COS: ĐỐI NHAU */}
            <div className="p-2.5 rounded-xl border border-blue-300 bg-blue-50/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    cos(180° - α) = -cos α
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                  Đối nhau
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs font-mono font-bold text-blue-900 tabular-nums">
                <span>cos({bDeg.toFixed(0)}°) = {formatNumber(bx0)}</span>
                <span className="text-slate-400 font-sans font-normal">= -</span>
                <span>cos({aDeg.toFixed(0)}°) = -({formatNumber(ax0)})</span>
              </div>
              <div className="text-[10px] text-blue-700 mt-0.5">
                Hoành độ đối xứng qua gốc O: <span className="font-mono font-bold">x₀' = -x₀</span>
              </div>
            </div>

            {/* 3. TAN: ĐỐI NHAU */}
            <div className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    tan(180° - α) = -tan α
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Đối nhau
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs font-mono font-bold text-amber-950 tabular-nums">
                {aTanDef && bTanDef ? (
                  <>
                    <span>tan({bDeg.toFixed(0)}°) = {formatNumber(bTan)}</span>
                    <span className="text-slate-400 font-sans font-normal">= -</span>
                    <span>tan({aDeg.toFixed(0)}°) = -({formatNumber(aTan)})</span>
                  </>
                ) : (
                  <span className="text-rose-600 text-[11px] font-sans">
                    Tại 90°: tan 90° không xác định
                  </span>
                )}
              </div>
              <div className="text-[10px] text-amber-800 mt-0.5">
                (khi α ≠ 90°)
              </div>
            </div>

            {/* 4. COT: ĐỐI NHAU */}
            <div className="p-2.5 rounded-xl border border-purple-300 bg-purple-50/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="font-serif font-bold text-slate-900 text-sm">
                    cot(180° - α) = -cot α
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                  Đối nhau
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs font-mono font-bold text-purple-950 tabular-nums">
                {aCotDef && bCotDef ? (
                  <>
                    <span>cot({bDeg.toFixed(0)}°) = {formatNumber(bCot)}</span>
                    <span className="text-slate-400 font-sans font-normal">= -</span>
                    <span>cot({aDeg.toFixed(0)}°) = -({formatNumber(aCot)})</span>
                  </>
                ) : (
                  <span className="text-rose-600 text-[11px] font-sans">
                    Tại 0° và 180°: cot không xác định
                  </span>
                )}
              </div>
              <div className="text-[10px] text-purple-800 mt-0.5">
                (khi α ≠ 0° và α ≠ 180°)
              </div>
            </div>
          </div>
        </div>

        {/* Khẩu quyết ghi nhớ */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50 -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
          <div className="text-xs font-bold text-indigo-900 flex items-center gap-1">
            <span>🧠 Khẩu quyết ghi nhớ Toán 10:</span>
          </div>
          <p className="mt-1 text-xs text-slate-700 font-medium leading-relaxed">
            <strong className="text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">"Sin bù"</strong>: Hai góc bù nhau thì <strong>chỉ có sin bằng nhau</strong>, còn <strong>cos, tan, cot đều đối nhau</strong>!
          </p>
        </div>
      </div>
    </div>
  );
};
