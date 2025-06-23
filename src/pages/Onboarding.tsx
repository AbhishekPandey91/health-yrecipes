import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Onboarding = () => {
  const [preferences, setPreferences] = useState({
    likes: '',
    dislikes: '',
    allergies: [] as string[],
    customAllergy: '',
    deficiencies: [] as string[],
    customDeficiency: '',
    cuisineType: '',
    skillLevel: ''
  });
  
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const commonAllergies = [
    'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat/Gluten', 
    'Fish', 'Shellfish', 'Sesame'
  ];

  const commonDeficiencies = [
    'Iron', 'Vitamin D', 'Vitamin B12', 'Calcium', 'Magnesium', 
    'Omega-3', 'Vitamin C', 'Zinc'
  ];

  const cuisineTypes = [
    'Italian', 'Mexican', 'Indian', 'Mediterranean', 'Asian', 
    'American', 'French', 'Greek', 'Thai', 'Middle Eastern'
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner - Simple, quick recipes' },
    { value: 'intermediate', label: 'Intermediate - Moderate complexity' },
    { value: 'advanced', label: 'Advanced - Complex techniques' }
  ];

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      allergies: checked 
        ? [...prev.allergies, allergy]
        : prev.allergies.filter(a => a !== allergy)
    }));
  };

  const handleDeficiencyChange = (deficiency: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      deficiencies: checked 
        ? [...prev.deficiencies, deficiency]
        : prev.deficiencies.filter(d => d !== deficiency)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine allergies and deficiencies with custom entries
    const finalAllergies = [...preferences.allergies];
    if (preferences.customAllergy.trim()) {
      finalAllergies.push(preferences.customAllergy.trim());
    }
    
    const finalDeficiencies = [...preferences.deficiencies];
    if (preferences.customDeficiency.trim()) {
      finalDeficiencies.push(preferences.customDeficiency.trim());
    }

    const profileData = {
      preferences: preferences.likes.split(',').map(p => p.trim()).filter(p => p),
      allergies: finalAllergies,
      deficiencies: finalDeficiencies,
      cuisine_type: preferences.cuisineType,
      skill_level: preferences.skillLevel
    };

    const { error } = await updateProfile(profileData);
    
    if (error) {
      toast.error('Failed to save preferences. Please try again.');
    } else {
      toast.success('Preferences saved successfully!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Tell Us About Your Preferences</CardTitle>
            <CardDescription className="text-lg">
              Help us personalize your recipe recommendations by sharing your dietary preferences and health needs.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Food Preferences</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="likes">Foods You Love</Label>
                  <Textarea
                    id="likes"
                    placeholder="e.g., chicken, pasta, vegetables, salmon (separate with commas)"
                    value={preferences.likes}
                    onChange={(e) => setPreferences(prev => ({ ...prev, likes: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dislikes">Foods You Dislike</Label>
                  <Textarea
                    id="dislikes"
                    placeholder="e.g., fish, broccoli, spicy food (separate with commas)"
                    value={preferences.dislikes}
                    onChange={(e) => setPreferences(prev => ({ ...prev, dislikes: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Allergies & Dietary Restrictions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAllergies.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={preferences.allergies.includes(allergy)}
                        onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                      />
                      <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customAllergy">Other Allergies</Label>
                  <Input
                    id="customAllergy"
                    placeholder="Enter any other allergies"
                    value={preferences.customAllergy}
                    onChange={(e) => setPreferences(prev => ({ ...prev, customAllergy: e.target.value }))}
                  />
                </div>
              </div>

              {/* Nutritional Deficiencies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Nutritional Needs</h3>
                <p className="text-sm text-gray-600">
                  Select any nutrients you'd like to focus on in your recipes.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {commonDeficiencies.map((deficiency) => (
                    <div key={deficiency} className="flex items-center space-x-2">
                      <Checkbox
                        id={deficiency}
                        checked={preferences.deficiencies.includes(deficiency)}
                        onCheckedChange={(checked) => handleDeficiencyChange(deficiency, checked as boolean)}
                      />
                      <Label htmlFor={deficiency} className="text-sm">{deficiency}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customDeficiency">Other Nutritional Focus</Label>
                  <Input
                    id="customDeficiency"
                    placeholder="e.g., Protein, Fiber"
                    value={preferences.customDeficiency}
                    onChange={(e) => setPreferences(prev => ({ ...prev, customDeficiency: e.target.value }))}
                  />
                </div>
              </div>

              {/* Cuisine & Skill */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Preferred Cuisine</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, cuisineType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your favorite cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skill">Cooking Skill Level</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, skillLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((skill) => (
                        <SelectItem key={skill.value} value={skill.value}>
                          {skill.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
              >
                Save Preferences & Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
