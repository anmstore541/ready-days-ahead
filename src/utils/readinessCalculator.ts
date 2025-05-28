
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  daysSupply: number;
}

interface HouseholdData {
  householdSize: number;
  adultsCount: number;
  childrenCount: number;
  petsCount: number;
  zipCode: string;
  hazardProfile: string;
  hasEmergencyPlan: boolean;
}

interface ReadinessResult {
  overallScore: number;
  daysOfSurvival: number;
  categoryBreakdown: {
    [category: string]: {
      daysSupply: number;
      targetDays: number;
      score: number;
      shortfall: number;
    };
  };
  topGaps: Array<{
    category: string;
    shortfall: number;
    priority: number;
  }>;
}

// FEMA baseline requirements (days of supply needed)
const BASELINE_REQUIREMENTS = {
  water: 3, // 3 days minimum
  food: 3, // 3 days minimum
  medical: 7, // Week of medications
  tools: 3, // Basic tools and communication
  shelter: 3, // Blankets, warmth, shelter
};

// Hazard multipliers - some disasters require longer preparation
const HAZARD_MULTIPLIERS = {
  wildfire: 1.5, // Evacuations can be extended
  hurricane: 1.8, // Power outages can last weeks
  earthquake: 1.3, // Infrastructure damage
  tornado: 1.2, // Usually shorter duration
  flood: 1.4, // Can isolate communities
  winter: 1.6, // Can strand people for days
  general: 1.0, // Standard preparedness
};

// Category weights for overall score calculation
const CATEGORY_WEIGHTS = {
  water: 0.35, // Most critical
  food: 0.30, // Very important
  medical: 0.20, // Important for vulnerable populations
  tools: 0.10, // Supporting category
  shelter: 0.05, // Supporting category
};

export function calculateReadiness(
  inventory: InventoryItem[],
  household: HouseholdData
): ReadinessResult {
  const hazardMultiplier = HAZARD_MULTIPLIERS[household.hazardProfile as keyof typeof HAZARD_MULTIPLIERS] || 1.0;
  
  // Calculate target days for each category based on household and hazard
  const targetDays = Object.fromEntries(
    Object.entries(BASELINE_REQUIREMENTS).map(([category, baseDays]) => [
      category,
      baseDays * hazardMultiplier * (household.hasEmergencyPlan ? 0.9 : 1.1) // Plan reduces requirements slightly
    ])
  );

  // Group inventory by category and calculate total days supply
  const categorySupply = inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    // Adjust for household size - most supplies are per person
    const adjustedSupply = item.category === 'tools' || item.category === 'shelter' 
      ? item.daysSupply // These are household items
      : item.daysSupply / household.householdSize; // These are per-person items
    
    acc[item.category] += adjustedSupply;
    return acc;
  }, {} as { [category: string]: number });

  // Calculate breakdown for each category
  const categoryBreakdown = Object.fromEntries(
    Object.entries(BASELINE_REQUIREMENTS).map(([category, _]) => {
      const daysSupply = categorySupply[category] || 0;
      const target = targetDays[category];
      const score = Math.min(100, (daysSupply / target) * 100);
      const shortfall = Math.max(0, target - daysSupply);
      
      return [category, {
        daysSupply,
        targetDays: target,
        score,
        shortfall
      }];
    })
  );

  // Calculate overall weighted score
  const overallScore = Object.entries(categoryBreakdown).reduce((acc, [category, data]) => {
    const weight = CATEGORY_WEIGHTS[category as keyof typeof CATEGORY_WEIGHTS] || 0;
    return acc + (data.score * weight);
  }, 0);

  // Calculate minimum days of survival (bottleneck)
  const daysOfSurvival = Math.min(
    ...Object.values(categoryBreakdown).map(data => data.daysSupply)
  );

  // Identify top gaps for priority action
  const topGaps = Object.entries(categoryBreakdown)
    .filter(([_, data]) => data.shortfall > 0)
    .map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      shortfall: data.shortfall,
      priority: data.shortfall * (CATEGORY_WEIGHTS[category as keyof typeof CATEGORY_WEIGHTS] || 0)
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  return {
    overallScore: Math.round(overallScore),
    daysOfSurvival,
    categoryBreakdown,
    topGaps
  };
}

// Helper function to get supply recommendations based on gaps
export function getSupplyRecommendations(
  gaps: Array<{ category: string; shortfall: number }>,
  householdSize: number
): Array<{ category: string; item: string; quantity: number; unit: string; priority: 'high' | 'medium' | 'low' }> {
  const recommendations = [];

  for (const gap of gaps) {
    const category = gap.category.toLowerCase();
    const shortfall = gap.shortfall;

    switch (category) {
      case 'water':
        recommendations.push({
          category,
          item: 'Water (drinking)',
          quantity: Math.ceil(shortfall * householdSize),
          unit: 'gallons',
          priority: 'high' as const
        });
        break;
      
      case 'food':
        recommendations.push({
          category,
          item: 'Canned food (ready-to-eat)',
          quantity: Math.ceil(shortfall * householdSize * 2),
          unit: 'cans',
          priority: 'high' as const
        });
        break;
      
      case 'medical':
        recommendations.push({
          category,
          item: 'First aid kit',
          quantity: 1,
          unit: 'kit',
          priority: 'medium' as const
        });
        break;
      
      case 'tools':
        recommendations.push({
          category,
          item: 'Flashlight with batteries',
          quantity: Math.ceil(householdSize / 2),
          unit: 'flashlights',
          priority: 'medium' as const
        });
        break;
      
      case 'shelter':
        recommendations.push({
          category,
          item: 'Emergency blankets',
          quantity: householdSize,
          unit: 'blankets',
          priority: 'low' as const
        });
        break;
    }
  }

  return recommendations;
}
