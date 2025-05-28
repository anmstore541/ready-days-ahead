
import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import OnboardingWizard from '@/components/OnboardingWizard';
import InventoryTracker from '@/components/InventoryTracker';
import { calculateReadiness } from '@/utils/readinessCalculator';

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

const Index = () => {
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard' | 'inventory'>('onboarding');
  const [householdData, setHouseholdData] = useState<HouseholdData | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHousehold = localStorage.getItem('readyscore-household');
    const savedInventory = localStorage.getItem('readyscore-inventory');
    
    if (savedHousehold) {
      const household = JSON.parse(savedHousehold);
      setHouseholdData(household);
      setCurrentView('dashboard');
    }
    
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  // Save data to localStorage when changed
  useEffect(() => {
    if (householdData) {
      localStorage.setItem('readyscore-household', JSON.stringify(householdData));
    }
  }, [householdData]);

  useEffect(() => {
    localStorage.setItem('readyscore-inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleOnboardingComplete = (data: HouseholdData) => {
    console.log('Onboarding completed:', data);
    setHouseholdData(data);
    setCurrentView('dashboard');
  };

  const handleAddItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    console.log('Adding item:', newItem);
    setInventory(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<InventoryItem>) => {
    console.log('Updating item:', id, updates);
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    console.log('Deleting item:', id);
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  // Calculate readiness if we have household data
  const readinessData = householdData ? calculateReadiness(inventory, householdData) : null;

  console.log('Current view:', currentView);
  console.log('Household data:', householdData);
  console.log('Inventory:', inventory);
  console.log('Readiness data:', readinessData);

  if (currentView === 'onboarding') {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (currentView === 'inventory') {
    return (
      <InventoryTracker
        items={inventory}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'dashboard' && householdData && readinessData) {
    return (
      <Dashboard
        readinessScore={readinessData.overallScore}
        daysOfSurvival={readinessData.daysOfSurvival}
        householdSize={householdData.householdSize}
        topGaps={readinessData.topGaps}
        onAddSupplies={() => setCurrentView('inventory')}
        onViewInventory={() => setCurrentView('inventory')}
      />
    );
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-olive-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-olive-800 mb-4">ReadyScore</h1>
        <p className="text-olive-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
