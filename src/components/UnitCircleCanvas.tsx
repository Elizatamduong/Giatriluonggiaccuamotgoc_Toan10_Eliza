import React, { useRef, useState, useCallback, useId } from 'react';
import { TrigValues, GuideStep, AppMode } from '../types';

interface UnitCircleCanvasProps {
  trigValues: TrigValues;
  suppValues?: TrigValues;
  mode?: AppMode;
  onAngleChange: (angleDeg: number) => void;
  guideStep: GuideStep;
}

export const UnitCircleCanvas: React.FC<UnitCircleCanvasProps> = ({
  trigValues,
  suppValues,
  mode = 'single_angle',
  onAngleChange,
  guideStep,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringM, setIsHoveringM] = useState(false);
  const [isHoveringM2, setIsHoveringM2] = useState(false);
  const gradientId = useId();

  // SVG Geometry Dimensions
  const svgWidth = 640;
  const svgHeight = 440;
  const cx = 320; // Center O X in SVG coordinates
  const cy = 350; // Center O Y in SVG coordinates
  const R = 230;  // Unit radius 1 = 230 pixels

  const { angleDeg, angleRad, x0, y0, angleClassification } = trigValues;

  // Point M coordinates on SVG canvas
  const mx = cx + x0 * R;
  const my = cy - y0 * R;

  // Supplementary Point M' coordinates on SVG canvas
  const m2x = cx - x0 * R;
  const m2y = cy - y0 * R; // Exactly same y!
  const suppAngleDeg = 180 - angleDeg;
  const suppAngleRad = ((180 - angleDeg) * Math.PI) / 180;

  // Foot of perpendicular on Ox: (mx, cy)
  const projOxX = mx;
  const projOxY = cy;

  // Foot of perpendicular for M' on Ox: (m2x, cy)
  const projOx2X = m2x;
  const projOx2Y = cy;

  // Foot of perpendicular on Oy: (cx, my) - SAME for both M and M'!
  const projOyX = cx;
  const projOyY = my;

  // Angle calculation from pointer
  const handlePointerCoord = useCallback(
    (clientX: number, clientY: number, isSuppHandle: boolean = false) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = svgWidth / rect.width;
      const scaleY = svgHeight / rect.height;

      const px = (clientX - rect.left) * scaleX;
      const py = (clientY - rect.top) * scaleY;

      const dx = px - cx;
      const dy = cy - py; // Math Y points up, SVG Y points down

      let rad = Math.atan2(dy, dx);
      if (rad < 0) {
        rad = dx >= 0 ? 0 : Math.PI;
      }

      let deg = (rad * 180) / Math.PI;
      deg = Math.max(0, Math.min(180, deg));

      if (isSuppHandle) {
        // If dragged via M', convert to corresponding alpha
        deg = 180 - deg;
      }

      onAngleChange(deg);
    },
    [cx, cy, onAngleChange, svgWidth, svgHeight]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGGElement | SVGSVGElement>, isSupp: boolean = false) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    handlePointerCoord(e.clientX, e.clientY, isSupp);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handlePointerCoord(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    }
  };

  // Angle Arc 1 (Alpha)
  const arcR = 46;
  const arcEndX = cx + arcR * Math.cos(angleRad);
  const arcEndY = cy - arcR * Math.sin(angleRad);
  const arcPath =
    angleDeg > 0.5
      ? `M ${cx} ${cy} L ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY} Z`
      : '';

  // Label position for angle alpha
  const midAngleRad = angleRad / 2;
  const labelR = arcR + 24;
  const labelX = cx + labelR * Math.cos(midAngleRad);
  const labelY = cy - labelR * Math.sin(midAngleRad);

  // Angle Arc 2 (180 - Alpha) in Supplementary Mode
  const arc2R = 64;
  const arc2EndX = cx + arc2R * Math.cos(suppAngleRad);
  const arc2EndY = cy - arc2R * Math.sin(suppAngleRad);
  const arc2Path =
    suppAngleDeg > 0.5
      ? `M ${cx} ${cy} L ${cx + arc2R} ${cy} A ${arc2R} ${arc2R} 0 0 0 ${arc2EndX} ${arc2EndY} Z`
      : '';
  const midAngle2Rad = suppAngleRad / 2;
  const label2R = arc2R + 24;
  const label2X = cx + label2R * Math.cos(midAngle2Rad);
  const label2Y = cy - label2R * Math.sin(midAngle2Rad);

  // Check special moments
  const isNear90 = Math.abs(angleDeg - 90) < 1.5;
  const isNear0 = angleDeg < 1.5;
  const isNear180 = angleDeg > 178.5;

  // Step highlight states
  const hlM = guideStep === 'point_m';
  const hlProjOx = guideStep === 'proj_ox' || guideStep === 'coord_x0' || guideStep === 'cos_relation';
  const hlCoordX0 = guideStep === 'coord_x0' || guideStep === 'cos_relation';
  const hlProjOy = guideStep === 'proj_oy' || guideStep === 'coord_y0' || guideStep === 'sin_relation';
  const hlCoordY0 = guideStep === 'coord_y0' || guideStep === 'sin_relation';

  return (
    <div className="relative w-full select-none flex flex-col items-center">
      {/* Visual Header / Quick Notice */}
      <div className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-500 border-b border-slate-100 bg-white/70 backdrop-blur-xs rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${mode === 'supplementary_angles' ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500 animate-pulse'}`} />
          <span className="font-medium text-slate-700">
            {mode === 'supplementary_angles'
              ? 'Minh họa hai góc bù nhau: α và 180° - α (đối xứng qua trục Oy)'
              : 'Mặt phẳng tọa độ Oxy · Nửa đường tròn đơn vị (R = 1)'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">Kéo M để thay đổi góc</span>
          {mode === 'supplementary_angles' ? (
            <span className="font-semibold px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-300">
              Tổng hai góc = 180°
            </span>
          ) : (
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                angleClassification === 'acute'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : angleClassification === 'right'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                  : angleClassification === 'obtuse'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {angleClassification === 'zero'
                ? 'α = 0° (M trùng (1; 0))'
                : angleClassification === 'acute'
                ? 'Góc nhọn (0° < α < 90°)'
                : angleClassification === 'right'
                ? 'Góc vuông (α = 90°)'
                : angleClassification === 'obtuse'
                ? 'Góc tù (90° < α < 180°)'
                : 'Góc bẹt (α = 180°)'}
            </span>
          )}
        </div>
      </div>

      {/* SVG Stage */}
      <div className="relative w-full aspect-[16/11] max-h-[520px] flex items-center justify-center p-2 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/80 rounded-b-2xl overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full touch-none cursor-crosshair drop-shadow-xs"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            {/* Semicircle Gradient */}
            <radialGradient id={`${gradientId}-semi`} cx="50%" cy="100%" r="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </radialGradient>

            {/* M point glow filter */}
            <filter id={`${gradientId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle grid pattern */}
            <pattern id={`${gradientId}-grid`} width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M 46 0 L 0 0 0 46" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>

            {/* Arrowhead marker for axes */}
            <marker
              id={`${gradientId}-arrow`}
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Grid lines in background */}
          <rect x="20" y="20" width={svgWidth - 40} height={svgHeight - 40} fill={`url(#${gradientId}-grid)`} />

          {/* Coordinate Axes */}
          {/* Subtle tick marks for 0.5 */}
          <line x1={cx + 0.5 * R} y1={cy - 4} x2={cx + 0.5 * R} y2={cy + 4} stroke="#cbd5e1" strokeWidth="1.5" />
          <text x={cx + 0.5 * R} y={cy + 18} textAnchor="middle" className="text-[11px] fill-slate-400 font-mono">0.5</text>

          <line x1={cx - 0.5 * R} y1={cy - 4} x2={cx - 0.5 * R} y2={cy + 4} stroke="#cbd5e1" strokeWidth="1.5" />
          <text x={cx - 0.5 * R} y={cy + 18} textAnchor="middle" className="text-[11px] fill-slate-400 font-mono">-0.5</text>

          <line x1={cx - 4} y1={cy - 0.5 * R} x2={cx + 4} y2={cy - 0.5 * R} stroke="#cbd5e1" strokeWidth="1.5" />
          <text x={cx - 14} y={cy - 0.5 * R + 4} textAnchor="end" className="text-[11px] fill-slate-400 font-mono">0.5</text>

          {/* Trục Ox */}
          <line
            x1="40"
            y1={cy}
            x2={svgWidth - 30}
            y2={cy}
            stroke="#64748b"
            strokeWidth="1.75"
            markerEnd={`url(#${gradientId}-arrow)`}
          />
          <text x={svgWidth - 20} y={cy + 5} className="font-semibold text-sm fill-slate-700 italic">
            x
          </text>

          {/* Trục Oy */}
          <line
            x1={cx}
            y1={cy + 45}
            x2={cx}
            y2="30"
            stroke={isNear90 || mode === 'supplementary_angles' ? '#4f46e5' : '#64748b'}
            strokeWidth={isNear90 || mode === 'supplementary_angles' ? '2.5' : '1.75'}
            markerEnd={`url(#${gradientId}-arrow)`}
            className="transition-colors duration-300"
          />
          <text x={cx + 12} y="32" className="font-semibold text-sm fill-slate-700 italic">
            y
          </text>

          {/* Semicircle Fill & Stroke */}
          <path
            d={`M ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${cx - R} ${cy} Z`}
            fill={`url(#${gradientId}-semi)`}
            className="pointer-events-none"
          />
          <path
            d={`M ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${cx - R} ${cy}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="drop-shadow-xs"
          />

          {/* Key Reference Points: O, 1, -1 on Ox and 1 on Oy */}
          <circle cx={cx} cy={cy} r="3.5" fill="#475569" />
          <text x={cx - 12} y={cy + 18} className="text-xs font-semibold fill-slate-600 font-sans">
            O
          </text>

          <line x1={cx + R} y1={cy - 5} x2={cx + R} y2={cy + 5} stroke="#475569" strokeWidth="2" />
          <circle cx={cx + R} cy={cy} r="3" fill="#475569" />
          <text x={cx + R} y={cy + 22} textAnchor="middle" className="text-xs font-bold fill-slate-800 font-mono">
            1
          </text>

          <line x1={cx - R} y1={cy - 5} x2={cx - R} y2={cy + 5} stroke="#475569" strokeWidth="2" />
          <circle cx={cx - R} cy={cy} r="3" fill="#475569" />
          <text x={cx - R} y={cy + 22} textAnchor="middle" className="text-xs font-bold fill-slate-800 font-mono">
            -1
          </text>

          <line x1={cx - 5} y1={cy - R} x2={cx + 5} y2={cy - R} stroke="#475569" strokeWidth="2" />
          <circle cx={cx} cy={cy - R} r="3" fill="#475569" />
          <text x={cx - 16} y={cy - R + 4} textAnchor="end" className="text-xs font-bold fill-slate-800 font-mono">
            1
          </text>

          {/* SUPPLEMENTARY MODE: SYMMETRY LINE MM' */}
          {mode === 'supplementary_angles' && Math.abs(x0) > 0.02 && (
            <>
              {/* Line MM' connecting M and M' horizontally */}
              <line
                x1={mx}
                y1={my}
                x2={m2x}
                y2={m2y}
                stroke="#d97706"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                className="transition-all duration-150"
              />
              {/* Midpoint on Oy */}
              <circle cx={cx} cy={my} r="3" fill="#d97706" />
              {/* Perpendicular marker at Oy intersection */}
              <path
                d={`M ${cx + 10} ${my} L ${cx + 10} ${my + 10} L ${cx} ${my + 10}`}
                fill="none"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              {/* Symmetry label */}
              {my < cy - 25 && (
                <text
                  x={cx + 8}
                  y={my - 6}
                  className="text-[10px] font-bold fill-amber-700 font-sans"
                >
                  Trục đối xứng
                </text>
              )}
            </>
          )}

          {/* Projection Line M to Ox: dashed perpendicular */}
          <line
            x1={mx}
            y1={my}
            x2={projOxX}
            y2={projOxY}
            stroke="#2563eb"
            strokeWidth={hlProjOx ? '3' : '2'}
            strokeDasharray="4 3"
            strokeOpacity={hlProjOx ? '1' : '0.75'}
            className="transition-all duration-200"
          />

          {/* In Supplementary Mode: Projection Line M' to Ox */}
          {mode === 'supplementary_angles' && (
            <line
              x1={m2x}
              y1={m2y}
              x2={projOx2X}
              y2={projOx2Y}
              stroke="#ea580c"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeOpacity="0.75"
              className="transition-all duration-200"
            />
          )}

          {/* Projection Line to Oy: dashed parallel to Ox (common for both M and M') */}
          <line
            x1={mx}
            y1={my}
            x2={projOyX}
            y2={projOyY}
            stroke="#059669"
            strokeWidth={hlProjOy ? '3' : '2'}
            strokeDasharray="4 3"
            strokeOpacity={hlProjOy ? '1' : '0.75'}
            className="transition-all duration-200"
          />

          {/* Right Angle Markers */}
          {Math.abs(y0) > 0.08 && Math.abs(x0) > 0.08 && (
            <>
              <path
                d={
                  x0 >= 0
                    ? `M ${projOxX} ${projOxY - 12} L ${projOxX - 12} ${projOxY - 12} L ${projOxX - 12} ${projOxY}`
                    : `M ${projOxX} ${projOxY - 12} L ${projOxX + 12} ${projOxY - 12} L ${projOxX + 12} ${projOxY}`
                }
                fill="none"
                stroke="#93c5fd"
                strokeWidth="1.5"
              />
              {mode === 'supplementary_angles' && (
                <path
                  d={
                    x0 >= 0
                      ? `M ${projOx2X} ${projOx2Y - 12} L ${projOx2X + 12} ${projOx2Y - 12} L ${projOx2X + 12} ${projOx2Y}`
                      : `M ${projOx2X} ${projOx2Y - 12} L ${projOx2X - 12} ${projOx2Y - 12} L ${projOx2X - 12} ${projOx2Y}`
                  }
                  fill="none"
                  stroke="#fdba74"
                  strokeWidth="1.5"
                />
              )}
            </>
          )}

          {/* Highlighted Vector on Ox for x0 = cos(alpha) */}
          <line
            x1={cx}
            y1={cy}
            x2={projOxX}
            y2={cy}
            stroke={x0 < 0 ? '#1d4ed8' : '#2563eb'}
            strokeWidth={hlCoordX0 ? '6' : '4.5'}
            strokeLinecap="round"
            className="transition-all duration-200"
          />

          {/* In Supplementary Mode: Highlighted Vector on Ox for -x0 = cos(180 - alpha) */}
          {mode === 'supplementary_angles' && (
            <line
              x1={cx}
              y1={cy}
              x2={projOx2X}
              y2={cy}
              stroke="#ea580c"
              strokeWidth="4.5"
              strokeLinecap="round"
              className="transition-all duration-200"
            />
          )}

          {/* Highlighted Vector on Oy for y0 = sin(alpha) */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={projOyY}
            stroke="#059669"
            strokeWidth={hlCoordY0 ? '6' : '4.5'}
            strokeLinecap="round"
            className="transition-all duration-200"
          />

          {/* Foot on Ox for M */}
          <g className="cursor-default">
            <circle
              cx={projOxX}
              cy={cy}
              r={hlCoordX0 ? '6' : '4.5'}
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <g
              transform={`translate(${projOxX}, ${cy + 24})`}
              className={`transition-all duration-200 ${hlCoordX0 ? 'scale-110 font-bold' : ''}`}
            >
              <rect
                x="-40"
                y="-14"
                width="80"
                height="22"
                rx="6"
                fill="#eff6ff"
                stroke="#93c5fd"
                strokeWidth="1"
                className="drop-shadow-xs"
              />
              <text
                x="0"
                y="1"
                textAnchor="middle"
                className="text-[11px] font-bold fill-blue-700 font-sans"
              >
                x₀ = cos α
              </text>
            </g>
          </g>

          {/* In Supplementary Mode: Foot on Ox for M' */}
          {mode === 'supplementary_angles' && Math.abs(x0) > 0.05 && (
            <g className="cursor-default">
              <circle
                cx={projOx2X}
                cy={cy}
                r="4.5"
                fill="#ea580c"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <g transform={`translate(${projOx2X}, ${cy + 24})`}>
                <rect
                  x="-48"
                  y="-14"
                  width="96"
                  height="22"
                  rx="6"
                  fill="#fff7ed"
                  stroke="#fdba74"
                  strokeWidth="1"
                  className="drop-shadow-xs"
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-amber-800 font-sans"
                >
                  -x₀ = cos(180°-α)
                </text>
              </g>
            </g>
          )}

          {/* Common Foot on Oy for sin(alpha) */}
          <g className="cursor-default">
            <circle
              cx={cx}
              cy={projOyY}
              r={hlCoordY0 ? '6' : '4.5'}
              fill="#059669"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <g
              transform={`translate(${cx + (x0 < 0 && mode === 'single_angle' ? 46 : -46)}, ${projOyY})`}
              className={`transition-all duration-200 ${hlCoordY0 ? 'scale-110 font-bold' : ''}`}
            >
              <rect
                x="-40"
                y="-11"
                width="80"
                height="22"
                rx="6"
                fill="#ecfdf5"
                stroke="#a7f3d0"
                strokeWidth="1"
                className="drop-shadow-xs"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                className="text-[11px] font-bold fill-emerald-700 font-sans"
              >
                y₀ = sin α
              </text>
            </g>
          </g>

          {/* Angle Arc 1 (Alpha) */}
          {arcPath && (
            <path
              d={arcPath}
              fill="rgba(124, 58, 237, 0.14)"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}

          {/* In Supplementary Mode: Angle Arc 2 (180° - Alpha) */}
          {mode === 'supplementary_angles' && arc2Path && (
            <path
              d={arc2Path}
              fill="none"
              stroke="#ea580c"
              strokeWidth="2"
              strokeDasharray="4 2"
              strokeLinejoin="round"
            />
          )}

          {/* Angle label α = ...° */}
          {angleDeg > 10 && (
            <g transform={`translate(${labelX}, ${labelY})`}>
              <rect
                x="-26"
                y="-11"
                width="52"
                height="20"
                rx="5"
                fill="#ffffff"
                stroke="#c4b5fd"
                strokeWidth="1"
                className="drop-shadow-xs"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                className="text-[11px] font-bold fill-purple-800 font-sans"
              >
                α = {Math.round(angleDeg)}°
              </text>
            </g>
          )}

          {/* In Supplementary Mode: Angle label 180° - α */}
          {mode === 'supplementary_angles' && suppAngleDeg > 15 && Math.abs(angleDeg - 90) > 10 && (
            <g transform={`translate(${label2X}, ${label2Y})`}>
              <rect
                x="-36"
                y="-11"
                width="72"
                height="20"
                rx="5"
                fill="#fff7ed"
                stroke="#fdba74"
                strokeWidth="1"
                className="drop-shadow-xs"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                className="text-[10px] font-bold fill-amber-900 font-sans"
              >
                180°-α = {Math.round(suppAngleDeg)}°
              </text>
            </g>
          )}

          {/* Segment OM */}
          <line
            x1={cx}
            y1={cy}
            x2={mx}
            y2={my}
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* In Supplementary Mode: Segment OM' */}
          {mode === 'supplementary_angles' && (
            <line
              x1={cx}
              y1={cy}
              x2={m2x}
              y2={m2y}
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Special Angle Indicator at 90 deg */}
          {isNear90 && (
            <circle
              cx={cx}
              cy={cy - R}
              r="22"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeOpacity="0.4"
              className="animate-ping"
            />
          )}

          {/* In Supplementary Mode: Point M' (180° - alpha) */}
          {mode === 'supplementary_angles' && (
            <g
              className="cursor-grab active:cursor-grabbing transition-transform"
              onPointerDown={(e) => handlePointerDown(e, true)}
              onMouseEnter={() => setIsHoveringM2(true)}
              onMouseLeave={() => setIsHoveringM2(false)}
            >
              <circle cx={m2x} cy={m2y} r="32" fill="transparent" />

              {(isHoveringM2 || isDragging) && (
                <circle
                  cx={m2x}
                  cy={m2y}
                  r="15"
                  fill="#fdba74"
                  fillOpacity="0.25"
                  stroke="#ea580c"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}

              <circle
                cx={m2x}
                cy={m2y}
                r="8.5"
                fill="#ffffff"
                stroke="#c2410c"
                strokeWidth="2.5"
                filter={`url(#${gradientId}-glow)`}
              />
              <circle cx={m2x} cy={m2y} r="4" fill="#ea580c" />

              {/* Dynamic Label M'(-x0; y0) */}
              <g
                transform={`translate(${
                  -x0 >= 0 ? m2x + 16 : m2x - 106
                }, ${m2y > cy - 30 ? m2y - 16 : m2y - 18})`}
                className="pointer-events-none drop-shadow-md"
              >
                <rect
                  x="0"
                  y="-13"
                  width="98"
                  height="24"
                  rx="6"
                  fill="#7c2d12"
                  fillOpacity="0.9"
                />
                <text
                  x="49"
                  y="3"
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-white font-sans tracking-wide"
                >
                  M'({(-x0).toFixed(2)} ; {y0.toFixed(2)})
                </text>
              </g>
            </g>
          )}

          {/* Point M (The main interactive handle for angle alpha) */}
          <g
            className="cursor-grab active:cursor-grabbing transition-transform"
            onPointerDown={(e) => handlePointerDown(e, false)}
            onMouseEnter={() => setIsHoveringM(true)}
            onMouseLeave={() => setIsHoveringM(false)}
          >
            <circle cx={mx} cy={my} r="32" fill="transparent" />

            {(isDragging || isHoveringM || hlM) && (
              <circle
                cx={mx}
                cy={my}
                r={hlM ? '18' : '15'}
                fill="#818cf8"
                fillOpacity="0.25"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray={hlM ? '3 2' : 'none'}
                className="animate-pulse"
              />
            )}

            <circle
              cx={mx}
              cy={my}
              r="8.5"
              fill="#ffffff"
              stroke="#4338ca"
              strokeWidth="2.5"
              filter={`url(#${gradientId}-glow)`}
            />

            <circle cx={mx} cy={my} r="4" fill="#4f46e5" />

            {/* Dynamic Label M(x0; y0) */}
            <g
              transform={`translate(${
                x0 >= 0 ? mx + 16 : mx - 96
              }, ${my > cy - 30 ? my - 16 : my - 18})`}
              className="pointer-events-none drop-shadow-md"
            >
              <rect
                x="0"
                y="-13"
                width="84"
                height="24"
                rx="6"
                fill="#0f172a"
                fillOpacity="0.9"
              />
              <text
                x="42"
                y="3"
                textAnchor="middle"
                className="text-[11px] font-semibold fill-white font-sans tracking-wide"
              >
                M({x0.toFixed(2)} ; {y0.toFixed(2)})
              </text>
            </g>
          </g>
        </svg>

        {/* Dynamic callouts */}
        {isNear90 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500/95 text-white text-xs font-semibold rounded-lg shadow-md flex items-center gap-2 animate-bounce">
            <span>★ Tại α = 90°: M trùng M'(0; 1) · cos 90° = 0 · sin 90° = 1 · tan 90° không xác định</span>
          </div>
        )}
        {isNear0 && mode === 'single_angle' && (
          <div className="absolute bottom-6 right-6 px-3 py-1 bg-slate-800/90 text-white text-xs font-medium rounded-lg shadow-sm">
            <span>Tại α = 0°: M(1; 0) · cot 0° không xác định</span>
          </div>
        )}
        {isNear180 && mode === 'single_angle' && (
          <div className="absolute bottom-6 left-6 px-3 py-1 bg-slate-800/90 text-white text-xs font-medium rounded-lg shadow-sm">
            <span>Tại α = 180°: M(-1; 0) · cot 180° không xác định</span>
          </div>
        )}
      </div>
    </div>
  );
};
