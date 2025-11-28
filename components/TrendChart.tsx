import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';
import { DataPoint } from '../types';

interface TrendChartProps {
  data: DataPoint[];
  forecastData: DataPoint[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data, forecastData }) => {
  
  const chartData = [
    ...data.map(d => ({ ...d, type: 'Histórico' })),
    ...forecastData.map(d => ({ ...d, type: 'Projeção' }))
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          Comparativo de Modelos
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Dados Reais
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span> Linear (Tendência)
          </div>
           <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span> Quadrática (Curva)
          </div>
        </div>
      </div>

      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8' }} 
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8' }} 
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend />
            
            {/* Historical Area */}
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Valor Real" 
              stroke="#3b82f6" 
              fill="rgba(59, 130, 246, 0.1)" 
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />

            {/* Linear Regression Line */}
            <Line 
              type="monotone" 
              dataKey="regression" 
              name="Linear (Reta)" 
              stroke="#fb923c" 
              strokeWidth={2} 
              dot={false}
              strokeDasharray="5 5"
            />

            {/* Quadratic Regression Line */}
            <Line 
              type="natural" 
              dataKey="quadratic" 
              name="Quadrática (Curva)" 
              stroke="#ec4899" 
              strokeWidth={2} 
              dot={false}
              strokeDasharray="3 3"
            />

            {/* Forecast Lines (Visualized slightly differently or continuous) */}
            <Line
              type="monotone"
              dataKey="projection"
              name="Projeção Linear"
              stroke="#fb923c"
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="3 3"
              hide={true} // Hidden in legend to avoid clutter, visible on chart
            />
             <Line
              type="natural"
              dataKey="quadraticProjection"
              name="Projeção Curva"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="3 3"
              hide={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;