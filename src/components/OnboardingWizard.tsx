import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, MapPin, CheckCircle, Package, Droplets, Utensils, Plus, Wrench } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  daysSupply: number;
}

interface OnboardingData {
  householdSize: number;
  adultsCount: number;
  childrenCount: number;
  petsCount: number;
  zipCode: string;
  hazardProfile: string;
  hasEmergencyPlan: boolean;
  inventory: InventoryItem[];
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    householdSize: 1,
    adultsCount: 1,
    childrenCount: 0,
    petsCount: 0,
    zipCode: '',
    hazardProfile: '',
    hasEmergencyPlan: false,
    inventory: []
  });

  const [currentCategory, setCurrentCategory] = useState(0);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    unit: ''
  });

  const hazardTypes = [
    { value: 'wildfire', label: 'Wildfire Risk' },
    { value: 'hurricane', label: 'Hurricane Risk' },
    { value: 'earthquake', label: 'Earthquake Risk' },
    { value: 'tornado', label: 'Tornado Risk' },
    { value: 'flood', label: 'Flood Risk' },
    { value: 'winter', label: 'Winter Storms' },
    { value: 'general', label: 'General Preparedness' }
  ];

  const inventoryCategories = [
    {
      id: 'water',
      name: 'Water & Food',
      icon: Droplets,
      items: [
        { name: 'Drinking Water', unit: 'gallons', daysPerUnit: 1 },
        { name: 'Water Bottles', unit: 'bottles', daysPerUnit: 0.125 },
        { name: 'Water Purification Tablets', unit: 'tablets', daysPerUnit: 0.1 },
        { name: 'Ready-to-eat meats', unit: 'cans', daysPerUnit: 0.5 },
        { name: 'Canned fruits and vegetables', unit: 'cans', daysPerUnit: 0.33 },
        { name: 'Canned or boxed juices', unit: 'containers', daysPerUnit: 0.25 },
        { name: 'Canned milk and soup', unit: 'cans', daysPerUnit: 0.5 },
        { name: 'Peanut butter', unit: 'jars', daysPerUnit: 3 },
        { name: 'Jelly', unit: 'jars', daysPerUnit: 2 },
        { name: 'Low-sodium crackers', unit: 'boxes', daysPerUnit: 1 },
        { name: 'Granola bars', unit: 'bars', daysPerUnit: 0.25 },
        { name: 'Trail mix', unit: 'bags', daysPerUnit: 1 },
        { name: 'Vitamins', unit: 'bottles', daysPerUnit: 30 },
        { name: 'Special foods for infants', unit: 'jars', daysPerUnit: 0.33 },
        { name: 'Cookies', unit: 'packages', daysPerUnit: 1 },
        { name: 'Hard candy', unit: 'bags', daysPerUnit: 2 },
        { name: 'Instant coffee', unit: 'jars', daysPerUnit: 10 },
        { name: 'Cereals', unit: 'boxes', daysPerUnit: 2 },
        { name: 'Powdered milk', unit: 'containers', daysPerUnit: 5 },
        { name: 'Dry Rice', unit: 'pounds', daysPerUnit: 2 },
        { name: 'Pasta', unit: 'pounds', daysPerUnit: 2 }
      ]
    },
    {
      id: 'medical',
      name: 'Medical Supplies',
      icon: Shield,
      items: [
        { name: 'Adhesive bandages, various sizes', unit: 'boxes', daysPerUnit: 30 },
        { name: '5" x 9" sterile dressing', unit: 'pieces', daysPerUnit: 10 },
        { name: 'Conforming roller gauze bandage', unit: 'rolls', daysPerUnit: 15 },
        { name: 'Triangular bandages', unit: 'pieces', daysPerUnit: 20 },
        { name: '3" x 3" sterile gauze pads', unit: 'pads', daysPerUnit: 5 },
        { name: '4" x 4" sterile gauze pads', unit: 'pads', daysPerUnit: 5 },
        { name: 'Roll 3" cohesive bandage', unit: 'rolls', daysPerUnit: 15 },
        { name: 'Germicidal hand wipes', unit: 'packages', daysPerUnit: 10 },
        { name: 'Alcohol-based hand sanitizer', unit: 'bottles', daysPerUnit: 15 },
        { name: 'Antiseptic wipes', unit: 'packages', daysPerUnit: 10 },
        { name: 'Medical grade non-latex gloves', unit: 'pairs', daysPerUnit: 2 },
        { name: 'Tongue depressor blades', unit: 'pieces', daysPerUnit: 1 },
        { name: 'Adhesive tape, 2" width', unit: 'rolls', daysPerUnit: 20 },
        { name: 'Antibacterial ointment', unit: 'tubes', daysPerUnit: 30 },
        { name: 'Cold pack', unit: 'packs', daysPerUnit: 10 },
        { name: 'Small scissors', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Tweezers', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Safety pins, assorted sizes', unit: 'packages', daysPerUnit: 180 },
        { name: 'Cotton balls', unit: 'bags', daysPerUnit: 30 },
        { name: 'Thermometer', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Petroleum jelly', unit: 'tubes', daysPerUnit: 60 },
        { name: 'Sunscreen', unit: 'bottles', daysPerUnit: 30 },
        { name: 'CPR breathing barrier/face shield', unit: 'pieces', daysPerUnit: 365 },
        { name: 'First aid manual', unit: 'books', daysPerUnit: 365 },
        { name: 'Aspirin', unit: 'bottles', daysPerUnit: 60 },
        { name: 'Non-aspirin pain reliever', unit: 'bottles', daysPerUnit: 60 },
        { name: 'Anti-diarrhea medication', unit: 'packages', daysPerUnit: 30 },
        { name: 'Antacid', unit: 'bottles', daysPerUnit: 30 },
        { name: 'Laxative', unit: 'packages', daysPerUnit: 30 },
        { name: 'Prescription medications', unit: 'days', daysPerUnit: 1 },
        { name: 'Extra eyeglasses/contact lenses', unit: 'pairs', daysPerUnit: 365 }
      ]
    },
    {
      id: 'tools',
      name: 'Tools & Gear',
      icon: Wrench,
      items: [
        { name: 'Portable battery-powered radio', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Extra batteries for radio', unit: 'packs', daysPerUnit: 30 },
        { name: 'Manual can opener', unit: 'pieces', daysPerUnit: 365 },
        { name: 'NOAA Weather Radio', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Mess kits', unit: 'sets', daysPerUnit: 365 },
        { name: 'Paper cups and plates', unit: 'packages', daysPerUnit: 7 },
        { name: 'Plastic utensils', unit: 'packages', daysPerUnit: 7 },
        { name: 'Flashlight', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Extra batteries for flashlight', unit: 'packs', daysPerUnit: 30 },
        { name: 'All-purpose knife', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Signal flare', unit: 'pieces', daysPerUnit: 30 },
        { name: 'Waterproof matches', unit: 'boxes', daysPerUnit: 30 },
        { name: 'Sugar, salt, pepper', unit: 'containers', daysPerUnit: 60 },
        { name: 'Shut-off wrench', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Pliers', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Shovel', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Aluminum foil', unit: 'rolls', daysPerUnit: 30 },
        { name: 'Plastic wrap', unit: 'rolls', daysPerUnit: 30 },
        { name: 'Duct tape', unit: 'rolls', daysPerUnit: 60 },
        { name: 'Resealable plastic bags', unit: 'boxes', daysPerUnit: 30 },
        { name: 'Plastic sheeting', unit: 'sheets', daysPerUnit: 180 },
        { name: 'Small cooking stove', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Cooking fuel', unit: 'cans', daysPerUnit: 10 },
        { name: 'Whistle', unit: 'pieces', daysPerUnit: 365 },
        { name: 'ABC-type fire extinguisher', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Tube tent', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Games and cards', unit: 'sets', daysPerUnit: 365 },
        { name: 'Compass', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Work gloves', unit: 'pairs', daysPerUnit: 180 },
        { name: 'Books', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Paper, pens, and pencils', unit: 'sets', daysPerUnit: 180 },
        { name: 'Toys for kids', unit: 'pieces', daysPerUnit: 365 },
        { name: 'Needles and thread', unit: 'kits', daysPerUnit: 365 },
        { name: 'Battery-operated alarm clock', unit: 'pieces', daysPerUnit: 365 }
      ]
    }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Move to inventory collection
      setStep(5);
      setCurrentCategory(0);
    } else if (step === 5) {
      // Check if we're done with all categories
      if (currentCategory < inventoryCategories.length - 1) {
        setCurrentCategory(currentCategory + 1);
        setNewItem({ name: '', quantity: 0, unit: '' });
      } else {
        onComplete(formData);
      }
    }
  };

  const handleBack = () => {
    if (step === 5 && currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    } else if (step > 1) {
      if (step === 5) {
        setStep(4);
      } else {
        setStep(step - 1);
      }
    }
  };

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      householdSize: (updates.adultsCount ?? prev.adultsCount) + (updates.childrenCount ?? prev.childrenCount)
    }));
  };

  const addInventoryItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      const category = inventoryCategories[currentCategory];
      const preset = category.items.find(item => item.name === newItem.name);
      const daysSupply = newItem.quantity * (preset?.daysPerUnit || 1);

      const item: InventoryItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: newItem.name,
        category: category.id,
        quantity: newItem.quantity,
        unit: newItem.unit,
        daysSupply
      };

      setFormData(prev => ({
        ...prev,
        inventory: [...prev.inventory, item]
      }));

      setNewItem({ name: '', quantity: 0, unit: '' });
    }
  };

  const removeInventoryItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      inventory: prev.inventory.filter(item => item.id !== id)
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.adultsCount > 0;
      case 2:
        return formData.zipCode.length === 5;
      case 3:
        return formData.hazardProfile !== '';
      case 4:
        return true;
      case 5:
        return true; // Can always proceed from inventory
      default:
        return false;
    }
  };

  const getCategoryItems = () => {
    return formData.inventory.filter(item => item.category === inventoryCategories[currentCategory]?.id);
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-olive-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">ReadyScore</h1>
            <p className="text-muted-foreground">Get Ready in 90 Seconds</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {step === 5 ? `5.${currentCategory + 1}` : step} of {step === 5 ? `5.${inventoryCategories.length}` : '5'}</span>
            <span>{Math.round(((step === 5 ? 4 + (currentCategory + 1) / inventoryCategories.length : step) / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-olive-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step === 5 ? 4 + (currentCategory + 1) / inventoryCategories.length : step) / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6 bg-card border-border">
          {/* Step 1: Household Size */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Users className="h-12 w-12 text-olive-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Tell us about your household
                </h2>
                <p className="text-muted-foreground">
                  This helps us calculate your supply needs accurately
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="adults" className="text-foreground font-medium">
                    Adults (18+)
                  </Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.adultsCount}
                    onChange={(e) => updateFormData({ adultsCount: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="children" className="text-foreground font-medium">
                    Children (under 18)
                  </Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.childrenCount}
                    onChange={(e) => updateFormData({ childrenCount: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="pets" className="text-foreground font-medium">
                    Pets
                  </Label>
                  <Input
                    id="pets"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.petsCount}
                    onChange={(e) => updateFormData({ petsCount: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">
                    Total: {formData.householdSize} {formData.householdSize === 1 ? 'person' : 'people'}
                    {formData.petsCount > 0 && ` + ${formData.petsCount} ${formData.petsCount === 1 ? 'pet' : 'pets'}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-olive-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Where are you located?
                </h2>
                <p className="text-muted-foreground">
                  We'll identify local hazards and customize recommendations
                </p>
              </div>

              <div>
                <Label htmlFor="zipcode" className="text-foreground font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zipcode"
                  type="text"
                  maxLength={5}
                  placeholder="12345"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData({ zipCode: e.target.value.replace(/\D/g, '') })}
                  className="mt-1 text-lg text-center"
                />
              </div>
            </div>
          )}

          {/* Step 3: Hazard Profile */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-12 w-12 bg-safety-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-safety-600 text-xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  What's your main concern?
                </h2>
                <p className="text-muted-foreground">
                  Select the primary hazard in your area
                </p>
              </div>

              <div>
                <Label className="text-foreground font-medium">Primary Hazard</Label>
                <Select value={formData.hazardProfile} onValueChange={(value) => updateFormData({ hazardProfile: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a hazard type" />
                  </SelectTrigger>
                  <SelectContent>
                    {hazardTypes.map((hazard) => (
                      <SelectItem key={hazard.value} value={hazard.value}>
                        {hazard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Emergency Plan */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-olive-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Emergency plan status
                </h2>
                <p className="text-muted-foreground">
                  Do you have a family emergency plan?
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant={formData.hasEmergencyPlan ? "default" : "outline"}
                  className={`w-full justify-start ${
                    formData.hasEmergencyPlan 
                      ? 'bg-olive-600 hover:bg-olive-700' 
                      : 'border-border text-foreground hover:bg-muted'
                  }`}
                  onClick={() => updateFormData({ hasEmergencyPlan: true })}
                >
                  ✅ Yes, we have a plan
                </Button>
                <Button
                  variant={!formData.hasEmergencyPlan ? "default" : "outline"}
                  className={`w-full justify-start ${
                    !formData.hasEmergencyPlan 
                      ? 'bg-olive-600 hover:bg-olive-700' 
                      : 'border-border text-foreground hover:bg-muted'
                  }`}
                  onClick={() => updateFormData({ hasEmergencyPlan: false })}
                >
                  📝 Not yet, need help with this
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Inventory Collection */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                {React.createElement(inventoryCategories[currentCategory].icon, {
                  className: "h-12 w-12 text-olive-600 mx-auto mb-3"
                })}
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {inventoryCategories[currentCategory].name}
                </h2>
                <p className="text-muted-foreground">
                  Add your current {inventoryCategories[currentCategory].name.toLowerCase()} supplies
                </p>
              </div>

              {/* Current Category Items */}
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {getCategoryItems().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} {item.unit}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInventoryItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Item Form */}
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <h3 className="font-medium text-foreground">Add Supply</h3>
                
                <div>
                  <Label className="text-foreground">Item</Label>
                  <Select
                    value={newItem.name}
                    onValueChange={(value) => {
                      const preset = inventoryCategories[currentCategory].items.find(item => item.name === value);
                      setNewItem({
                        ...newItem,
                        name: value,
                        unit: preset?.unit || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {inventoryCategories[currentCategory].items.map((item) => (
                        <SelectItem key={item.name} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-foreground">Quantity</Label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Unit</Label>
                    <Input
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      placeholder="units"
                    />
                  </div>
                </div>

                <Button
                  onClick={addInventoryItem}
                  disabled={!newItem.name || newItem.quantity <= 0}
                  className="w-full bg-safety-500 hover:bg-safety-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supply
                </Button>
              </div>

              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Category {currentCategory + 1} of {inventoryCategories.length} • {getCategoryItems().length} items added
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {(step > 1 || (step === 5 && currentCategory > 0)) && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-border text-foreground"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 ${
                step === 1 ? 'w-full' : ''
              } bg-safety-500 hover:bg-safety-600 disabled:bg-muted`}
            >
              {step === 5 && currentCategory === inventoryCategories.length - 1 
                ? 'Get My ReadyScore' 
                : step === 5 
                ? 'Next Category' 
                : step === 4 
                ? 'Add Supplies'
                : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingWizard;
