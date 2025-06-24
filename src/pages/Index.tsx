
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Zap, ChefHat, BookOpen, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Box } from '@react-three/drei';

const FloatingIngredients = () => {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere args={[0.5]} position={[-2, 1, 0]}>
          <meshStandardMaterial color="#ff6b35" />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={1.2}>
        <Box args={[0.6, 0.6, 0.6]} position={[2, -1, 0]}>
          <meshStandardMaterial color="#16a34a" />
        </Box>
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <Sphere args={[0.3]} position={[0, 2, -1]}>
          <meshStandardMaterial color="#eab308" />
        </Sphere>
      </Float>
    </group>
  );
};

const Index = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [showSampleRecipe, setShowSampleRecipe] = useState(false);

  const sampleRecipe = {
    title: "Mediterranean Chicken Salad",
    description: "Iron-rich salad with chicken, spinach, and olives - perfect for addressing iron deficiency",
    prep_time: "20 minutes",
    servings: 2,
    calories: 400,
    difficulty: "Easy",
    ingredients: [
      "2 cups fresh spinach leaves",
      "1 grilled chicken breast, sliced", 
      "1/4 cup black olives",
      "1/4 cup cherry tomatoes, halved",
      "2 tbsp olive oil",
      "1 tbsp lemon juice",
      "1/4 cup feta cheese",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Wash and dry the spinach leaves thoroughly",
      "Grill the chicken breast and let it cool, then slice",
      "Halve the cherry tomatoes and slice the olives",
      "In a large bowl, combine spinach, chicken, olives, and tomatoes",
      "Whisk together olive oil and lemon juice for dressing",
      "Drizzle dressing over salad and toss gently",
      "Top with crumbled feta cheese",
      "Season with salt and pepper to taste and serve"
    ],
    nutritional_info: {
      protein: "35g",
      carbs: "8g", 
      fat: "22g",
      fiber: "4g",
      iron: "6mg",
      vitamin_c: "45mg"
    },
    youtube_link: "https://youtube.com/watch?v=dQw4w9WgXcQ"
  };

  const handleTryIt = () => {
    if (!user) {
      toast.info('Please sign up to try recipes!');
      navigate('/signup');
    } else {
      setShowSampleRecipe(true);
      toast.success('Here\'s a sample recipe for you!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 relative overflow-hidden">
      {/* 3D Background Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} />
          <FloatingIngredients />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section with 3D Animation */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 transform hover:scale-105 transition-all duration-500 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            {user ? `Welcome back, ${profile?.name?.split(' ')[0] || 'User'}!` : 'Welcome to HealthyRecipes'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto transform hover:scale-102 transition-transform duration-300">
            Discover personalized healthy recipes tailored to your nutritional needs, 
            dietary preferences, and cooking skills. Address deficiencies while enjoying delicious meals.
          </p>
        </div>

        {user ? (
          /* Authenticated User Dashboard with 3D Effects */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Link to="/generate" className="group">
              <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-green-200 transform group-hover:scale-105 group-hover:rotate-2 group-hover:-translate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                <CardHeader className="text-center">
                  <ChefHat className="w-12 h-12 text-green-600 mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300" />
                  <CardTitle className="text-xl text-green-600">Generate New Recipe</CardTitle>
                  <CardDescription>
                    Create personalized recipes based on your preferences and nutritional needs
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/saved" className="group">
              <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-orange-200 transform group-hover:scale-105 group-hover:rotate-2 group-hover:-translate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                <CardHeader className="text-center">
                  <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300" />
                  <CardTitle className="text-xl text-orange-600">View Saved Recipes</CardTitle>
                  <CardDescription>
                    Access your collection of saved recipes and cooking favorites
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/profile" className="group">
              <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-green-200 transform group-hover:scale-105 group-hover:rotate-2 group-hover:-translate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                <CardHeader className="text-center">
                  <User className="w-12 h-12 text-green-600 mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300" />
                  <CardTitle className="text-xl text-green-600">Edit Profile</CardTitle>
                  <CardDescription>
                    Update your preferences, allergies, and nutritional goals
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        ) : (
          /* Non-authenticated User CTA with 3D Effects */
          <div className="text-center mb-12">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto mb-8 transform hover:scale-105 hover:rotate-1 transition-all duration-500" style={{ transformStyle: 'preserve-3d' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Healthy Journey Today</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of users who have transformed their eating habits with personalized, 
                nutritionally-balanced recipes designed for their specific health goals.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Link to="/signup">
                  <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-lg px-8 py-3 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Sign Up Free
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sample Recipe Card with 3D Enhancements */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 transform hover:scale-105 transition-transform duration-300">
            Sample Recipe
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 hover:shadow-2xl" style={{ transformStyle: 'preserve-3d' }}>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">{sampleRecipe.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {sampleRecipe.description}
                </CardDescription>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
                  <span className="flex items-center transform hover:scale-110 transition-transform duration-200">
                    <Clock className="w-4 h-4 mr-1" />
                    {sampleRecipe.prep_time}
                  </span>
                  <span className="flex items-center transform hover:scale-110 transition-transform duration-200">
                    <Users className="w-4 h-4 mr-1" />
                    {sampleRecipe.servings} servings
                  </span>
                  <span className="flex items-center transform hover:scale-110 transition-transform duration-200">
                    <Zap className="w-4 h-4 mr-1" />
                    {sampleRecipe.calories} cal
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Key Ingredients:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Fresh spinach (high in iron)</li>
                      <li>• Grilled chicken breast (lean protein)</li>
                      <li>• Black olives (healthy fats)</li>
                      <li>• Cherry tomatoes (vitamin C)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Nutritional Highlights:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <span>• High in iron (6mg)</span>
                      <span>• Rich in protein (35g)</span>
                      <span>• Low carb (8g)</span>
                      <span>• Vitamin C boost</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTryIt}
                    className="w-full bg-orange-500 hover:bg-orange-600 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Try This Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showSampleRecipe && user && (
              <Card className="bg-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 hover:shadow-2xl" style={{ transformStyle: 'preserve-3d' }}>
                <CardHeader>
                  <CardTitle>Complete Recipe Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {sampleRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="transform hover:translate-x-2 transition-transform duration-200">{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      {sampleRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="transform hover:translate-x-2 transition-transform duration-200">{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  <Button asChild variant="outline" className="w-full transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <a href={sampleRecipe.youtube_link} target="_blank" rel="noopener noreferrer">
                      Watch Tutorial
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section with 3D Effects */}
        <div className="mt-16 bg-white rounded-lg shadow-xl p-8 transform hover:scale-102 transition-all duration-500" style={{ transformStyle: 'preserve-3d' }}>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 transform hover:scale-105 transition-transform duration-300">
            Why Choose HealthyRecipes?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <ChefHat className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Recipes</h3>
              <p className="text-gray-600">
                Recipes tailored to your dietary preferences, allergies, and nutritional deficiencies
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nutritional Focus</h3>
              <p className="text-gray-600">
                Address specific deficiencies like iron, vitamin D, and more through targeted recipes
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step-by-Step Guidance</h3>
              <p className="text-gray-600">
                Detailed instructions with YouTube tutorials to help you cook with confidence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
