
import Navigation from '@/components/Navigation';
import RecipeCard from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, User, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  // Sample recipe data
  const sampleRecipe = {
    id: '1',
    title: 'Mediterranean Chicken Salad',
    description: 'A light, iron-rich salad with grilled chicken, spinach, and olives perfect for addressing iron deficiency.',
    prepTime: '20 min',
    servings: 2,
    calories: 400,
    difficulty: 'Easy',
    nutrients: ['Iron', 'Protein', 'Vitamin K'],
    youtubeLink: 'https://youtube.com/watch?v=mediterranean-chicken'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome to HealthyRecipes'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate personalized healthy recipes tailored to your preferences, dietary needs, and nutritional deficiencies. 
            Get step-by-step instructions with YouTube tutorials to make cooking easy and enjoyable.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link to={user ? "/generate" : "/signup"}>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                <Plus className="w-5 h-5 mr-2" />
                Generate New Recipe
              </Button>
            </Link>
            
            {user && (
              <>
                <Link to="/saved">
                  <Button size="lg" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-3 text-lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    View Saved Recipes
                  </Button>
                </Link>
                
                <Link to="/profile">
                  <Button size="lg" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg">
                    <User className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Recipes</h3>
            <p className="text-gray-600">Get recipes tailored to your dietary needs, preferences, and nutritional deficiencies.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">YouTube Tutorials</h3>
            <p className="text-gray-600">Each recipe comes with curated YouTube video tutorials to guide you step-by-step.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Health-Focused</h3>
            <p className="text-gray-600">Address nutritional deficiencies like iron, vitamin D, and calcium through targeted recipes.</p>
          </div>
        </div>

        {/* Sample Recipe Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try a Sample Recipe</h2>
          <p className="text-lg text-gray-600 mb-8">
            Here's a taste of what you can expect from our personalized recipe generation.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <RecipeCard 
            recipe={sampleRecipe}
            onTryIt={() => {
              if (!user) {
                window.location.href = '/signup';
              } else {
                // In real app, navigate to recipe details
                console.log('Opening recipe details...');
              }
            }}
            showActions={true}
          />
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="text-center bg-white rounded-lg shadow-sm border border-green-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Cooking Healthy?</h3>
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of home cooks who are already improving their health through personalized recipes.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
