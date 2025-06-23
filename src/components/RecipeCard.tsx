
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Utensils } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  servings: number;
  calories: number;
  difficulty: string;
  image?: string;
  nutrients?: string[];
  youtubeLink?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onTryIt?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const RecipeCard = ({ recipe, onTryIt, onSave, onDelete, showActions = true }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border border-green-100">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <Utensils className="w-16 h-16 text-green-400" />
          )}
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-green-700">
            {recipe.difficulty}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
          {recipe.title}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="font-medium text-green-600">
            {recipe.calories} cal
          </div>
        </div>
        
        {recipe.nutrients && recipe.nutrients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.nutrients.map((nutrient, index) => (
              <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                Rich in {nutrient}
              </Badge>
            ))}
          </div>
        )}
        
        {showActions && (
          <div className="flex space-x-2">
            {onTryIt && (
              <Button 
                onClick={onTryIt}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Try It
              </Button>
            )}
            {onSave && (
              <Button 
                onClick={onSave}
                variant="outline"
                className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                size="sm"
              >
                Save
              </Button>
            )}
            {onDelete && (
              <Button 
                onClick={onDelete}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
                size="sm"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
