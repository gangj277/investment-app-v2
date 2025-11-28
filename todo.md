# 🛠️ Hypo Data & Logic Fix Task List

This document breaks down the "Data Consistency" and "Navigation Logic" fixes into atomic, execution-ready tasks. Please execute them **one by one** to ensure accuracy.

---

## ✅ Task 1: Update Data Source (Source of Truth)
**Target File:** `src/contexts/StoreContext.tsx`
**Goal:** Align the `initialData` strictly with the user's "My Assets" screenshot.

**Instructions:**
1.  Locate `initialData.user.holdings`.
2.  **Domestic Stocks Update:** Replace the existing array with these exact values:
    * **SK하이닉스:** quantity: `44`, valuation: `8140000`, profitValue: `-547180`, profitRate: `-6.3`
    * **삼성전자:** quantity: `120`, valuation: `9000000`, profitValue: `-183600`, profitRate: `-2.0`
    * **TIGER 미국S&P500:** quantity: `22`, valuation: `432080`, profitValue: `114620`, profitRate: `36.1`
3.  **Overseas Stocks Update:** Replace with these exact values:
    * **Google:** (Change name from "Alphabet A" to "Google"), quantity: `98`, valuation: `23520000`, profitValue: `12408900`, profitRate: `111.7`
    * **Amazon:** quantity: `33`, valuation: `8250000`, profitValue: `1966500`, profitRate: `31.3`
    * **NVIDIA:** quantity: `10`, valuation: `12400000`, profitValue: `7294800`, profitRate: `142.7`
4.  **Sync `myThesis`:** Ensure the `myThesis` array only contains stocks that exist in the updated holdings above. Remove any dummy data that doesn't match.

---

## ✅ Task 2: Fix Onboarding Stock Selection Logic
**Target File:** `src/components/onboarding/OnboardingFlow.tsx`
**Goal:** Ensure the user selects from their *actual* overseas holdings, not random data.

**Instructions:**
1.  Navigate to the `step === 'stock-select'` logic (or where `scannedStocks` is set).
2.  **Filter Logic Change:** instead of pulling from `ALL_STOCKS`, pull directly from `data.user.holdings.overseas` (from Task 1).
3.  **Display:** Ensure the list shows **Google, Amazon, and NVIDIA** as the selection options.
4.  **Selection Handler:** When a user selects a stock here, pass this *exact* stock object to the next step (Quiz).

---

## ✅ Task 3: Fix Discovery Navigation Bug
**Target File:** `src/components/DiscoveryTab.tsx`
**Goal:** Fix the bug where clicking a Trending Stock (e.g., AMD) opens the wrong modal (Google).

**Instructions:**
1.  Locate `handleStockClick(ticker)`.
2.  **Bug Fix:** The current logic might be defaulting to `selectDiscoveryStock` with a hardcoded value or finding the wrong index.
3.  **Logic Update:**
    * Search for the ticker in `data.discovery.trendingLogics` (flatten the `relatedStocksDetails` array).
    * OR search in `data.discovery.searchResults`.
    * Ensure the `selectedStock` state in the store is updated with the *clicked* stock's data, not a default one.

---

## ✅ Task 4: Implement "Uninvested View" in Detail Modal
**Target File:** `src/components/StockDetailModal.tsx`
**Goal:** Distinguish between "My Stocks" (Management Mode) and "New Stocks" (Discovery Mode).

**Instructions:**
1.  Inside the component, check if the current `stock` exists in `data.myThesis`.
    * `const isMyThesis = data.myThesis.some(t => t.ticker === stock.ticker);`
2.  **Conditional Rendering:**
    * **IF `isMyThesis` is TRUE:** Show the current view (Logic Health, Event Prediction, etc.).
    * **IF `isMyThesis` is FALSE:**
        * **Hide:** "Logic Health" section and "Event Action" cards.
        * **Show:** Only Chart, Company Profile, and News.
        * **Add CTA:** Render a prominent button at the bottom: **"이 종목으로 투자 가설 세우기"**.
3.  **Button Action:** Clicking the CTA should trigger `onAddLogic` (or the callback that opens `HypothesisBuilder`).

## ✅ Task 5: Redesign Event Response Logic (Pre/Post Flow)
**Target File:** `src/components/StockDetailModal.tsx`
**Goal:** Replace the static prediction card with a time-based interaction flow (Scenario Planning → Result Briefing).

**Instructions:**
1.  **Locate Component:** Find the `EventActionCard` component (or the section rendering event actions).
2.  **Add State Logic:**
    * Check `event.status` to distinguish between `'Upcoming'` (Pre-Event) and `'Completed'` (Post-Event).
3.  **Implement 'Pre-Event' View (Scenario Planner):**
    * **Condition:** If `status === 'Upcoming'`
    * **UI:** Display a "Strategy Builder" instead of simple Up/Down buttons.
    * **Inputs:** Add a simple selector or toggle: "If result is [Good/Bad], I will [Buy/Hold/Sell]".
    * **Action:** Add a "Save Strategy" button (mock functionality is fine).
4.  **Implement 'Post-Event' View (Briefing & Execution):**
    * **Condition:** If `status === 'Completed'`
    * **UI:** Display a "Result Briefing" card.
    * **Content:** Show "Actual vs Consensus" data (e.g., "EPS: Beat by 10%").
    * **Strategy Recall:** Display the user's saved strategy from the Pre-Event phase (e.g., "You planned to Buy").
    * **Actions:** Add two buttons: "Execute Plan" (Primary) and "Revise Plan" (Secondary).