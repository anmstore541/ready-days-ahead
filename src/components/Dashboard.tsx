
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
    if (score >= 75) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getReadinessMessage = (days: number) => {
    if (days >= 3) return 'Well Prepared';
    if (days >= 1) return 'Partially Ready';
    return 'Needs Attention';
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-md mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-olive-500 mr-2" />
            <h1 className="text-2xl font-bold text-white">ReadyScore</h1>
          </div>
          <p className="text-slate-400">Emergency Preparedness Tracker</p>
        </div>

        {/* Readiness Meter */}
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#374151"
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
                    className={`transition-all duration-1000 ${getProgressColor(readinessScore)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getReadinessColor(readinessScore)}`}>
                      {Math.round(readinessScore)}%
                    </div>
                    <div className="text-xs text-slate-400">Ready</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold ${getReadinessColor(readinessScore)}`}>
                {getReadinessMessage(daysOfSurvival)}
              </h3>
              <p className="text-white">
                <span className="font-bold text-xl">{daysOfSurvival.toFixed(1)}</span> days of supplies
              </p>
              <p className="text-sm text-slate-400">
                for {householdSize} {householdSize === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>
        </Card>

        {/* Top Gaps */}
        {topGaps.length > 0 && (
          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
              <h3 className="font-semibold text-white">Priority Gaps</h3>
            </div>
            <div className="space-y-2">
              {topGaps.slice(0, 3).map((gap, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <span className="text-sm font-medium text-white">{gap.category}</span>
                  <span className="text-sm text-red-400 font-medium">
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
            className="w-full bg-olive-600 hover:bg-olive-700 text-white py-6 text-lg font-semibold border-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Supplies
          </Button>
          
          <Button 
            onClick={onViewInventory}
            variant="outline"
            className="w-full border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:border-slate-500 py-4"
          >
            View Full Inventory
          </Button>
        </div>

        {/* Quick Tips */}
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h4 className="font-semibold text-white mb-2">Quick Tip</h4>
          <p className="text-sm text-slate-400">
            FEMA recommends at least 3 days of supplies. Focus on water (1 gallon per person per day) and non-perishable food first.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
