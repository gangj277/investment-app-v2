import React, { useState } from 'react';
import { X, Info, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SearchResultSample, Thesis } from '../../types';

interface WatchpointBuilderProps {
  stock: SearchResultSample | Thesis;
  onComplete: (selections: { watchpointId: number, side: 'Bull' | 'Bear' }[]) => void;
  onClose: () => void;
}

const WatchpointBuilder: React.FC<WatchpointBuilderProps> = ({ stock, onComplete, onClose }) => {
  const watchpoints = stock.watchpoints || [];

  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, 'Bull' | 'Bear'>>({});

  const currentItem = watchpoints[currentIndex];
  const progress = watchpoints.length > 0 ? ((currentIndex + 1) / watchpoints.length) * 100 : 0;

  const handleSelect = (watchpointId: number, side: 'Bull' | 'Bear') => {
    setSelections(prev => ({
      ...prev,
      [watchpointId]: side
    }));
  };

  const handleNext = () => {
    if (currentIndex < watchpoints.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish
      const result = Object.entries(selections).map(([id, side]) => ({
        watchpointId: Number(id),
        side
      }));
      onComplete(result);
    }
  };

  const isCurrentSelected = currentItem ? !!selections[currentItem.id] : false;

  // Empty state
  if (watchpoints.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-zinc-900 to-black items-center justify-center px-8 text-center border-2 border-app-accent/30">
        <div className="w-24 h-24 bg-app-accent/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <AlertCircle size={48} className="text-app-accent" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          왓치포인트가 아직 없습니다
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-10 text-base">
          이 종목에 대한 감시 기준이 아직 설정되지 않았습니다.<br />
          AI가 제안하는 기준을 추가하거나,<br />
          직접 만들어보세요.
        </p>
        <button
          onClick={() => {
            onComplete([]);
            onClose();
          }}
          className="px-10 py-4 bg-app-accent hover:bg-indigo-400 rounded-full text-white font-bold text-lg transition-all shadow-lg active:scale-95"
        >
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] relative font-sans">

      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-app-accent/10 rounded-full flex items-center justify-center mb-6">
            <Info size={40} className="text-app-accent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            좋습니다.<br />
            그럼 앞으로 어떤 신호가 올 때<br />
            <span className="text-app-accent">알림</span>을 드릴까요?
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            주가의 큰 흐름을 결정할<br />
            핵심 관전 포인트들을 짚어드립니다.
          </p>
          <button
            onClick={() => setShowIntro(false)}
            className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
          >
            핵심 포인트 확인하기
          </button>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 pt-6 border-b border-white/5 flex justify-between items-center bg-[#121212]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-500">관전 포인트 설정</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white">
            {currentIndex + 1}/{watchpoints.length}
          </span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-800">
        <div className="h-full bg-app-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Main Content (Slider Area) */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">

        {/* Title Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
            {currentItem.title || `Point ${currentIndex + 1}`}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-black text-white leading-tight mb-8">
          {currentItem.question}
        </h2>

        {/* Context Box (Judgment Guide) */}
        <div className="mb-8 p-5 rounded-2xl bg-zinc-900/50 border border-white/10 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-zinc-400" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">판단 가이드</span>
          </div>
          <div className="text-zinc-300 text-sm leading-relaxed font-medium">
            <ReactMarkdown
              components={{
                strong: ({ node, ...props }) => <span className="text-white font-bold" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mt-2" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
              }}
            >
              {currentItem.context}
            </ReactMarkdown>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 flex-1">
          {currentItem.options.map((option, idx) => {
            const isSelected = selections[currentItem.id] === option.side;
            const sideColor = option.side === 'Bull' ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400';
            const bgColor = option.side === 'Bull' ? 'bg-emerald-500/10' : 'bg-rose-500/10';
            const iconColor = option.side === 'Bull' ? 'bg-emerald-500' : 'bg-rose-500';

            return (
              <button
                key={idx}
                onClick={() => handleSelect(currentItem.id, option.side)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] relative overflow-hidden group
                     ${isSelected
                    ? `${sideColor} ${bgColor} shadow-lg`
                    : 'border-white/10 text-zinc-400 hover:border-white/30 hover:bg-white/5'
                  }
                   `}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex-1">
                    <span className={`text-xs font-black uppercase tracking-wider mb-1 block ${isSelected ? 'opacity-100' : 'text-zinc-600'}`}>
                      {option.side === 'Bull' ? '긍정적 시나리오 (Bull)' : '부정적 시나리오 (Bear)'}
                    </span>
                    <span className={`text-lg font-bold block mb-1 ${isSelected ? 'text-white' : ''}`}>
                      {option.label}
                    </span>
                    {option.implications && (
                      <span className={`text-xs block transition-opacity ${isSelected ? 'opacity-80 text-white' : 'text-zinc-500'}`}>
                        👉 {option.implications}
                      </span>
                    )}
                  </div>
                  <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? `${iconColor} border-transparent` : 'border-zinc-700'
                    }`}>
                    {isSelected && <CheckCircle2 size={16} className="text-black" strokeWidth={3} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-[#121212] safe-area-bottom">
        <button
          onClick={handleNext}
          disabled={!isCurrentSelected}
          className="w-full py-4 bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold rounded-2xl text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <span>{currentIndex === watchpoints.length - 1 ? "알림 설정 완료" : "다음"}</span>
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default WatchpointBuilder;
