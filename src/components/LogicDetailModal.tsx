import React from 'react';
import { ArrowRight, TrendingUp, X } from 'lucide-react';

interface RelatedStock {
  ticker: string;
  name: string;
  rate?: number | string;
}

interface LogicDetail {
  rank?: number;
  keyword?: string;
  title?: string;
  subtitle?: string;
  desc?: string;
  badge?: string;
  theme?: string;
  relatedStocksDetails?: RelatedStock[];
  expertComment?: string;
  futureFlow?: number[];
}

interface LogicDetailModalProps {
  logic: LogicDetail;
  onClose: () => void;
  onStockClick: (ticker: string) => void;
}

const getThemeClasses = (theme?: string) => {
  switch (theme) {
    case 'blue':
      return 'border-blue-400/30 bg-blue-500/10 text-blue-100';
    case 'gold':
      return 'border-amber-400/30 bg-amber-500/10 text-amber-100';
    case 'orange':
      return 'border-orange-400/30 bg-orange-500/10 text-orange-100';
    default:
      return 'border-white/10 bg-white/5 text-white';
  }
};

const formatRate = (rate?: number | string) => {
  if (rate === undefined) return '';
  if (typeof rate === 'string') return rate;
  const prefix = rate > 0 ? '+' : '';
  return `${prefix}${rate}%`;
};

const LogicDetailModal: React.FC<LogicDetailModalProps> = ({ logic, onClose, onStockClick }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="w-full max-w-[430px] bg-[#121212] rounded-t-[32px] sm:rounded-[32px] pointer-events-auto overflow-hidden shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom duration-300">
        <header className="flex justify-between items-start p-6 border-b border-white/5 bg-[#121212]/95 backdrop-blur-md sticky top-0 z-10">
          <div className="space-y-2">
            {logic.badge && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getThemeClasses(logic.theme)}`}>
                {logic.badge}
              </span>
            )}
            <div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">{logic.title || '논리 상세'}</h2>
              {logic.subtitle && <p className="text-sm text-zinc-400 mt-1">{logic.subtitle}</p>}
            </div>
            {logic.keyword && (
              <div className="flex items-center text-sm text-zinc-300">
                <TrendingUp size={16} className="text-app-accent mr-2" />
                <span className="font-semibold">{logic.keyword}</span>
              </div>
            )}
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <X size={24} className="text-zinc-400" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          {logic.desc && <p className="text-base text-zinc-200 leading-relaxed">{logic.desc}</p>}

          {/* Expert's Comment */}
          {logic.expertComment && (
            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5 relative mt-2">
              <div className="absolute -top-3 left-4 bg-[#121212] px-2 text-xs font-bold text-indigo-400">Expert's Comment</div>
              <p className="text-sm text-zinc-300 italic leading-relaxed">"{logic.expertComment}"</p>
            </div>
          )}

          {/* Future Expected Flow Graph */}
          {logic.futureFlow && logic.futureFlow.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Future Expected Flow</div>
              <div className="h-32 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 100 50" className="w-full h-full p-4 overflow-visible">
                  {/* Simple Grid */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeDasharray="2 2" strokeWidth="0.5" />

                  {/* Trend Line */}
                  <path
                    d={`M ${logic.futureFlow.map((val, i) =>
                      `${(i / (logic.futureFlow!.length - 1)) * 100},${50 - (val / 100) * 50}`
                    ).join(' L ')}`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* End Point Dot */}
                  <circle
                    cx="100"
                    cy={50 - (logic.futureFlow[logic.futureFlow.length - 1] / 100) * 50}
                    r="2"
                    fill="#6366f1"
                    className="animate-pulse"
                  />
                </svg>
                <div className="absolute bottom-2 right-4 text-[10px] text-indigo-400 font-bold">Consensus Trend</div>
              </div>
            </div>
          )}

          {logic.relatedStocksDetails && logic.relatedStocksDetails.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wide">관련 종목</div>
              {logic.relatedStocksDetails.map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={() => onStockClick(stock.ticker)}
                  className="w-full p-4 rounded-2xl border border-white/5 bg-[#1E1E1E] text-left hover:border-white/15 active:scale-[0.99] transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-white">{stock.name}</div>
                    <div className="text-sm text-zinc-500">{stock.ticker}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-bold ${typeof stock.rate === 'number' && stock.rate > 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                      {formatRate(stock.rate)}
                    </span>
                    <ArrowRight size={18} className="text-zinc-500" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogicDetailModal;
