// Cost tracking utility for AI API usage
export class AICostTracker {
  private static instance: AICostTracker;
  private dailyCosts: Map<string, number> = new Map();
  private monthlyCosts: Map<string, number> = new Map();

  private constructor() {
    // Load existing costs from localStorage if available
    this.loadCosts();
  }

  static getInstance(): AICostTracker {
    if (!AICostTracker.instance) {
      AICostTracker.instance = new AICostTracker();
    }
    return AICostTracker.instance;
  }

  // Track API cost
  trackCost(operation: string, cost: number): void {
    const today = new Date().toISOString().split('T')[0];
    const month = new Date().toISOString().substring(0, 7); // YYYY-MM

    // Update daily costs
    const dailyKey = `${today}:${operation}`;
    const currentDaily = this.dailyCosts.get(dailyKey) || 0;
    this.dailyCosts.set(dailyKey, currentDaily + cost);

    // Update monthly costs
    const monthlyKey = `${month}:${operation}`;
    const currentMonthly = this.monthlyCosts.get(monthlyKey) || 0;
    this.monthlyCosts.set(monthlyKey, currentMonthly + cost);

    // Save to localStorage
    this.saveCosts();
  }

  // Get daily cost
  getDailyCost(date?: string): number {
    const targetDate = date || new Date().toISOString().split('T')[0];
    let total = 0;

    for (const [key, cost] of this.dailyCosts.entries()) {
      if (key.startsWith(targetDate)) {
        total += cost;
      }
    }

    return total;
  }

  // Get monthly cost
  getMonthlyCost(month?: string): number {
    const targetMonth = month || new Date().toISOString().substring(0, 7);
    let total = 0;

    for (const [key, cost] of this.monthlyCosts.entries()) {
      if (key.startsWith(targetMonth)) {
        total += cost;
      }
    }

    return total;
  }

  // Get cost by operation
  getCostByOperation(operation: string, period: 'daily' | 'monthly' = 'daily'): number {
    const targetDate = period === 'daily' 
      ? new Date().toISOString().split('T')[0]
      : new Date().toISOString().substring(0, 7);
    
    const costs = period === 'daily' ? this.dailyCosts : this.monthlyCosts;
    let total = 0;

    for (const [key, cost] of costs.entries()) {
      if (key.startsWith(targetDate) && key.endsWith(`:${operation}`)) {
        total += cost;
      }
    }

    return total;
  }

  // Get cost breakdown
  getCostBreakdown(period: 'daily' | 'monthly' = 'daily'): Record<string, number> {
    const targetDate = period === 'daily' 
      ? new Date().toISOString().split('T')[0]
      : new Date().toISOString().substring(0, 7);
    
    const costs = period === 'daily' ? this.dailyCosts : this.monthlyCosts;
    const breakdown: Record<string, number> = {};

    for (const [key, cost] of costs.entries()) {
      if (key.startsWith(targetDate)) {
        const operation = key.split(':').slice(2).join(':'); // Handle operations with colons
        breakdown[operation] = (breakdown[operation] || 0) + cost;
      }
    }

    return breakdown;
  }

  // Check if daily limit is exceeded
  isDailyLimitExceeded(limit: number = 10): boolean {
    return this.getDailyCost() > limit;
  }

  // Check if monthly limit is exceeded
  isMonthlyLimitExceeded(limit: number = 100): boolean {
    return this.getMonthlyCost() > limit;
  }

  // Get cost statistics
  getCostStats(): {
    daily: {
      total: number;
      breakdown: Record<string, number>;
      limitExceeded: boolean;
    };
    monthly: {
      total: number;
      breakdown: Record<string, number>;
      limitExceeded: boolean;
    };
  } {
    return {
      daily: {
        total: this.getDailyCost(),
        breakdown: this.getCostBreakdown('daily'),
        limitExceeded: this.isDailyLimitExceeded()
      },
      monthly: {
        total: this.getMonthlyCost(),
        breakdown: this.getCostBreakdown('monthly'),
        limitExceeded: this.isMonthlyLimitExceeded()
      }
    };
  }

  // Reset costs (for testing or manual reset)
  resetCosts(): void {
    this.dailyCosts.clear();
    this.monthlyCosts.clear();
    this.saveCosts();
  }

  // Load costs from localStorage
  private loadCosts(): void {
    if (typeof window === 'undefined') return;

    try {
      const dailyData = localStorage.getItem('ai_daily_costs');
      const monthlyData = localStorage.getItem('ai_monthly_costs');

      if (dailyData) {
        this.dailyCosts = new Map(JSON.parse(dailyData));
      }
      if (monthlyData) {
        this.monthlyCosts = new Map(JSON.parse(monthlyData));
      }
    } catch (error) {
      console.error('Failed to load AI costs:', error);
    }
  }

  // Save costs to localStorage
  private saveCosts(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('ai_daily_costs', JSON.stringify([...this.dailyCosts]));
      localStorage.setItem('ai_monthly_costs', JSON.stringify([...this.monthlyCosts]));
    } catch (error) {
      console.error('Failed to save AI costs:', error);
    }
  }
}

// Export singleton instance
export const aiCostTracker = AICostTracker.getInstance();

// Cost calculation helpers
export const calculateCost = {
  // GPT-4o-mini cost calculation
  gpt4oMini: (tokens: number): number => {
    return (tokens / 1000) * 0.00015; // $0.15 per 1M tokens
  },

  // DALL-E 3 cost calculation
  dalle3: (images: number): number => {
    return images * 0.04; // $0.04 per image
  },

  // Estimate tokens from text (rough approximation)
  estimateTokens: (text: string): number => {
    return Math.ceil(text.length / 4); // Rough estimate: 4 characters per token
  }
};
