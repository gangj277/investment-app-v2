import { Thesis, LogicHealth } from '../types';

// --- CONSTANTS ---
const BASE_SCORE = 50;
const SCORE_PASS = 10;   // Hypothesis confirmed
const SCORE_FAIL = -15;  // Hypothesis broken (Penalty is higher)
const ACTION_BUY = 5;    // User showed confidence
const ACTION_SELL = -5;  // User reduced position

// --- TYPES ---
export interface LogicHealthResult {
  score: number;
  status: 'Good' | 'Warning' | 'Danger';
}

/**
 * Calculates the Logic Health Score based on events and user actions.
 */
export const calculateLogicHealth = (thesis: Thesis): LogicHealthResult => {
  let currentScore = BASE_SCORE;

  if (thesis.events && thesis.events.length > 0) {
    thesis.events.forEach((event) => {
      // 1. Evaluate Checkpoints (Verification)
      if (event.checkpoints && event.checkpoints.length > 0) {
        event.checkpoints.forEach((cp) => {
          if (cp.status === 'Pass') {
            currentScore += SCORE_PASS;
          } else if (cp.status === 'Fail') {
            currentScore += SCORE_FAIL;
          }
        });
      }

      // 2. Evaluate User Actions (Confidence)
      if (event.myActionHistory) {
        const decision = event.myActionHistory.decision;
        if (decision === 'buy') {
          currentScore += ACTION_BUY;
        } else if (decision === 'sell') {
          currentScore += ACTION_SELL;
        }
      }
    });
  }

  // 3. Clamp Score (0 ~ 100)
  currentScore = Math.max(0, Math.min(100, currentScore));

  // 4. Determine Status
  let status: 'Good' | 'Warning' | 'Danger';
  if (currentScore > 70) {
    status = 'Good';
  } else if (currentScore >= 40) {
    status = 'Warning';
  } else {
    status = 'Danger';
  }

  return { score: currentScore, status };
};

/**
 * Updates the thesis logicHealth properly.
 */
export const updateThesisHealth = (thesis: Thesis): Thesis => {
  const result = calculateLogicHealth(thesis);
  
  const updatedHealth: LogicHealth = {
    ...thesis.logicHealth,
    score: result.score,
    status: result.status,
  };

  return {
    ...thesis,
    logicHealth: updatedHealth
  };
};