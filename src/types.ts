export interface User {
  name: string;
  profileMsg: string;
  totalWinRate: number;
  totalAssetValue: number;
  totalProfitValue: number;
  totalProfitRate: number;
  holdings: {
    domestic: Holding[];
    overseas: Holding[];
  };
}

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  currency: 'KRW' | 'USD';
  valuation: number;
  profitValue: number;
  profitRate: number;
}

// --- MARKET DATA ---
export interface MarketIndex {
  name: string;
  value: string;
  rate: number;
  trend: 'up' | 'down';
  chartData: number[];
}

export interface MarketWeather {
  status: string;
  summaryTitle: string;
  summaryBody: string;
  indices: MarketIndex[];
}

export interface SummaryHighlight {
  text: string;
  isBold: boolean;
}

// --- LOGIC & NARRATIVE (New Core) ---

export interface NarrativeProfile {
  summary: string; // One-line summary for cards
  whyNow: string;
  floor: string;
  upside: string;
  debate: string[]; // Bull/Bear points
  theBet: string; // The core question to the user
}

export interface WatchpointOption {
  label: string; // e.g., "Bull: 이익 방어 가능"
  side: 'Bull' | 'Bear';
  implications?: string;
}

export interface Watchpoint {
  id: number;
  question: string;
  context: string; // Background info (Why it matters)
  options: WatchpointOption[];
}

export interface LogicHealth {
  score: number; // 0-100
  status: 'Good' | 'Warning' | 'Danger';
  history: {
    date: string;
    scoreChange: number;
    reason: string;
  }[];
}

// Deprecated LogicBlock kept ONLY for UI compatibility during migration phase.
// Will be removed in future steps.
export interface LogicBlock {
  id: string | number;
  icon?: string;
  title: string;
  desc: string;
  isActive?: boolean;
  history?: { date: string; type: string; text: string; category?: string; badgeText?: string; }[];
}

// --- UNIFIED EVENT SYSTEM (New) ---

export interface EventCheckpoint {
  watchpointId: number;
  status: 'Pending' | 'Pass' | 'Fail';
  actualValue?: string;
}

export interface EventScenario {
  label: string; // e.g., "Aggressive Buy"
  action: 'buy' | 'hold' | 'sell';
}

export interface EventActionHistory {
  decision: 'buy' | 'hold' | 'sell';
  date: string;
  pnl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; 
  type: string; // Earnings, Product Launch, etc.
  status: 'Upcoming' | 'Active' | 'Completed';
  
  // Linkage to Watchpoints
  checkpoints: EventCheckpoint[];
  
  // Analysis & Reaction
  marketReaction: {
    priceChange: string;
    volumeChange: string;
    comment: string;
  };
  analysis: {
    cause: string;
    context: string;
  };
  
  // Actionable Scenarios
  scenarios: EventScenario[];
  
  // User History
  myActionHistory?: EventActionHistory;
  
  // Optional for UI urgency
  impact?: 'High' | 'Medium' | 'Low';
}

// --- NEWS SYSTEM ---
export interface NewsItem {
  type: 'Positive' | 'Negative' | 'Neutral';
  text: string;
  date: string;
  analystComment?: string;
}

// --- COMPANY INFO ---
export interface CompanyProfile {
  summary: string;
  description: string;
}

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

// --- MAIN THESIS STRUCTURE ---
export interface Thesis {
  id: number;
  ticker: string;
  name: string;
  
  // Asset Data
  currentPrice: number;
  changeRate: number;
  status: 'Invested' | 'Watching';
  
  // Narrative Core (New)
  narrative: NarrativeProfile;
  watchpoints: Watchpoint[]; 
  logicHealth: LogicHealth;
  
  // Event Loop
  events: Event[];
  
  // Legacy Logic Blocks (Backward Compat)
  logicBlocks: LogicBlock[]; 
  
  // Context
  companyProfile: CompanyProfile;
  newsTags: NewsItem[];
  dailyBriefing: string;
  
  // Charts
  chartHistory: Record<TimeFrame, number[]>;
  chartNarratives: Record<TimeFrame, string>;
}

// --- SEARCH & DISCOVERY ---
export interface RelatedStock {
  ticker: string;
  name: string;
  rate: number;
}

export interface TrendingLogic {
  rank: number;
  keyword: string;
  relatedStocksDetails: RelatedStock[];
  desc: string;
  title: string;
  subtitle: string;
  badge: string;
  theme: string;
}

export interface SearchResultSample {
  ticker: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  
  companyProfile: CompanyProfile;
  chartContext: string;
  
  // Core Data
  narrative: NarrativeProfile;
  watchpoints: Watchpoint[];
  
  // Pre-populated events for preview
  events?: Event[]; 
  
  availableLogicBlocks: LogicBlock[]; // Legacy
}

export interface RecentSearch {
  id: number;
  ticker: string;
  name: string;
  date: string;
}

export interface Discovery {
  trendingLogics: TrendingLogic[];
  searchResultSample: SearchResultSample;
  recentSearches: RecentSearch[];
  searchResults: SearchResultSample[];
}

export interface Notification {
  id: number;
  type: 'alert' | 'info';
  title: string;
  desc: string;
  stockId?: number;
  ticker?: string;
  timestamp: string;
  isRead: boolean;
}

export interface AppData {
  user: User;
  marketWeather: MarketWeather;
  summaryHighlights: SummaryHighlight[];
  hotIssues: any[];
  myThesis: Thesis[];
  discovery: Discovery;
  notifications: Notification[];
}

export interface StoreContextType {
  data: AppData;
  updateUserName: (name: string) => void;
  markNotificationAsRead: (id: number) => void;
  searchStocks: (query: string) => void;
  selectDiscoveryStock: (ticker: string) => void;
  // Updated Signature for new flow
  addToMyThesis: (stock: SearchResultSample, selectedWatchpointIndices: number[], investmentType: string, amount?: string) => Thesis;
  recordEventDecision: (thesisId: number, eventId: string, decision: 'buy' | 'hold' | 'sell') => void;
}