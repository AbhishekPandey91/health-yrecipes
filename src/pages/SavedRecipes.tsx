
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import RecipeCard from '@/components/RecipeCard';
import { BookOpen } from 'lucide-react';

const SavedRecipes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Demo saved recipes - in real app, this would come from Supabase
  const savedRecipes = [
    {
      id: '1',
      title: 'Mediterranean Chicken Salad',
      description: 'A light, iron-rich salad with grilled chicken, spinach, and olives.',
      prepTime: '20 minutes',
      servings: 2,
      calories: 400,
      difficulty: 'Easy',
      nutrients: ['Iron', 'Protein'],
      youtubeLink: 'https://youtube.com/watch?v=example'
    },
    {
      id: '2',
      title: 'Iron-Rich Spinach Pasta',
      description: 'Creamy pasta with spinach and sun-dried tomatoes, perfect for iron deficiency.',
      prepTime: '25 minutes',
      servings: 4,
      calories: 520,
      difficulty: 'Medium',
      nutrients: ['Iron', 'Folate'],
      youtubeLink: 'https://youtube.com/watch?v=example2'
    }
  ];

  const handleDelete = (id: string) => {
    console.log('Delete recipe:', id);
    // In real app, this would delete from Supabase
  };

  const handleTryIt = (id: string) => {
    console.log('Try recipe:', id);
    // In real app, this would open recipe details
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span>Saved Recipes</span>
          </h1>
          <p className="text-gray-600">Your collection of personalized healthy recipes</p>
        </div>

        {savedRecipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No Saved Recipes Yet</CardTitle>
              <CardDescription>
                Start generating recipes to build your personal collection
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onTryIt={() => handleTryIt(recipe.id)}
                onDelete={() => handleDelete(recipe.id)}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
