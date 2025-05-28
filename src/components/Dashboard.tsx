
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Plus } from 'lucide-react';

interface DashboardProps {
  readinessScore: number;
  daysOfSurvival: number;
  householdSize: number;
  topGaps: Array<{ category: string; shortfall: number }>;
  onAddSupplies: () => void;
  onViewInventory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  readinessScore,
  daysOfSurvival,
  householdSize,
  topGaps,
  onAddSupplies,
  onViewInventory
}) => {
  const getReadinessColor = (score: number) => {
    if (score >= 75) return 'text-ready';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  const getReadinessMessage = (days: number) => {
    if (days >= 3) return 'Well Prepared';
    if (days >= 1) return 'Partially Ready';
    return 'Needs Attention';
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-ready';
    if (score >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-olive-600 mr-2" />
            <h1 className="text-2xl font-bold text-foreground">ReadyScore</h1>
          </div>
          <p className="text-muted-foreground">Emergency Preparedness Tracker</p>
        </div>

        {/* Readiness Meter */}
        <Card className="p-6 bg-card border-border">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - readinessScore / 100)}`}
                    className={`transition-all duration-1000 ${
                      readinessScore >= 75 ? 'text-ready' : 
                      readinessScore >= 50 ? 'text-warning' : 'text-danger'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getReadinessColor(readinessScore)}`}>
                      {Math.round(readinessScore)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Ready</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold ${getReadinessColor(readinessScore)}`}>
                {getReadinessMessage(daysOfSurvival)}
              </h3>
              <p className="text-foreground">
                <span className="font-bold text-xl">{daysOfSurvival.toFixed(1)}</span> days of supplies
              </p>
              <p className="text-sm text-muted-foreground">
                for {householdSize} {householdSize === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>
        </Card>

        {/* Top Gaps */}
        {topGaps.length > 0 && (
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-safety-500 mr-2" />
              <h3 className="font-semibold text-foreground">Priority Gaps</h3>
            </div>
            <div className="space-y-2">
              {topGaps.slice(0, 3).map((gap, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">{gap.category}</span>
                  <span className="text-sm text-safety-600 font-medium">
                    {gap.shortfall.toFixed(1)} days short
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onAddSupplies}
            className="w-full bg-safety-500 hover:bg-safety-600 text-white py-6 text-lg font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Supplies
          </Button>
          
          <Button 
            onClick={onViewInventory}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-muted py-4"
          >
            View Full Inventory
          </Button>
        </div>

        {/* Quick Tips */}
        <Card className="p-4 bg-card border-border">
          <h4 className="font-semibold text-foreground mb-2">Quick Tip</h4>
          <p className="text-sm text-muted-foreground">
            FEMA recommends at least 3 days of supplies. Focus on water (1 gallon per person per day) and non-perishable food first.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
