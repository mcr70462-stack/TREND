export interface DataPoint {
  label: string;
  value: number;
  // Optional computed fields for visualization
  regression?: number; // Linear
  quadratic?: number; // Quadratic (2nd Degree)
  projection?: number; // Linear Projection
  quadraticProjection?: number; // Quadratic Projection
  velocity?: number; // 1st Derivative approximation
  acceleration?: number; // 2nd Derivative approximation
}

export interface AnalysisResult {
  slope: number;
  intercept: number;
  rSquared: number;
  quadA: number; // Coefficient a in ax^2 + bx + c
  quadB: number; // Coefficient b
  quadC: number; // Coefficient c
  avgAcceleration: number;
  isAccelerating: boolean; // Based on 2nd derivative
  forecast: DataPoint[];
  geminiReport: string;
}

export enum DataPreset {
  SALES = 'SALES',
  WEBSITE_TRAFFIC = 'WEBSITE_TRAFFIC',
  CRYPTO = 'CRYPTO',
  EMPTY = 'EMPTY'
}