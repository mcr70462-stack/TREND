import { DataPoint } from '../types';

/**
 * Calculates Simple Linear Regression (y = mx + b)
 */
export const calculateLinearRegression = (data: DataPoint[]) => {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, rSquared: 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  // We use the index as X for time-series sequence
  data.forEach((point, i) => {
    sumX += i;
    sumY += point.value;
    sumXY += i * point.value;
    sumXX += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-Squared
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;

  data.forEach((point, i) => {
    const predicted = slope * i + intercept;
    ssTot += Math.pow(point.value - meanY, 2);
    ssRes += Math.pow(point.value - predicted, 2);
  });

  const rSquared = 1 - (ssRes / ssTot);

  return { slope, intercept, rSquared };
};

/**
 * Helper to solve 3x3 Linear System using Cramer's Rule
 * for Quadratic Regression Matrix
 */
const solve3x3 = (A: number[][], B: number[]): number[] => {
  const det = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  const D = det(A);
  if (Math.abs(D) < 1e-9) return [0, 0, 0]; // Singular matrix

  const Dx = det([[B[0], A[0][1], A[0][2]], [B[1], A[1][1], A[1][2]], [B[2], A[2][1], A[2][2]]]);
  const Dy = det([[A[0][0], B[0], A[0][2]], [A[1][0], B[1], A[1][2]], [A[2][0], B[2], A[2][2]]]);
  const Dz = det([[A[0][0], A[0][1], B[0]], [A[1][0], A[1][1], B[1]], [A[2][0], A[2][1], B[2]]]);

  return [Dx / D, Dy / D, Dz / D];
};

/**
 * Calculates Quadratic Regression (y = ax^2 + bx + c)
 * Where 'a' represents half the constant acceleration.
 */
export const calculateQuadraticRegression = (data: DataPoint[]) => {
  const n = data.length;
  if (n < 3) return { a: 0, b: 0, c: 0, rSquared: 0 };

  let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
  let sumY = 0, sumXY = 0, sumX2Y = 0;

  data.forEach((point, i) => {
    const x = i;
    const y = point.value;
    const x2 = x * x;
    
    sumX += x;
    sumX2 += x2;
    sumX3 += x2 * x;
    sumX4 += x2 * x2;
    
    sumY += y;
    sumXY += x * y;
    sumX2Y += x2 * y;
  });

  // Matrix form: M * [c, b, a]^T = B
  // Note order of coefficients solved: c (intercept), b (linear), a (quadratic)
  const M = [
    [n, sumX, sumX2],
    [sumX, sumX2, sumX3],
    [sumX2, sumX3, sumX4]
  ];
  const B = [sumY, sumXY, sumX2Y];

  const [c, b, a] = solve3x3(M, B);

  // R-Squared
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;

  data.forEach((point, i) => {
    const predicted = a * i * i + b * i + c;
    ssTot += Math.pow(point.value - meanY, 2);
    ssRes += Math.pow(point.value - predicted, 2);
  });
  
  const rSquared = 1 - (ssRes / ssTot);

  return { a, b, c, rSquared };
};

/**
 * Calculates Discrete Derivatives (Finite Differences)
 */
export const calculateDerivatives = (data: DataPoint[]) => {
  if (data.length < 3) return { processedData: data, avgAcceleration: 0 };

  const processedData = data.map((point, i) => {
    let velocity = 0;
    let acceleration = 0;

    if (i > 0) {
      velocity = point.value - data[i - 1].value;
    }

    if (i > 1) {
      const prevVelocity = data[i - 1].value - data[i - 2].value;
      acceleration = velocity - prevVelocity;
    }

    return {
      ...point,
      velocity,
      acceleration
    };
  });

  const sumAcceleration = processedData.slice(2).reduce((acc, curr) => acc + (curr.acceleration || 0), 0);
  const avgAcceleration = sumAcceleration / (processedData.length - 2);

  return { processedData, avgAcceleration };
};

export const generateProjections = (
  originalData: DataPoint[],
  linearParams: { slope: number, intercept: number },
  quadParams: { a: number, b: number, c: number },
  periods: number
): DataPoint[] => {
  const lastIndex = originalData.length;
  const projections: DataPoint[] = [];

  for (let i = 0; i < periods; i++) {
    const nextIndex = lastIndex + i;
    
    // Linear Projection
    const linProj = linearParams.slope * nextIndex + linearParams.intercept;
    
    // Quadratic Projection
    const quadProj = quadParams.a * nextIndex * nextIndex + quadParams.b * nextIndex + quadParams.c;

    projections.push({
      label: `Proj ${i + 1}`,
      value: 0, 
      projection: linProj,
      regression: linProj,
      quadraticProjection: quadProj,
      quadratic: quadProj
    });
  }

  return projections;
};