
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, Droplets, Utensils, Shield, Wrench } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  daysSupply: number;
}

interface InventoryTrackerProps {
  items: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
  onBack: () => void;
}

const InventoryTracker: React.FC<InventoryTrackerProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'water',
    quantity: 0,
    unit: 'gallons',
    expiryDate: '',
    daysSupply: 0
  });

  const categories = [
    { id: 'water', name: 'Water', icon: Droplets, color: 'bg-blue-100 text-blue-700' },
    { id: 'food', name: 'Food', icon: Utensils, color: 'bg-green-100 text-green-700' },
    { id: 'medical', name: 'Medical', icon: Shield, color: 'bg-red-100 text-red-700' },
    { id: 'tools', name: 'Tools & Gear', icon: Wrench, color: 'bg-gray-100 text-gray-700' },
    { id: 'shelter', name: 'Shelter', icon: Package, color: 'bg-orange-100 text-orange-700' }
  ];

  const presetItems = {
    water: [
      { name: 'Drinking Water', unit: 'gallons', daysPerUnit: 1 },
      { name: 'Water Bottles', unit: 'bottles', daysPerUnit: 0.125 },
      { name: 'Water Purification Tablets', unit: 'tablets', daysPerUnit: 0.1 }
    ],
    food: [
      { name: 'Canned Food', unit: 'cans', daysPerUnit: 0.33 },
      { name: 'Dry Rice', unit: 'pounds', daysPerUnit: 2 },
      { name: 'Pasta', unit: 'pounds', daysPerUnit: 2 },
      { name: 'Peanut Butter', unit: 'jars', daysPerUnit: 3 },
      { name: 'Energy Bars', unit: 'bars', daysPerUnit: 0.25 }
    ],
    medical: [
      { name: 'First Aid Kit', unit: 'kits', daysPerUnit: 30 },
      { name: 'Prescription Medications', unit: 'days', daysPerUnit: 1 },
      { name: 'Pain Relievers', unit: 'bottles', daysPerUnit: 30 }
    ],
    tools: [
      { name: 'Flashlight', unit: 'flashlights', daysPerUnit: 365 },
      { name: 'Batteries', unit: 'sets', daysPerUnit: 7 },
      { name: 'Radio', unit: 'radios', daysPerUnit: 365 }
    ],
    shelter: [
      { name: 'Blankets', unit: 'blankets', daysPerUnit: 365 },
      { name: 'Tarps', unit: 'tarps', daysPerUnit: 365 },
      { name: 'Duct Tape', unit: 'rolls', daysPerUnit: 30 }
    ]
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0) {
      onAddItem({
        ...newItem,
        daysSupply: newItem.quantity * (presetItems[newItem.category as keyof typeof presetItems]?.find(p => p.name === newItem.name)?.daysPerUnit || 1)
      });
      setNewItem({
        name: '',
        category: 'water',
        quantity: 0,
        unit: 'gallons',
        expiryDate: '',
        daysSupply: 0
      });
      setShowAddForm(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Package;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-50 to-olive-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-olive-200 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-olive-700">
            ← Back
          </Button>
          <h1 className="text-lg font-bold text-olive-800">Inventory</h1>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="bg-safety-500 hover:bg-safety-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Search and Filter */}
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-olive-500" />
              <Input
                placeholder="Search supplies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-3 w-full bg-white/90">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="water" className="text-xs">Water</TabsTrigger>
            <TabsTrigger value="food" className="text-xs">Food</TabsTrigger>
          </TabsList>

          <TabsList className="grid grid-cols-3 w-full bg-white/90 mt-2">
            <TabsTrigger value="medical" className="text-xs">Medical</TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
            <TabsTrigger value="shelter" className="text-xs">Shelter</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Inventory List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <Card className="p-6 text-center bg-white/90">
              <Package className="h-12 w-12 text-olive-400 mx-auto mb-3" />
              <p className="text-olive-600">No supplies found</p>
              <p className="text-sm text-olive-500 mt-1">
                Add your first supply to get started
              </p>
            </Card>
          ) : (
            filteredItems.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              return (
                <Card key={item.id} className="p-4 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-olive-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-olive-600">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant={item.daysSupply >= 3 ? "default" : "destructive"}
                            className={item.daysSupply >= 3 ? "bg-ready text-white" : ""}
                          >
                            {item.daysSupply.toFixed(1)} days
                          </Badge>
                        </div>
                      </div>
                      
                      {item.expiryDate && (
                        <p className="text-xs text-olive-500 mt-1">
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <Card className="p-4 bg-white/95 backdrop-blur-sm border-safety-200">
            <h3 className="font-semibold text-olive-800 mb-4">Add New Supply</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-olive-700">Category</Label>
                <Select 
                  value={newItem.category} 
                  onValueChange={(value) => setNewItem({...newItem, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-olive-700">Item Name</Label>
                <Select
                  value={newItem.name}
                  onValueChange={(value) => {
                    const preset = presetItems[newItem.category as keyof typeof presetItems]?.find(p => p.name === value);
                    setNewItem({
                      ...newItem, 
                      name: value,
                      unit: preset?.unit || newItem.unit
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetItems[newItem.category as keyof typeof presetItems]?.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-olive-700">Quantity</Label>
                  <Input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-olive-700">Unit</Label>
                  <Input
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="units"
                  />
                </div>
              </div>

              <div>
                <Label className="text-olive-700">Expiry Date (optional)</Label>
                <Input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddItem}
                  className="flex-1 bg-safety-500 hover:bg-safety-600"
                  disabled={!newItem.name || newItem.quantity <= 0}
                >
                  Add Supply
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryTracker;
