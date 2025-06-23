
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

const GenerateRecipe = () => {
  const { user, profile } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState({
    mealType: '',
    cookingTime: '',
    cuisineType: profile?.cuisine_type || '',
    skillLevel: profile?.skill_level || ''
  });

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call - in real app, this would call Hugging Face API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Recipe generated successfully!');
    } catch (error) {
      toast.error('Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Your Recipe</h1>
          <p className="text-gray-600">Get personalized healthy recipes based on your preferences</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-green-600" />
              <span>Recipe Preferences</span>
            </CardTitle>
            <CardDescription>
              Customize your recipe based on your current needs
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mealType">Meal Type</Label>
                <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, mealType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cookingTime">Cooking Time</Label>
                <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, cookingTime: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cooking time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-15">Under 15 minutes</SelectItem>
                    <SelectItem value="15-30">15-30 minutes</SelectItem>
                    <SelectItem value="30-60">30-60 minutes</SelectItem>
                    <SelectItem value="over-60">Over 1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cuisineType">Cuisine Type</Label>
                <Select 
                  value={preferences.cuisineType}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, cuisineType: value }))}
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
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select 
                  value={preferences.skillLevel}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, skillLevel: value }))}
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
              onClick={handleGenerate}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                'Generate Recipe'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateRecipe;
