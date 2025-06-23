
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { ChefHat, Clock, Zap, BookOpen, User, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const { user, profile } = useAuth();
  const [showSampleRecipe, setShowSampleRecipe] = useState(false);

  const sampleRecipe = {
    title: 'Mediterranean Chicken Salad',
    description: 'A light, iron-rich salad with grilled chicken, spinach, and olives.',
    prepTime: '20 minutes',
    servings: 2,
    calories: 400,
    difficulty: 'Easy',
    nutrients: ['Iron', 'Protein', 'Vitamin A'],
    ingredients: [
      '2 chicken breasts, grilled and sliced',
      '4 cups fresh spinach',
      '1/2 cup cherry tomatoes, halved',
      '1/4 cup kalamata olives',
      '1/4 cup red onion, sliced',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Season and grill chicken breasts until cooked through.',
      'Let chicken rest for 5 minutes, then slice.',
      'In a large bowl, combine spinach, tomatoes, olives, and onion.',
      'Whisk together olive oil and lemon juice for dressing.',
      'Add sliced chicken to salad and drizzle with dressing.',
      'Season with salt and pepper. Serve immediately.'
    ],
    youtubeLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
  };

  const handleTryIt = () => {
    if (user) {
      setShowSampleRecipe(true);
    }
    // If user is not logged in, the Link will handle redirection
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {user ? `Welcome back, ${profile?.name || 'there'}!` : 'Welcome to HealthyRecipes'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate personalized healthy recipes tailored to your nutritional needs, 
            dietary preferences, and cooking skills. Address deficiencies while enjoying 
            delicious meals.
          </p>
        </div>

        {/* Action Buttons */}
        {user && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/generate">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                <Plus className="w-5 h-5 mr-2" />
                Generate New Recipe
              </Button>
            </Link>
            <Link to="/saved">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-green-600 text-green-600 hover:bg-green-50">
                <BookOpen className="w-5 h-5 mr-2" />
                View Saved Recipes
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-orange-500 text-orange-600 hover:bg-orange-50">
                <User className="w-5 h-5 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center p-6">
            <CardHeader>
              <ChefHat className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Personalized Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Get recipes tailored to your dietary needs, allergies, and nutritional deficiencies.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Nutritional Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Address specific deficiencies like low iron, vitamin D, and more through targeted recipes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Step-by-Step Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Complete instructions, shopping lists, and YouTube tutorials for every recipe.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Sample Recipe Card */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Try a Sample Recipe</h2>
          <Card className="overflow-hidden shadow-lg">
            <div className="h-48 bg-gradient-to-r from-green-400 to-orange-400 flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-white" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{sampleRecipe.title}</CardTitle>
              <CardDescription className="text-gray-600">
                {sampleRecipe.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {sampleRecipe.prepTime}
                </span>
                <span>{sampleRecipe.servings} servings</span>
                <span>{sampleRecipe.calories} cal</span>
                <span className="text-green-600 font-medium">{sampleRecipe.difficulty}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {sampleRecipe.nutrients.map((nutrient) => (
                  <span key={nutrient} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {nutrient}
                  </span>
                ))}
              </div>
              {user ? (
                <Button 
                  onClick={handleTryIt}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Try It Now
                </Button>
              ) : (
                <Link to="/signup">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Sign Up to Try It
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {!user && (
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Start Your Healthy Journey?</h3>
            <div className="flex justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4">
                  Sign Up Free
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg" className="px-8 py-4 border-green-600 text-green-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Sample Recipe Dialog */}
      <Dialog open={showSampleRecipe} onOpenChange={setShowSampleRecipe}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{sampleRecipe.title}</DialogTitle>
            <DialogDescription>
              {sampleRecipe.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>⏱️ {sampleRecipe.prepTime}</span>
              <span>🍽️ {sampleRecipe.servings} servings</span>
              <span>🔥 {sampleRecipe.calories} cal</span>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {sampleRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {sampleRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                <a href={sampleRecipe.youtubeLink} target="_blank" rel="noopener noreferrer">
                  Watch YouTube Tutorial
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
