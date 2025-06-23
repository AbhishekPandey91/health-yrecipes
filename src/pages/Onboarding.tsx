
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { toast } from 'sonner';

const Onboarding = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    preferences: [] as string[],
    allergies: [] as string[],
    deficiencies: [] as string[],
    cuisine_type: '',
    skill_level: ''
  });

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const preferenceOptions = [
    'Vegetables', 'Fruits', 'Grains', 'Protein', 'Dairy', 'Nuts', 'Fish', 'Chicken', 'Beef', 'Vegetarian', 'Vegan'
  ];

  const allergyOptions = [
    'Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Fish', 'Sesame'
  ];

  const deficiencyOptions = [
    'Iron', 'Vitamin D', 'Vitamin B12', 'Calcium', 'Protein', 'Fiber', 'Omega-3'
  ];

  const handleCheckboxChange = (field: 'preferences' | 'allergies' | 'deficiencies', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { error } = await updateProfile({
        preferences: formData.preferences,
        allergies: formData.allergies,
        deficiencies: formData.deficiencies,
        cuisine_type: formData.cuisine_type,
        skill_level: formData.skill_level
      });

      if (error) {
        toast.error('Failed to save preferences. Please try again.');
      } else {
        toast.success('Preferences saved successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
            <ChefHat className="w-8 h-8 text-green-600" />
            <span>Complete Your Profile</span>
          </h1>
          <p className="text-gray-600">Tell us about your food preferences to get personalized recipes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Food Preferences & Health Goals</CardTitle>
            <CardDescription>
              This information helps us generate recipes tailored to your needs
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Food Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {preferenceOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-${option}`}
                        checked={formData.preferences.includes(option)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('preferences', option, !!checked)
                        }
                      />
                      <Label htmlFor={`pref-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Allergies & Restrictions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allergyOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`allergy-${option}`}
                        checked={formData.allergies.includes(option)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('allergies', option, !!checked)
                        }
                      />
                      <Label htmlFor={`allergy-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Nutritional Deficiencies</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {deficiencyOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`deficiency-${option}`}
                        checked={formData.deficiencies.includes(option)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('deficiencies', option, !!checked)
                        }
                      />
                      <Label htmlFor={`deficiency-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine_type">Preferred Cuisine</Label>
                  <Select 
                    value={formData.cuisine_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cuisine_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skill_level">Cooking Skill Level</Label>
                  <Select 
                    value={formData.skill_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, skill_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Preferences & Start Cooking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
