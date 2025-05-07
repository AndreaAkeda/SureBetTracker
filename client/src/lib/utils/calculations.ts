/**
 * Calculate the optimal stakes and profit for an arbitrage opportunity
 * @param odds1 - The odds for the first outcome
 * @param odds2 - The odds for the second outcome
 * @param totalStake - The total amount to be staked
 * @returns Calculation result with profit and stakes
 */
export function calculateArbitrageProfits(odds1: number, odds2: number, totalStake: number) {
  // Calculate implied probabilities
  const impliedProb1 = 1 / odds1;
  const impliedProb2 = 1 / odds2;
  const totalImpliedProb = impliedProb1 + impliedProb2;

  // Check if there's an arbitrage opportunity (total implied probability < 1)
  const isArbitrageOpportunity = totalImpliedProb < 1;

  // Calculate the optimal stakes
  const stake1 = totalStake * (impliedProb1 / totalImpliedProb);
  const stake2 = totalStake * (impliedProb2 / totalImpliedProb);

  // Calculate the profit
  let profit, profitPercent;

  if (isArbitrageOpportunity) {
    profit = (stake1 * odds1) - totalStake;
    profitPercent = (profit / totalStake) * 100;
  } else {
    // No arbitrage opportunity, so there will be a loss
    profit = (stake1 * odds1) - totalStake;
    profitPercent = (profit / totalStake) * 100;
  }

  return {
    profit: Number(profit.toFixed(2)),
    profitPercent: Number(profitPercent.toFixed(2)),
    stake1: Number(stake1.toFixed(2)),
    stake2: Number(stake2.toFixed(2)),
    isArbitrageOpportunity
  };
}

/**
 * Format currency for display
 * @param amount - The amount to format
 * @param currency - The currency symbol (default: €)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "€"): string {
  return `${currency}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Format percentage for display
 * @param percent - The percentage value
 * @returns Formatted percentage string
 */
export function formatPercentage(percent: number): string {
  return `${percent.toFixed(1)}%`;
}
