import { createHipModelFromAnswers, renderHip } from './hip.js';

/**
 * @param {object} answers - calibration answers from prompts.js
 * @returns {string} - HIP.md file content
 */
export function generateHip({ role, fluency, intent, autonomy, explanation, risk, boundaries, done }) {
  return renderHip(createHipModelFromAnswers({ role, fluency, intent, autonomy, explanation, risk, boundaries, done }));
}
