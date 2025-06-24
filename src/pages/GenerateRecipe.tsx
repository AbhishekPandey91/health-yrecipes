
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2, ChefHat, Clock, Users, Zap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Box, Cylinder } from '@react-three/drei';

interface Recipe {
  title: string;
  description: string;
  prep_time: string;
  servings: number;
  calories: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  nutritional_info: Record<string, string>;
  youtube_link: string;
}

const FloatingKitchen = () => {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Cylinder args={[0.3, 0.3, 1.2]} position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <meshStandardMaterial color="#fbbf24" />
        </Cylinder>
      </Float>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
        <Sphere args={[0.4]} position={[1, 1, 0]}>
          <meshStandardMaterial color="#dc2626" />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <Box args={[0.5, 0.8, 0.5]} position={[0, -1, 1]}>
          <meshStandardMaterial color="#16a34a" />
        </Box>
      </Float>
    </group>
  );
};

const GenerateRecipe = () => {
  const { user, profile } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [preferences, setPreferences] = useState({
    mealType: '',
    cookingTime: '',
    cuisineType: profile?.cuisine_type || '',
    skillLevel: profile?.skill_level || '',
    preferences: profile?.preferences || [],
    allergies: profile?.allergies || [],
    deficiencies: profile?.deficiencies || []
  });

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: { preferences }
      });

      if (error) throw error;

      setGeneratedRecipe(data.recipe);
      toast.success('Recipe generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: generatedRecipe.title,
          description: generatedRecipe.description,
          prep_time: generatedRecipe.prep_time,
          servings: generatedRecipe.servings,
          calories: generatedRecipe.calories,
          difficulty: generatedRecipe.difficulty,
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
          nutritional_info: generatedRecipe.nutritional_info,
          youtube_link: generatedRecipe.youtube_link
        });

      if (error) throw error;

      toast.success('Recipe saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4 relative overflow-hidden">
      {/* 3D Background Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingKitchen />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            Generate Your Recipe
          </h1>
          <p className="text-gray-600">Get personalized healthy recipes based on your preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generation Form with 3D Effects */}
          <Card className="transform hover:scale-105 hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl" style={{ transformStyle: 'preserve-3d' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-green-600 animate-pulse" />
                <span>Recipe Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize your recipe based on your current needs
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <Label htmlFor="mealType" className="group-hover:text-green-600 transition-colors duration-200">Meal Type</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, mealType: value }))}>
                    <SelectTrigger className="transform group-hover:scale-105 transition-all duration-200 focus:scale-105 focus:shadow-lg">
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
                
                <div className="space-y-2 group">
                  <Label htmlFor="cookingTime" className="group-hover:text-orange-600 transition-colors duration-200">Cooking Time</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, cookingTime: value }))}>
                    <SelectTrigger className="transform group-hover:scale-105 transition-all duration-200 focus:scale-105 focus:shadow-lg">
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
                <div className="space-y-2 group">
                  <Label htmlFor="cuisineType" className="group-hover:text-green-600 transition-colors duration-200">Cuisine Type</Label>
                  <Select 
                    value={preferences.cuisineType}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, cuisineType: value }))}
                  >
                    <SelectTrigger className="transform group-hover:scale-105 transition-all duration-200 focus:scale-105 focus:shadow-lg">
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
                
                <div className="space-y-2 group">
                  <Label htmlFor="skillLevel" className="group-hover:text-orange-600 transition-colors duration-200">Skill Level</Label>
                  <Select 
                    value={preferences.skillLevel}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, skillLevel: value }))}
                  >
                    <SelectTrigger className="transform group-hover:scale-105 transition-all duration-200 focus:scale-105 focus:shadow-lg">
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
                className="w-full bg-green-600 hover:bg-green-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
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

          {/* Generated Recipe with 3D Effects */}
          {generatedRecipe && (
            <Card className="transform hover:scale-105 hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl" style={{ transformStyle: 'preserve-3d' }}>
              <CardHeader>
                <CardTitle className="text-xl">{generatedRecipe.title}</CardTitle>
                <CardDescription>{generatedRecipe.description}</CardDescription>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                  <span className="flex items-center transform hover:scale-110 transition-transform duration-200">
                    <Clock className="w-4 h-4 mr-1" />
                    {generatedRecipe.prep_time}
                  </span>
                  <span className="flex items-center transform hover:scale-110 transition-transform duration-200">
                    <Users className="w-4 h-4 mr-1" />
                    {generatedRecipe.servings} servings
                  </span>
                  <span className="flex items-center transform hover:scale-110 transition-transform duration-200">
                    <Zap className="w-4 h-4 mr-1" />
                    {generatedRecipe.calories} cal
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="transform hover:translate-x-2 transition-transform duration-200">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {generatedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="transform hover:translate-x-2 transition-transform duration-200">{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveRecipe}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Save Recipe
                      </>
                    )}
                  </Button>
                  
                  <Button asChild variant="outline" className="flex-1 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <a href={generatedRecipe.youtube_link} target="_blank" rel="noopener noreferrer">
                      Watch Tutorial
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateRecipe;
