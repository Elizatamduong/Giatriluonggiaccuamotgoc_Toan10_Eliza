import { TrigValues, SpecialAngle } from '../types';

export const SPECIAL_ANGLES: Record<number, SpecialAngle> = {
  0: {
    deg: 0,
    label: '0°',
    cosExact: '1',
    sinExact: '0',
    tanExact: '0',
    cotExact: 'không xác định',
  },
  30: {
    deg: 30,
    label: '30°',
    cosExact: '√3/2',
    sinExact: '1/2',
    tanExact: '√3/3',
    cotExact: '√3',
  },
  45: {
    deg: 45,
    label: '45°',
    cosExact: '√2/2',
    sinExact: '√2/2',
    tanExact: '1',
    cotExact: '1',
  },
  60: {
    deg: 60,
    label: '60°',
    cosExact: '1/2',
    sinExact: '√3/2',
    tanExact: '√3',
    cotExact: '√3/3',
  },
  90: {
    deg: 90,
    label: '90°',
    cosExact: '0',
    sinExact: '1',
    tanExact: 'không xác định',
    cotExact: '0',
  },
  120: {
    deg: 120,
    label: '120°',
    cosExact: '-1/2',
    sinExact: '√3/2',
    tanExact: '-√3',
    cotExact: '-√3/3',
  },
  135: {
    deg: 135,
    label: '135°',
    cosExact: '-√2/2',
    sinExact: '√2/2',
    tanExact: '-1',
    cotExact: '-1',
  },
  150: {
    deg: 150,
    label: '150°',
    cosExact: '-√3/2',
    sinExact: '1/2',
    tanExact: '-√3/3',
    cotExact: '-√3',
  },
  180: {
    deg: 180,
    label: '180°',
    cosExact: '-1',
    sinExact: '0',
    tanExact: '0',
    cotExact: 'không xác định',
  },
};

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function computeTrigValues(rawDeg: number): TrigValues {
  // Constrain strictly between 0 and 180
  const angleDeg = Math.min(180, Math.max(0, Math.round(rawDeg * 10) / 10));
  const angleRad = degToRad(angleDeg);

  let x0: number;
  let y0: number;

  // Handle exact boundary points to eliminate floating point errors
  if (Math.abs(angleDeg - 0) < 1e-4) {
    x0 = 1;
    y0 = 0;
  } else if (Math.abs(angleDeg - 90) < 1e-4) {
    x0 = 0;
    y0 = 1;
  } else if (Math.abs(angleDeg - 180) < 1e-4) {
    x0 = -1;
    y0 = 0;
  } else {
    x0 = Math.cos(angleRad);
    y0 = Math.sin(angleRad);
  }

  // Round coordinates to 4 decimal places for clean UI calculations
  const x0Clean = Math.round(x0 * 10000) / 10000;
  const y0Clean = Math.round(y0 * 10000) / 10000;

  // Determine whether tan and cot are defined
  const isTanDefined = Math.abs(x0) > 1e-4; // x0 != 0 (alpha != 90°)
  const isCotDefined = Math.abs(y0) > 1e-4; // y0 != 0 (alpha != 0° and alpha != 180°)

  const tanVal = isTanDefined ? y0 / x0 : null;
  const cotVal = isCotDefined ? x0 / y0 : null;

  // Classification
  let angleClassification: TrigValues['angleClassification'] = 'acute';
  if (Math.abs(angleDeg - 0) < 1e-4) {
    angleClassification = 'zero';
  } else if (angleDeg < 90) {
    angleClassification = 'acute';
  } else if (Math.abs(angleDeg - 90) < 1e-4) {
    angleClassification = 'right';
  } else if (angleDeg < 180) {
    angleClassification = 'obtuse';
  } else {
    angleClassification = 'straight';
  }

  // Exact matching for special angles if integer
  const roundedIntDeg = Math.round(angleDeg);
  const isExactInt = Math.abs(angleDeg - roundedIntDeg) < 0.01;
  const special = isExactInt && SPECIAL_ANGLES[roundedIntDeg] ? SPECIAL_ANGLES[roundedIntDeg] : undefined;

  return {
    angleDeg,
    angleRad,
    x0: x0Clean,
    y0: y0Clean,
    tan: tanVal !== null ? Math.round(tanVal * 10000) / 10000 : null,
    cot: cotVal !== null ? Math.round(cotVal * 10000) / 10000 : null,
    isTanDefined,
    isCotDefined,
    exactCos: special?.cosExact,
    exactSin: special?.sinExact,
    exactTan: special?.tanExact,
    exactCot: special?.cotExact,
    angleClassification,
  };
}

export function formatNumber(val: number | null, decimals: number = 3): string {
  if (val === null) return 'không xác định';
  if (Object.is(val, -0) || Math.abs(val) < 1e-5) return '0';
  return val.toFixed(decimals).replace(/\.?0+$/, '');
}
