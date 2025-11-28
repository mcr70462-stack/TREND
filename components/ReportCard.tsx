import React from 'react';
import ReactMarkdown from 'react-markdown'; // Assuming we can use basic rendering or just text
// Since we cannot add new packages easily in the prompt constraints without explicit instruction, 
// I will build a simple renderer or just display pre-formatted text.
// Ideally, we'd use 'react-markdown', but to be safe and dependency-free for this format:

interface ReportCardProps {
  report: string;
  isLoading: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, isLoading }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-full">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        Relatório IA (Gemini 2.5)
      </h3>
      
      <div className="prose prose-invert max-w-none text-slate-300">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            <p className="text-sm animate-pulse">Analisando dados e calculando derivadas...</p>
          </div>
        ) : (
          <div className="whitespace-pre-line leading-relaxed">
            {report ? report : "Carregue dados para gerar um relatório de tendência."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;