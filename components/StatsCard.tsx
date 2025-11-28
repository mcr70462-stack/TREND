import React from 'react';

interface StatsCardProps {
  slope: number;
  intercept: number;
  rSquared: number;
  avgAcceleration: number;
  quadA: number;
  quadRSquared: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  slope, 
  intercept, 
  rSquared, 
  avgAcceleration,
  quadA,
  quadRSquared
}) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        Métricas dos Modelos
      </h3>
      
      <div className="space-y-4">
        {/* Linear Section */}
        <div>
          <h4 className="text-xs font-bold text-orange-400 uppercase mb-2 border-b border-orange-500/20 pb-1">Modelo Linear (1ª Ordem)</h4>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-700/30 p-2 rounded">
                <span className="text-xs text-slate-400 block">Slope</span>
                <span className={`font-mono font-bold ${slope >= 0 ? 'text-green-400' : 'text-red-400'}`}>{slope.toFixed(4)}</span>
             </div>
             <div className="bg-slate-700/30 p-2 rounded">
                <span className="text-xs text-slate-400 block">R² (Linear)</span>
                <span className="font-mono font-bold text-white">{rSquared.toFixed(4)}</span>
             </div>
          </div>
        </div>

        {/* Quadratic Section */}
        <div>
          <h4 className="text-xs font-bold text-pink-400 uppercase mb-2 border-b border-pink-500/20 pb-1">Modelo Quadrático (2ª Ordem)</h4>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-700/30 p-2 rounded">
                <span className="text-xs text-slate-400 block">Curvatura (a)</span>
                <span className={`font-mono font-bold ${quadA > 0 ? 'text-blue-400' : 'text-yellow-400'}`}>{quadA.toFixed(5)}</span>
             </div>
             <div className="bg-slate-700/30 p-2 rounded">
                <span className="text-xs text-slate-400 block">R² (Curva)</span>
                <span className={`font-mono font-bold ${quadRSquared > rSquared ? 'text-green-400' : 'text-slate-400'}`}>{quadRSquared.toFixed(4)}</span>
             </div>
          </div>
        </div>

        {/* Comparison Insight */}
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
           <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Diagnóstico Automático</p>
           <p className="text-sm font-medium text-slate-200">
             {Math.abs(quadA) < 0.001 
               ? "Tendência Linear (Aceleração Desprezível)" 
               : quadA > 0 
                 ? "Crescimento Convexo (Acelerado 🚀)" 
                 : "Crescimento Côncavo (Saturação/Queda 📉)"}
           </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;