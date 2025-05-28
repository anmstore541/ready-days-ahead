
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, MapPin, CheckCircle } from 'lucide-react';

interface OnboardingData {
  householdSize: number;
  adultsCount: number;
  childrenCount: number;
  petsCount: number;
  zipCode: string;
  hazardProfile: string;
  hasEmergencyPlan: boolean;
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
    hasEmergencyPlan: false
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

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      householdSize: (updates.adultsCount ?? prev.adultsCount) + (updates.childrenCount ?? prev.childrenCount)
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
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-50 to-olive-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-olive-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-olive-800">ReadyScore</h1>
              <p className="text-olive-600">Get Ready in 90 Seconds</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-olive-600 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-olive-200 rounded-full h-2">
            <div 
              className="bg-olive-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-6 bg-white/95 backdrop-blur-sm border-olive-200">
          {/* Step 1: Household Size */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Users className="h-12 w-12 text-olive-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-olive-800 mb-2">
                  Tell us about your household
                </h2>
                <p className="text-olive-600">
                  This helps us calculate your supply needs accurately
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="adults" className="text-olive-700 font-medium">
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
                  <Label htmlFor="children" className="text-olive-700 font-medium">
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
                  <Label htmlFor="pets" className="text-olive-700 font-medium">
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

                <div className="text-center p-3 bg-olive-50 rounded-lg">
                  <p className="text-olive-700 font-medium">
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
                <h2 className="text-xl font-bold text-olive-800 mb-2">
                  Where are you located?
                </h2>
                <p className="text-olive-600">
                  We'll identify local hazards and customize recommendations
                </p>
              </div>

              <div>
                <Label htmlFor="zipcode" className="text-olive-700 font-medium">
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
                <h2 className="text-xl font-bold text-olive-800 mb-2">
                  What's your main concern?
                </h2>
                <p className="text-olive-600">
                  Select the primary hazard in your area
                </p>
              </div>

              <div>
                <Label className="text-olive-700 font-medium">Primary Hazard</Label>
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
                <h2 className="text-xl font-bold text-olive-800 mb-2">
                  Almost ready!
                </h2>
                <p className="text-olive-600">
                  One final question about your emergency planning
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-olive-700 font-medium">
                  Do you have a family emergency plan?
                </p>
                <div className="space-y-2">
                  <Button
                    variant={formData.hasEmergencyPlan ? "default" : "outline"}
                    className={`w-full justify-start ${
                      formData.hasEmergencyPlan 
                        ? 'bg-olive-600 hover:bg-olive-700' 
                        : 'border-olive-300 text-olive-700 hover:bg-olive-50'
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
                        : 'border-olive-300 text-olive-700 hover:bg-olive-50'
                    }`}
                    onClick={() => updateFormData({ hasEmergencyPlan: false })}
                  >
                    📝 Not yet, need help with this
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-olive-300 text-olive-700"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 ${
                step === 1 ? 'w-full' : ''
              } bg-safety-500 hover:bg-safety-600 disabled:bg-gray-300`}
            >
              {step === 4 ? 'Get My ReadyScore' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingWizard;
