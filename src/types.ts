export type AppMode = 'single_angle' | 'supplementary_angles';

export interface TrigValues {
  angleDeg: number;
  angleRad: number;
  x0: number; // cos(alpha)
  y0: number; // sin(alpha)
  tan: number | null; // null if undefined
  cot: number | null; // null if undefined
  isTanDefined: boolean;
  isCotDefined: boolean;
  exactCos?: string;
  exactSin?: string;
  exactTan?: string;
  exactCot?: string;
  angleClassification: 'zero' | 'acute' | 'right' | 'obtuse' | 'straight';
}

export interface SupplementaryPair {
  alpha: TrigValues;
  supp: TrigValues; // 180 - alpha
  isSymmetric: boolean;
}

export interface SpecialAngle {
  deg: number;
  label: string;
  cosExact: string;
  sinExact: string;
  tanExact: string;
  cotExact: string;
}

export type GuideStep = 
  | 'idle'
  | 'point_m'
  | 'proj_ox'
  | 'coord_x0'
  | 'cos_relation'
  | 'proj_oy'
  | 'coord_y0'
  | 'sin_relation';

export interface ObservationQuestion {
  id: number;
  question: string;
  targetAngle?: number;
  hint: string;
  explanation: string;
}
