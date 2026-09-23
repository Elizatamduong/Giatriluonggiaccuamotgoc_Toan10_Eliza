import React from 'react';
import { TrigValues, GuideStep } from '../types';
import { formatNumber } from '../utils/math';

interface ValuesPanelProps {
  trigValues: TrigValues;
  guideStep: GuideStep;
}

export const ValuesPanel: React.FC<ValuesPanelProps> = ({ trigValues, guideStep }) => {
  const {
    angleDeg,
    x0,
    y0,
    tan,
    cot,
    isTanDefined,
    isCotDefined,
    exactCos,
    exactSin,
    exactTan,
    exactCot,
    angleClassification,
  } = trigValues;

  const isCosHighlighted = guideStep === 'cos_relation' || guideStep === 'coord_x0';
  const isSinHighlighted = guideStep === 'sin_relation' || guideStep === 'coord_y0';

  return (
    <div className="flex flex-col gap-3.5 h-full">
      {/* 1. SECTION: GÓC */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
        <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
          GÓC LƯỢNG GIÁC
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif italic text-lg text-slate-700">α =</span>
            <span className="text-2xl font-bold font-mono tracking-tight text-purple-700 tabular-nums">
              {angleDeg.toFixed(1)}°
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            (tạo bởi tia <span className="font-semibold text-slate-700">Ox</span> và <span className="font-semibold text-slate-700">OM</span>)
          </span>
        </div>
      </div>

      {/* 2. SECTION: TỌA ĐỘ ĐIỂM M */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
        <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
          TỌA ĐỘ ĐIỂM M TRÊN NỬA ĐƯỜNG TRÒN
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold font-mono text-slate-800 tracking-tight">
            M(
            <span className={`tabular-nums ${x0 < 0 ? 'text-blue-700 bg-blue-50 px-1 rounded' : 'text-blue-600'}`}>
              {x0.toFixed(3)}
            </span>
            {' ; '}
            <span className="text-emerald-600 tabular-nums">
              {y0.toFixed(3)}
            </span>
            )
          </div>
          <div className="text-right text-xs">
            <div className="text-blue-600 font-medium">Hoành độ: <span className="font-mono font-bold">{x0.toFixed(3)}</span></div>
            <div className="text-emerald-600 font-medium">Tung độ: <span className="font-mono font-bold">{y0.toFixed(3)}</span></div>
          </div>
        </div>
      </div>

      {/* 3. SECTION: GIÁ TRỊ LƯỢNG GIÁC */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              GIÁ TRỊ LƯỢNG GIÁC CỦA GÓC α
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Định nghĩa theo tọa độ M(x₀ ; y₀)
            </div>
          </div>

          <div className="space-y-2.5">
            {/* cos α = x0 */}
            <div
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isCosHighlighted
                  ? 'bg-blue-100/90 border-blue-400 ring-2 ring-blue-300 shadow-sm'
                  : 'bg-blue-50/70 border-blue-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="font-serif font-semibold text-slate-800 text-sm">
                    cos α = x₀
                  </span>
                </div>
                <div className="text-right font-mono font-bold text-blue-900 text-base tabular-nums">
                  {exactCos ? (
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded">
                        {exactCos}
                      </span>
                      <span>≈ {formatNumber(x0)}</span>
                    </span>
                  ) : (
                    <span>= {formatNumber(x0)}</span>
                  )}
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-blue-700/80">
                <span>Hoành độ điểm M</span>
                <span className="font-medium">
                  {x0 > 0 ? 'x₀ > 0 (dương)' : x0 < 0 ? 'x₀ < 0 (âm)' : 'x₀ = 0'}
                </span>
              </div>
            </div>

            {/* sin α = y0 */}
            <div
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isSinHighlighted
                  ? 'bg-emerald-100/90 border-emerald-400 ring-2 ring-emerald-300 shadow-sm'
                  : 'bg-emerald-50/70 border-emerald-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="font-serif font-semibold text-slate-800 text-sm">
                    sin α = y₀
                  </span>
                </div>
                <div className="text-right font-mono font-bold text-emerald-900 text-base tabular-nums">
                  {exactSin ? (
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold px-1.5 py-0.5 bg-emerald-200 text-emerald-800 rounded">
                        {exactSin}
                      </span>
                      <span>≈ {formatNumber(y0)}</span>
                    </span>
                  ) : (
                    <span>= {formatNumber(y0)}</span>
                  )}
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-700/80">
                <span>Tung độ điểm M</span>
                <span className="font-medium">
                  {y0 > 0 ? 'y₀ > 0 (luôn không âm với 0° ≤ α ≤ 180°)' : 'y₀ = 0 (tại 0° & 180°)'}
                </span>
              </div>
            </div>

            {/* tan α = y0 / x0 */}
            <div className="p-3 rounded-xl border bg-amber-50/60 border-amber-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="font-serif font-semibold text-slate-800 text-sm">
                    tan α = y₀ / x₀
                  </span>
                </div>
                <div className="text-right font-mono font-bold text-amber-950 text-base tabular-nums">
                  {isTanDefined ? (
                    exactTan ? (
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded">
                          {exactTan}
                        </span>
                        <span>≈ {formatNumber(tan)}</span>
                      </span>
                    ) : (
                      <span>= {formatNumber(tan)}</span>
                    )
                  ) : (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      không xác định
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-1 text-[11px] text-amber-800/80 flex justify-between">
                <span>(khi x₀ ≠ 0)</span>
                {!isTanDefined && (
                  <span className="text-rose-600 font-medium">Do x₀ = 0 tại α = 90°</span>
                )}
              </div>
            </div>

            {/* cot α = x0 / y0 */}
            <div className="p-3 rounded-xl border bg-purple-50/60 border-purple-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span className="font-serif font-semibold text-slate-800 text-sm">
                    cot α = x₀ / y₀
                  </span>
                </div>
                <div className="text-right font-mono font-bold text-purple-950 text-base tabular-nums">
                  {isCotDefined ? (
                    exactCot ? (
                      <span className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">
                          {exactCot}
                        </span>
                        <span>≈ {formatNumber(cot)}</span>
                      </span>
                    ) : (
                      <span>= {formatNumber(cot)}</span>
                    )
                  ) : (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      không xác định
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-1 text-[11px] text-purple-800/80 flex justify-between">
                <span>(khi y₀ ≠ 0)</span>
                {!isCotDefined && (
                  <span className="text-rose-600 font-medium">Do y₀ = 0 tại α = 0° hoặc 180°</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Causal insight summary footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/80 -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="text-indigo-600 font-bold">💡 Nhận xét then chốt:</span>
          </div>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
            {angleClassification === 'acute' && (
              <span>
                Khi <strong>0° &lt; α &lt; 90°</strong> (góc nhọn): Điểm M nằm bên phải trục Oy nên <strong className="text-blue-700">cos α = x₀ &gt; 0</strong> và <strong className="text-emerald-700">sin α = y₀ &gt; 0</strong>.
              </span>
            )}
            {angleClassification === 'right' && (
              <span>
                Tại <strong>α = 90°</strong>: M nằm ngay trên trục Oy tại <strong className="text-slate-800">(0; 1)</strong>, suy ra <strong className="text-blue-700">cos 90° = 0</strong>, <strong className="text-emerald-700">sin 90° = 1</strong> và <strong>tan 90° không xác định</strong>.
              </span>
            )}
            {angleClassification === 'obtuse' && (
              <span>
                Khi <strong>90° &lt; α &lt; 180°</strong> (góc tù): Điểm M di chuyển sang bên trái trục Oy nên hoành độ âm: <strong className="text-blue-700">cos α = x₀ &lt; 0</strong>, còn tung độ vẫn dương: <strong className="text-emerald-700">sin α = y₀ &gt; 0</strong>!
              </span>
            )}
            {angleClassification === 'zero' && (
              <span>
                Tại <strong>α = 0°</strong>: M trùng (1; 0), <strong className="text-blue-700">cos 0° = 1</strong>, <strong className="text-emerald-700">sin 0° = 0</strong>, <strong>cot 0° không xác định</strong>.
              </span>
            )}
            {angleClassification === 'straight' && (
              <span>
                Tại <strong>α = 180°</strong>: M trùng (-1; 0), <strong className="text-blue-700">cos 180° = -1</strong>, <strong className="text-emerald-700">sin 180° = 0</strong>, <strong>cot 180° không xác định</strong>.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
