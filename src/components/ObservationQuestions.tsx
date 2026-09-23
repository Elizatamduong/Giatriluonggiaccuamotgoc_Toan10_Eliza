import React, { useState } from 'react';
import { ObservationQuestion, AppMode } from '../types';
import { HelpCircle, ChevronRight, Eye, Lightbulb } from 'lucide-react';

interface ObservationQuestionsProps {
  onSetAngle: (angle: number) => void;
  mode?: AppMode;
}

const SINGLE_ANGLE_QUESTIONS: ObservationQuestion[] = [
  {
    id: 1,
    question: 'Điều gì xảy ra với hoành độ của M khi M đi qua vị trí α = 90°?',
    targetAngle: 90,
    hint: 'Hãy quan sát dấu và vị trí của chân đường chiếu trên trục Ox khi α < 90°, α = 90° và α > 90°.',
    explanation: 'Khi α < 90°, M ở bên phải trục Oy nên hoành độ x₀ > 0. Tại α = 90°, M nằm trên Oy nên x₀ = 0. Khi α > 90°, M sang bên trái Oy nên hoành độ đổi dấu thành âm (x₀ < 0). Vì vậy cos α chuyển từ dương sang âm!',
  },
  {
    id: 2,
    question: 'Trong khoảng từ 0° đến 180°, tung độ của M có âm không?',
    targetAngle: 45,
    hint: 'Nửa đường tròn đơn vị nằm ở phía nào của trục hoành Ox? Tung độ y₀ tương ứng với giá trị lượng giác nào?',
    explanation: 'Vì nửa đường tròn đơn vị nằm hoàn toàn phía trên trục hoành Ox (hoặc trên Ox tại 0° và 180°), nên tung độ y₀ luôn không âm (y₀ ≥ 0). Do đó, sin α luôn ≥ 0 với mọi α ∈ [0°; 180°].',
  },
  {
    id: 3,
    question: 'Khi M di chuyển sang bên trái trục Oy, giá trị cos α thay đổi như thế nào?',
    targetAngle: 120,
    hint: 'Nhớ lại định nghĩa cos α = x₀. Trục Ox phía bên trái gốc O có giá trị tọa độ mang dấu gì?',
    explanation: 'Bên trái trục Oy là phần hoành độ âm của trục Ox. Do cos α = x₀, nên khi M ở bên trái trục Oy (tức góc tù 90° < α ≤ 180°), giá trị cos α luôn mang dấu âm và giảm dần về -1 tại α = 180°.',
  },
];

const SUPPLEMENTARY_QUESTIONS: ObservationQuestion[] = [
  {
    id: 101,
    question: 'Vì sao sin của hai góc bù nhau sin(180° - α) và sin α luôn bằng nhau?',
    targetAngle: 30,
    hint: 'Hãy nhìn hình chiếu vuông góc của cả hai điểm M và M\' lên trục tung Oy. Chúng có cùng rơi vào một điểm không?',
    explanation: 'Hai điểm M và M\' đối xứng nhau qua trục tung Oy, do đó đoạn thẳng MM\' song song với trục Ox. Cả hai điểm đều có cùng một khoảng cách tới trục hoành Ox, tức là có cùng tung độ y₀. Vì sin góc được định nghĩa bằng tung độ, nên sin(180° - α) = sin α = y₀!',
  },
  {
    id: 102,
    question: 'Hoành độ của hai điểm M và M\' có quan hệ gì? Từ đó giải thích vì sao cos(180° - α) = -cos α?',
    targetAngle: 60,
    hint: 'Hình chiếu của M xuống Ox là x₀, còn hình chiếu của M\' xuống Ox là x₀\'. Hai vị trí này có vị trí đối xứng như thế nào qua gốc O?',
    explanation: 'Vì M và M\' đối xứng qua trục Oy, nên các hình chiếu của chúng trên trục Ox đối xứng nhau qua gốc tọa độ O. Tức là x₀\' = -x₀. Theo định nghĩa cos góc bằng hoành độ, ta có ngay cos(180° - α) = x₀\' = -x₀ = -cos α.',
  },
  {
    id: 103,
    question: 'Tại vị trí góc vuông α = 90°, quan hệ giữa hai góc bù nhau xảy ra điều gì đặc biệt?',
    targetAngle: 90,
    hint: 'Khi α = 90° thì 180° - α bằng bao nhiêu? Lúc đó điểm M và M\' có trùng nhau không?',
    explanation: 'Khi α = 90° thì 180° - 90° = 90°. Hai điểm M và M\' hợp nhất thành một điểm duy nhất (0; 1) trên trục Oy. Khi đó sin 90° = sin 90° = 1, cos 90° = -cos 90° = 0. Cả hai công thức đều hoàn toàn đúng và ăn khớp tuyệt đối!',
  },
];

export const ObservationQuestions: React.FC<ObservationQuestionsProps> = ({
  onSetAngle,
  mode = 'single_angle',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = mode === 'supplementary_angles' ? SUPPLEMENTARY_QUESTIONS : SINGLE_ANGLE_QUESTIONS;
  const currentQ = questions[Math.min(currentIndex, questions.length - 1)];

  const handleSelectQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setShowHint(false);
    setShowExplanation(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              {mode === 'supplementary_angles' ? 'Em hãy quan sát: Hai góc bù nhau' : 'Em hãy quan sát'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'supplementary_angles'
                ? 'Phát hiện tính chất đối xứng qua trục tung Oy'
                : 'Suy ngẫm và phát hiện quy luật từ hình học'}
            </p>
          </div>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(idx)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentIndex === idx
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Câu hỏi {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Content */}
      <div className="mt-3.5 space-y-3">
        <div className="flex items-start gap-2.5">
          <span className="font-mono font-bold text-indigo-600 text-sm mt-0.5">?</span>
          <p className="text-sm font-semibold text-slate-800 leading-snug">
            "{currentQ.question}"
          </p>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {currentQ.targetAngle !== undefined && (
            <button
              onClick={() => onSetAngle(currentQ.targetAngle!)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Chuyển góc đến α = {currentQ.targetAngle}° để quan sát</span>
            </button>
          )}

          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Ẩn gợi ý' : 'Gợi ý suy nghĩ'}</span>
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
            <span>{showExplanation ? 'Ẩn câu trả lời' : 'Xem kết luận'}</span>
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed animate-fadeIn">
            <strong>Gợi ý quan sát:</strong> {currentQ.hint}
          </div>
        )}

        {/* Explanation Box */}
        {showExplanation && (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed animate-fadeIn">
            <strong className="text-emerald-800">Kết luận hình học:</strong> {currentQ.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
