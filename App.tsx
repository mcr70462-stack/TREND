import React, { useState, useEffect, useCallback } from 'react';
import { DataPoint, DataPreset } from './types';
import FileUpload from './components/FileUpload.tsx';
import TrendChart from './components/TrendChart.tsx';
import StatsCard from './components/StatsCard.tsx';
import ReportCard from './components/ReportCard.tsx';
import { calculateLinearRegression, calculateDerivatives, generateProjections, calculateQuadraticRegression } from './utils/mathUtils';
import { analyzeTrendWithGemini } from './services/geminiService';

const SAMPLE_SALES: DataPoint[] = [
  { label: 'Jan', value: 120 }, { label: 'Fev', value: 132 }, { label: 'Mar', value: 101 },
  { label: 'Abr', value: 134 }, { label: 'Mai', value: 190 }, { label: 'Jun', value: 230 },
  { label: 'Jul', value: 210 }, { label: 'Ago', value: 250 }, { label: 'Set', value: 280 },
  { label: 'Out', value: 320 }, { label: 'Nov', value: 350 }, { label: 'Dez', value: 410 }
];

const SAMPLE_TRAFFIC: DataPoint[] = [
  { label: 'W1', value: 500 }, { label: 'W2', value: 480 }, { label: 'W3', value: 600 },
  { label: 'W4', value: 550 }, { label: 'W5', value: 700 }, { label: 'W6', value: 680 },
  { label: 'W7', value: 850 }, { label: 'W8', value: 800 }, { label: 'W9', value: 950 }
];

const SAMPLE_CRYPTO: DataPoint[] = [
  { label: 'D1', value: 45000 }, { label: 'D2', value: 44200 }, { label: 'D3', value: 43000 },
  { label: 'D4', value: 41500 }, { label: 'D5', value: 42000 }, { label: 'D6', value: 40000 },
  { label: 'D7', value: 38500 }, { label: 'D8', value: 37000 }, { label: 'D9', value: 36500 }
];

const App: React.FC = () => {
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [processedData, setProcessedData] = useState<DataPoint[]>([]);
  const [forecastData, setForecastData] = useState<DataPoint[]>([]);
  
  const [stats, setStats] = useState({
    slope: 0,
    intercept: 0,
    rSquared: 0,
    avgAcceleration: 0,
    quadA: 0,
    quadB: 0,
    quadC: 0,
    quadRSquared: 0
  });

  const [aiReport, setAiReport] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Core Analysis Logic
  const performAnalysis = useCallback(async (data: DataPoint[]) => {
    if (data.length < 2) return;

    setIsAnalyzing(true);
    setAiReport(''); // Clear previous report

    // 1. Math Calculation (Client Side)
    // Linear
    const linReg = calculateLinearRegression(data);
    // Quadratic (The new "Derivada Segunda Model")
    const quadReg = calculateQuadraticRegression(data);
    // Discrete Derivatives
    const { processedData: dataWithDerivatives, avgAcceleration } = calculateDerivatives(data);

    // Add regression points (Line & Curve) to historical data for chart
    const fullProcessedData = dataWithDerivatives.map((d, i) => ({
      ...d,
      regression: linReg.slope * i + linReg.intercept,
      quadratic: quadReg.a * i * i + quadReg.b * i + quadReg.c
    }));

    // 2. Generate Projections (Next 5 periods) for both models
    const projections = generateProjections(
      data, 
      { slope: linReg.slope, intercept: linReg.intercept },
      { a: quadReg.a, b: quadReg.b, c: quadReg.c },
      5
    );

    // Update State
    setRawData(data);
    setProcessedData(fullProcessedData);
    setForecastData(projections);
    setStats({ 
      slope: linReg.slope, 
      intercept: linReg.intercept, 
      rSquared: linReg.rSquared, 
      avgAcceleration,
      quadA: quadReg.a,
      quadB: quadReg.b,
      quadC: quadReg.c,
      quadRSquared: quadReg.rSquared
    });

    // 3. Deep Learning / AI Analysis (Gemini)
    const report = await analyzeTrendWithGemini(data, {
      slope: linReg.slope,
      avgAcceleration,
      quadA: quadReg.a,
      quadRSquared: quadReg.rSquared,
      linRSquared: linReg.rSquared
    });
    setAiReport(report);
    
    setIsAnalyzing(false);
  }, []);

  const handlePresetSelect = (preset: DataPreset) => {
    let data: DataPoint[] = [];
    switch (preset) {
      case DataPreset.SALES: data = SAMPLE_SALES; break;
      case DataPreset.WEBSITE_TRAFFIC: data = SAMPLE_TRAFFIC; break;
      case DataPreset.CRYPTO: data = SAMPLE_CRYPTO; break;
      default: return;
    }
    performAnalysis(data);
  };

  const handleDataLoaded = (data: DataPoint[]) => {
    performAnalysis(data);
  };

  // Initial load
  useEffect(() => {
    handlePresetSelect(DataPreset.SALES);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              TrendAI
            </h1>
            <p className="text-slate-400 mt-1">Análise de Tendências e Derivadas</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
             <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
               Gemini 2.5
             </span>
             <span className="inline-flex items-center rounded-full bg-orange-400/10 px-3 py-1 text-xs font-medium text-orange-400 ring-1 ring-inset ring-orange-400/20">
               Linear
             </span>
             <span className="inline-flex items-center rounded-full bg-pink-400/10 px-3 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
               Quadrática (2ª Derivada)
             </span>
          </div>
        </header>

        {/* Input Section */}
        <FileUpload onDataLoaded={handleDataLoaded} onPresetSelected={handlePresetSelect} />

        {/* Main Grid */}
        {rawData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Chart (Spans 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <TrendChart data={processedData} forecastData={forecastData} />
            </div>

            {/* Right Column: Stats & AI Report */}
            <div className="space-y-6 flex flex-col">
              <StatsCard 
                slope={stats.slope}
                intercept={stats.intercept}
                rSquared={stats.rSquared}
                avgAcceleration={stats.avgAcceleration}
                quadA={stats.quadA}
                quadRSquared={stats.quadRSquared}
              />
              <div className="flex-grow">
                <ReportCard report={aiReport} isLoading={isAnalyzing} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;