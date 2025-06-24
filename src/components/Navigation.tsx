
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Home, BookOpen, User, LogIn, LogOut, Utensils } from 'lucide-react';
import { toast } from 'sonner';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Signed out successfully!');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transform hover:scale-110 transition-all duration-300"
          >
            <ChefHat className="w-8 h-8 text-green-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              HealthyRecipes
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'}
                className={`flex items-center space-x-2 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isActive('/') 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'hover:bg-green-50 text-gray-700 hover:text-green-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>

            {user && (
              <>
                <Link to="/generate">
                  <Button 
                    variant={isActive('/generate') ? 'default' : 'ghost'}
                    className={`flex items-center space-x-2 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isActive('/generate')
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'hover:bg-green-50 text-gray-700 hover:text-green-600'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Generate Recipe</span>
                  </Button>
                </Link>

                <Link to="/saved">
                  <Button 
                    variant={isActive('/saved') ? 'default' : 'ghost'}
                    className={`flex items-center space-x-2 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isActive('/saved')
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'hover:bg-orange-50 text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Saved Recipes</span>
                  </Button>
                </Link>

                <Link to="/profile">
                  <Button 
                    variant={isActive('/profile') ? 'default' : 'ghost'}
                    className={`flex items-center space-x-2 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isActive('/profile')
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'hover:bg-green-50 text-gray-700 hover:text-green-600'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center space-x-2 border-red-200 text-red-700 hover:bg-red-50 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button 
                    variant="outline"
                    className="flex items-center space-x-2 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
