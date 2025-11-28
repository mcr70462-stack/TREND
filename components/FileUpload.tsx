import React, { useRef } from 'react';
import { DataPoint, DataPreset } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: DataPoint[]) => void;
  onPresetSelected: (preset: DataPreset) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, onPresetSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const parsedData: DataPoint[] = [];

      // Simple CSV parser: Label,Value
      for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;
        const [label, valueStr] = line.split(',');
        const value = parseFloat(valueStr);
        
        if (!isNaN(value)) {
          parsedData.push({ label, value });
        }
      }

      if (parsedData.length > 0) {
        onDataLoaded(parsedData);
      } else {
        alert("Formato de CSV inválido ou vazio. Use: Label,Value");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Fonte de Dados
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Dados de Exemplo</label>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => onPresetSelected(DataPreset.SALES)}
              className="px-4 py-2 bg-slate-700 hover:bg-blue-600 text-sm rounded-lg transition-colors text-white"
            >
              Vendas (Crescente)
            </button>
            <button 
              onClick={() => onPresetSelected(DataPreset.WEBSITE_TRAFFIC)}
              className="px-4 py-2 bg-slate-700 hover:bg-purple-600 text-sm rounded-lg transition-colors text-white"
            >
              Tráfego (Volátil)
            </button>
            <button 
              onClick={() => onPresetSelected(DataPreset.CRYPTO)}
              className="px-4 py-2 bg-slate-700 hover:bg-green-600 text-sm rounded-lg transition-colors text-white"
            >
              Cripto (Queda)
            </button>
          </div>
        </div>

        {/* Upload */}
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">Upload CSV (Label, Value)</label>
           <input 
              type="file" 
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer
              "
            />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;