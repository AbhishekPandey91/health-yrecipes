
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import RecipeCard from '@/components/RecipeCard';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

interface SavedRecipe {
  id: string;
  title: string;
  description: string;
  prep_time: string;
  servings: number;
  calories: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  nutritional_info: any;
  youtube_link: string;
}

const FloatingBook = () => {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh>
        <boxGeometry args={[1, 0.1, 0.7]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </Float>
  );
};

const SavedRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  useEffect(() => {
    fetchSavedRecipes();
  }, [user.id]);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedRecipes: SavedRecipe[] = (data || []).map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        prep_time: recipe.prep_time,
        servings: recipe.servings,
        calories: recipe.calories,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        nutritional_info: recipe.nutritional_info || {},
        youtube_link: recipe.youtube_link
      }));

      setRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load saved recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const handleTryIt = (recipe: SavedRecipe) => {
    console.log('Opening recipe details:', recipe.title);
    toast.info(`Opening ${recipe.title}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4 relative overflow-hidden">
      {/* 3D Background Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingBook />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2 transform hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-8 h-8 text-green-600 animate-pulse" />
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Saved Recipes
            </span>
          </h1>
          <p className="text-gray-600">Your collection of personalized healthy recipes</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <Card className="text-center py-12 transform hover:scale-105 transition-transform duration-300 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">No Saved Recipes Yet</CardTitle>
              <CardDescription className="text-lg">
                Start generating recipes to build your personal collection
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <RecipeCard
                  recipe={{
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    prepTime: recipe.prep_time,
                    servings: recipe.servings,
                    calories: recipe.calories,
                    difficulty: recipe.difficulty,
                    nutrients: typeof recipe.nutritional_info === 'object' ? Object.keys(recipe.nutritional_info || {}) : [],
                    youtubeLink: recipe.youtube_link
                  }}
                  onTryIt={() => handleTryIt(recipe)}
                  onDelete={() => handleDelete(recipe.id)}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
