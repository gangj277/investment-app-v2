
import React, { useRef, useState, useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, Clock, BookOpen, ChevronDown, ChevronUp, MessageSquareQuote, ChevronRight, Vote, Check, AlertTriangle, ArrowRight, Activity, Calendar, Play, FileText, ArrowRightLeft } from 'lucide-react';
import { Thesis, TimeFrame, EventActionScenario, ActionOption, LogicBlock, Event } from '../types';
import { useStore } from '../contexts/StoreContext';

interface StockDetailModalProps {
  stock: Thesis;
  onClose: () => void;
  isLearningMode?: boolean;
  onReturnToQuiz?: () => void;
  onAddLogic?: () => void;
}

// --- SUB COMPONENT: REDESIGNED EVENT ACTION CARD ---
const EventActionCard: React.FC<{ event: Event }> = ({ event }) => {
  const scenario = event.actionScenario;
  if (!scenario) return null;

  // Distinguish Phase based on Event Status or Scenario Phase
  const isPreEvent = scenario.phase === 'Pre-Event' || event.status === 'Upcoming';

  // --- PRE-EVENT STATE (Strategy Builder) ---
  const [condition, setCondition] = useState<'Better' | 'Worse'>('Better');
  const [selectedAction, setSelectedAction] = useState<'buy' | 'hold' | 'sell' | null>(null);
  const [isStrategySaved, setIsStrategySaved] = useState(false);

  // --- POST-EVENT STATE (Execution) ---
  const [executionStatus, setExecutionStatus] = useState<'Pending' | 'Executed' | 'Revised'>('Pending');

  // --- RENDER: PRE-EVENT (Scenario Planner) ---
  if (isPreEvent) {
      if (isStrategySaved) {
          // 1-B. Strategy Saved View
          return (
            <div className="mb-6 animate-in zoom-in duration-300">
                <div className="bg-[#1E1E1E] rounded-[24px] p-6 border border-app-positive/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <CheckCircle2 size={80} className="text-app-positive" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="bg-app-positive text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Strategy Set</div>
                            <span className="text-xs font-bold text-zinc-500">{event.dDay} {event.type}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">대응 전략 수립 완료</h3>
                        <p className="text-zinc-400 text-sm mb-4">
                            설정하신 조건에 따라 알림을 보내드립니다.
                        </p>
                        
                        <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-zinc-500">조건</span>
                                <span className={`font-bold ${condition === 'Better' ? 'text-app-positive' : 'text-app-negative'}`}>
                                    결과가 {condition === 'Better' ? '기대 이상' : '실망스러울'} 때
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">대응</span>
                                <span className="font-bold text-white">
                                    {selectedAction === 'buy' ? '비중 확대 (Buy)' : selectedAction === 'sell' ? '비중 축소 (Sell)' : '관망 (Hold)'}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsStrategySaved(false)}
                            className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-sm hover:bg-zinc-700 transition-colors"
                        >
                            전략 수정하기
                        </button>
                    </div>
                </div>
            </div>
          );
      }

      // 1-A. Strategy Builder View
      return (
        <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-[32px] border border-white/10 overflow-hidden relative">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                             <div className="w-2 h-2 rounded-full bg-app-accent animate-pulse" />
                             <span className="text-xs font-bold text-app-accent uppercase tracking-wider">Scenario Planning</span>
                        </div>
                        <span className="text-xs font-bold text-zinc-500">{event.dDay} {event.type}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white leading-tight">
                        {event.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                        {scenario.description}
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 pt-5">
                    {/* Condition Toggle */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-zinc-500 mb-2 block">1. 상황 가정 (IF)</label>
                        <div className="flex bg-black rounded-xl p-1 border border-white/5">
                            <button 
                                onClick={() => setCondition('Better')}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${condition === 'Better' ? 'bg-zinc-800 text-app-positive shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                기대 이상일 때 🚀
                            </button>
                            <button 
                                onClick={() => setCondition('Worse')}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${condition === 'Worse' ? 'bg-zinc-800 text-app-negative shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                실망스러울 때 📉
                            </button>
                        </div>
                    </div>

                    {/* Action Selector */}
                    <div className="mb-6">
                        <label className="text-xs font-bold text-zinc-500 mb-2 block">2. 나의 행동 (THEN)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'buy', label: '매수', icon: '💰' },
                                { id: 'hold', label: '관망', icon: '👀' },
                                { id: 'sell', label: '매도', icon: '💸' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setSelectedAction(opt.id as any)}
                                    className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all active:scale-95 ${
                                        selectedAction === opt.id 
                                        ? 'border-app-accent bg-app-accent/10 text-white' 
                                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-600'
                                    }`}
                                >
                                    <span className="text-lg mb-1">{opt.icon}</span>
                                    <span className="text-xs font-bold">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsStrategySaved(true)}
                        disabled={!selectedAction}
                        className="w-full py-4 bg-white text-black font-bold text-base rounded-2xl shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 transition-all active:scale-[0.98]"
                    >
                        전략 저장하기
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER: POST-EVENT (Result Briefing) ---
  return (
    <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#1E1E1E] rounded-[32px] border border-white/10 overflow-hidden relative shadow-2xl">
            {/* Header */}
            <div className="bg-indigo-900/30 p-6 border-b border-indigo-500/20">
                <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Briefing</span>
                    <span className="text-xs font-bold text-indigo-300">이벤트 종료 ({event.title})</span>
                </div>
                <h3 className="text-xl font-extrabold text-white leading-tight mb-2">
                    {scenario.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed opacity-90">
                    {scenario.description}
                </p>
            </div>

            {/* Analysis Body */}
            <div className="p-6 space-y-5">
                {/* Market Reaction */}
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <Activity size={16} className="text-zinc-500" />
                        <span className="text-xs font-bold text-zinc-500">시장 반응</span>
                    </div>
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5 text-sm text-zinc-200 leading-relaxed">
                        {scenario.marketReaction}
                    </div>
                </div>

                {/* Hypothesis Check */}
                <div>
                     <div className="flex items-center space-x-2 mb-2">
                        <FileText size={16} className="text-app-accent" />
                        <span className="text-xs font-bold text-app-accent">내 가설 점검</span>
                    </div>
                    <div className="bg-app-accent/10 p-4 rounded-2xl border border-app-accent/20 text-sm text-white leading-relaxed">
                        {scenario.myHypothesisCheck}
                    </div>
                </div>

                {/* Strategy Execution */}
                <div className="pt-4 border-t border-white/5">
                    {executionStatus === 'Pending' ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs text-zinc-500 font-bold">나의 기존 전략</span>
                                <span className="text-sm font-bold text-white bg-zinc-700 px-3 py-1 rounded-lg">관망 (Hold)</span>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setExecutionStatus('Executed')}
                                    className="flex-1 py-4 bg-app-accent text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-indigo-400 active:scale-95 transition-all"
                                >
                                    계획대로 실행
                                </button>
                                <button 
                                    onClick={() => setExecutionStatus('Revised')}
                                    className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-700 hover:text-white active:scale-95 transition-all"
                                >
                                    전략 수정
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4 bg-app-positive/10 rounded-2xl border border-app-positive/30 animate-in fade-in zoom-in">
                            <CheckCircle2 size={32} className="text-app-positive mx-auto mb-2" />
                            <h4 className="text-lg font-bold text-white">
                                {executionStatus === 'Executed' ? '주문 실행 완료' : '전략 수정 페이지로 이동'}
                            </h4>
                            <p className="text-xs text-zinc-400">
                                {executionStatus === 'Executed' ? '포트폴리오에 반영되었습니다.' : '잠시만 기다려주세요...'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

// --- SUB COMPONENT: INTERACTIVE LOGIC BLOCK ---
const LogicHealthItem: React.FC<{ logic: LogicBlock }> = ({ logic }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Mock history if not present (for prototype)
    const history = logic.history || [
        { date: '2일 전', type: 'Positive', text: '관련 실적 20% 상회 발표' },
        { date: '1주 전', type: 'Neutral', text: '경쟁사 신제품 출시 소식' },
        { date: '2주 전', type: 'Positive', text: 'CEO가 컨퍼런스에서 해당 내용 강조' },
    ];

    return (
        <div className="mb-3">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                    ${isOpen ? 'bg-[#1E1E1E] border-app-accent' : 'bg-app-surface border-white/5 hover:border-zinc-600'}`}
            >
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start space-x-4">
                        <div className={`mt-0.5 transition-colors ${isOpen ? 'text-app-accent' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                            <CheckCircle2 size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className={`text-base font-bold mb-1 leading-snug ${isOpen ? 'text-white' : 'text-zinc-200'}`}>
                                {logic.title}
                            </h4>
                            <p className="text-sm text-zinc-500 leading-relaxed pr-6">
                                {logic.desc}
                            </p>
                        </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-zinc-600" />
                    </div>
                </div>
            </button>

            {/* Drill-down History */}
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="bg-[#121212] rounded-2xl p-5 border border-white/10 ml-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-zinc-800" />
                        
                        <h5 className="text-xs font-bold text-zinc-500 mb-4 pl-1">이 가설의 히스토리</h5>
                        
                        <div className="space-y-6">
                            {history.map((item, idx) => (
                                <div key={idx} className="relative flex items-start space-x-4">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 border-2 border-[#121212] 
                                        ${item.type === 'Positive' ? 'bg-app-positive' : item.type === 'Negative' ? 'bg-app-negative' : 'bg-zinc-500'}`} 
                                    />
                                    <div>
                                        <div className="text-sm font-bold text-white leading-tight mb-1">{item.text}</div>
                                        <div className="text-xs text-zinc-600">{item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/5">
                             <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">최근 3개월간 유효성</span>
                                <span className="text-sm font-bold text-app-accent">High (85점)</span>
                             </div>
                             <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                 <div className="h-full bg-app-accent w-[85%]" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB COMPONENT: NEWS ITEM ---
const NewsCard: React.FC<{ news: any }> = ({ news }) => {
    return (
        <div className="p-5 bg-app-surface rounded-2xl border border-white/5 mb-3 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-md text-[11px] font-black uppercase tracking-wide 
                    ${news.type === 'Positive' ? 'bg-app-positive/20 text-app-positive' : 
                      news.type === 'Negative' ? 'bg-app-negative/20 text-app-negative' : 'bg-zinc-700 text-zinc-300'}`}>
                    {news.type === 'Positive' ? '호재' : news.type === 'Negative' ? '악재' : '중립'}
                </span>
                <span className="text-xs text-zinc-500 font-medium">{news.date}</span>
            </div>
            
            <h3 className="text-lg font-bold text-white leading-snug mb-3">
                {news.text}
            </h3>

            {news.analystComment && (
                <div className="relative mt-4 bg-white/5 rounded-xl p-4 pl-10 border border-white/5">
                    <MessageSquareQuote size={18} className="absolute top-4 left-3 text-app-accent/80" />
                    <div className="text-xs font-bold text-zinc-500 mb-1">해설</div>
                    <p className="text-sm text-zinc-300 font-medium italic leading-relaxed">
                        "{news.analystComment}"
                    </p>
                </div>
            )}
        </div>
    );
}

// Helper to get X-axis labels
const getXAxisLabels = (frame: TimeFrame) => {
    switch (frame) {
        case '1D': return ['09:00', '12:00', '15:30'];
        case '1W': return ['Mon', 'Wed', 'Fri'];
        case '1M': return ['4주 전', '2주 전', '오늘'];
        case '3M': return ['3달 전', '1달 전', '오늘'];
        case '1Y': return ['Jan', 'Jun', 'Dec'];
        case '5Y': return ['2020', '2022', '2024'];
        default: return [];
    }
};

const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose, isLearningMode = false, onReturnToQuiz, onAddLogic }) => {
  const { data } = useStore();
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('1M');
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  // Check ownership: This determines if we show the "Management" view or "Discovery" view
  const isInvested = data.myThesis.some(t => t.ticker === stock.ticker);

  // Active Events with scenarios
  const actionableEvents = stock.events.filter(e => e.actionScenario !== undefined);
  // Show Action Card only if Invested and not in learning mode
  const showActionCards = isInvested && !isLearningMode && actionableEvents.length > 0;

  // Chart Data Processing
  // If chartHistory is empty (e.g. dummy preview stock), handle gracefully
  const chartPoints = stock.chartHistory[activeTimeFrame] || [];
  const chartNarrative = stock.chartNarratives[activeTimeFrame] || "데이터 분석 중...";
  const isPositive = chartPoints.length > 0 ? (chartPoints[chartPoints.length - 1] - chartPoints[0]) >= 0 : stock.changeRate >= 0;
  const trendColor = isPositive ? '#F87171' : '#60A5FA';

  // SVG Config
  const svgWidth = 380;
  const svgHeight = 160;
  const padding = { top: 20, right: 40, bottom: 20, left: 0 }; // Right padding for Y-axis labels
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Calculate Scale
  const minVal = chartPoints.length ? Math.min(...chartPoints) : 0;
  const maxVal = chartPoints.length ? Math.max(...chartPoints) : 100;
  const range = maxVal - minVal || 1;
  const buffer = range * 0.1; // 10% buffer
  const effectiveMin = minVal - buffer;
  const effectiveRange = range + (buffer * 2);
  const avgVal = chartPoints.reduce((a, b) => a + b, 0) / (chartPoints.length || 1);
  const avgY = svgHeight - padding.bottom - ((avgVal - effectiveMin) / effectiveRange) * graphHeight;

  // X Axis Labels
  const xLabels = getXAxisLabels(activeTimeFrame);

  const generatePath = (points: number[]) => {
    if (!points.length) return "";
    return points.map((val, i) => {
      const x = (i / (points.length - 1)) * graphWidth + padding.left;
      const y = svgHeight - padding.bottom - ((val - effectiveMin) / effectiveRange) * graphHeight;
      return `${x},${y}`;
    }).join(" ");
  };
  const linePath = `M ${generatePath(chartPoints)}`;

  const formatPrice = (p: number) => p.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className={`fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none ${isLearningMode ? 'z-[110]' : 'z-[100]'}`}>
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={!isLearningMode ? onClose : undefined}
      />
      
      <div className="w-full max-w-[430px] h-[92vh] bg-[#121212] rounded-t-[32px] pointer-events-auto overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative border-t border-white/10 mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center px-6 py-5 border-b border-white/5 bg-[#121212]/95 backdrop-blur-md sticky top-0 z-10">
          <div>
            <div className="text-xs font-bold text-zinc-500 mb-0.5">{stock.ticker}</div>
            <h2 className="text-xl font-bold text-white">{stock.name}</h2>
          </div>
          <div className="text-right">
             <div className="text-xl font-bold text-white">${stock.currentPrice}</div>
             <div className={`text-sm font-bold ${stock.changeRate >= 0 ? 'text-app-positive' : 'text-app-negative'}`}>
                 {stock.changeRate > 0 ? '+' : ''}{stock.changeRate}%
             </div>
          </div>
          {!isLearningMode && (
              <button onClick={onClose} className="ml-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400">
                <X size={20} />
              </button>
          )}
        </header>

        {/* --- BODY SCROLL --- */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32">
          
          {/* 0. Learning Mode Banner */}
          {isLearningMode && (
             <div className="bg-app-accent/10 border border-app-accent/30 rounded-2xl p-4 flex items-start space-x-3 animate-pulse-slow mb-6">
                <BookOpen size={20} className="text-app-accent mt-0.5 shrink-0" />
                <div>
                   <h3 className="text-sm font-bold text-app-accent mb-1">힌트 찾는 중...</h3>
                   <p className="text-xs text-zinc-300 leading-relaxed">
                     차트와 뉴스를 보고 퀴즈 정답을 유추해보세요.
                   </p>
                </div>
             </div>
          )}

          {/* 1. HERO: EVENT ACTION CARDS (Priority 1) - ONLY IF INVESTED */}
          {showActionCards && (
             <section className="mb-4">
               {actionableEvents.map((evt, idx) => (
                  <EventActionCard key={idx} event={evt} />
               ))}
             </section>
          )}

          {/* 2. CHART CONTEXT (Priority 2) */}
          <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Activity size={18} className="mr-2 text-zinc-500" />
                    주가 흐름
                  </h3>
                  <div className="flex bg-white/5 rounded-lg p-0.5">
                     {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as TimeFrame[]).map(tf => (
                         <button 
                            key={tf}
                            onClick={() => setActiveTimeFrame(tf)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${activeTimeFrame === tf ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                         >
                            {tf}
                         </button>
                     ))}
                  </div>
              </div>

              <div className="w-full h-[160px] mb-4 bg-white/[0.02] rounded-2xl border border-white/5 relative">
                  {chartPoints.length > 0 ? (
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        {/* Average Grid Line */}
                        <line x1={padding.left} y1={avgY} x2={svgWidth - padding.right} y2={avgY} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />

                        {/* Chart Area & Line */}
                        <path d={`${linePath} L ${svgWidth - padding.right},${svgHeight - padding.bottom} L ${padding.left},${svgHeight - padding.bottom} Z`} fill="url(#chartGrad)" />
                        <path d={linePath} fill="none" stroke={trendColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Y-Axis Labels (Price) */}
                        <text x={svgWidth} y={padding.top} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                           {formatPrice(maxVal)}
                        </text>
                        <text x={svgWidth} y={avgY + 3} className="text-[10px] fill-zinc-600 font-medium" textAnchor="end">
                           Avg
                        </text>
                        <text x={svgWidth} y={svgHeight - padding.bottom} className="text-[10px] fill-zinc-500 font-medium" textAnchor="end">
                           {formatPrice(minVal)}
                        </text>

                        {/* X-Axis Labels (Time) */}
                        <g className="text-[10px] fill-zinc-500 font-medium">
                            <text x={padding.left} y={svgHeight} textAnchor="start">{xLabels[0]}</text>
                            <text x={(svgWidth - padding.right) / 2} y={svgHeight} textAnchor="middle">{xLabels[1]}</text>
                            <text x={svgWidth - padding.right} y={svgHeight} textAnchor="end">{xLabels[2]}</text>
                        </g>
                  </svg>
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          차트 데이터 로딩 중
                      </div>
                  )}
              </div>
              <div className="flex items-start space-x-2 text-sm text-zinc-400 bg-white/5 p-3 rounded-xl">
                  <TrendingUp size={16} className="shrink-0 mt-0.5" />
                  <span>{chartNarrative}</span>
              </div>
          </section>

          {/* 3. LOGIC HEALTH (Only if Invested) */}
          {/* CRITICAL: ONLY SHOW IF INVESTED */}
          {isInvested && (
          <section className="mb-10 animate-in slide-in-from-bottom duration-500 delay-100">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-white flex items-center">
                    <CheckCircle2 size={18} className="mr-2 text-app-accent" />
                    내 가설 관리
                 </h3>
                 <span className="text-xs font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-md">Logic Health</span>
             </div>
             
             {/* Logic List */}
             <div>
                 {stock.logicBlocks.map(logic => (
                     <LogicHealthItem key={logic.id} logic={logic} />
                 ))}
             </div>
             
             {!isLearningMode && (
                 <button 
                    onClick={onAddLogic}
                    className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-bold text-sm hover:text-white hover:border-zinc-600 transition-colors mt-2"
                 >
                     + 새로운 가설 추가하기
                 </button>
             )}
          </section>
          )}

          {/* 4. NEWS EVIDENCE (Priority 4) */}
          <section className="mb-10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-zinc-500" />
                  관련 뉴스
              </h3>
              <div>
                  {stock.newsTags.length > 0 ? (
                      stock.newsTags.map((news, idx) => (
                          <NewsCard key={idx} news={news} />
                      ))
                  ) : (
                      <div className="text-center py-8 text-zinc-500 bg-white/5 rounded-2xl border border-white/5">
                          현재 분석된 주요 뉴스가 없습니다.
                      </div>
                  )}
              </div>
          </section>

          {/* 5. COMPANY INFO (Footer) */}
          <section className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">무엇을 하는 회사인가요?</h3>
              <p className="text-zinc-400 leading-relaxed mb-4">
                  {stock.companyProfile.summary}
              </p>
              
              <div className={`overflow-hidden transition-all duration-300 ${isProfileExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                  <p className="text-zinc-500 text-sm leading-relaxed pb-4">
                      {stock.companyProfile.description}
                  </p>
              </div>

              <button 
                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                className="flex items-center text-sm font-bold text-zinc-500 hover:text-white transition-colors"
              >
                  {isProfileExpanded ? '접기' : '더 자세히 보기'} 
                  {isProfileExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
              </button>
          </section>

        </div>

        {/* --- LEARNING MODE FAB --- */}
        {isLearningMode && onReturnToQuiz && (
           <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
              <button 
                onClick={onReturnToQuiz}
                className="w-full py-4 bg-app-accent hover:bg-indigo-400 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 size={20} />
                <span>분석 완료 (질문으로 돌아가기)</span>
              </button>
           </div>
        )}

        {/* --- UNINVESTED VIEW CTA (Fixed Footer) --- */}
        {/* CRITICAL: ONLY SHOW IF NOT INVESTED (DISCOVERY MODE) */}
        {!isInvested && !isLearningMode && (
           <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent z-20 pt-12">
               <button 
                 onClick={onAddLogic}
                 className="w-full py-4 bg-app-accent hover:bg-indigo-400 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-[0.98] transition-all flex items-center justify-center animate-pulse-slow"
               >
                 <span>이 종목으로 투자 가설 세우기</span>
                 <ArrowRight size={20} className="ml-2" />
               </button>
           </div>
        )}

      </div>
    </div>
  );
};

export default StockDetailModal;
