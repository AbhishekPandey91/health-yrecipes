
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { preferences } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create a detailed prompt for recipe generation
    const prompt = `Generate a detailed healthy recipe with the following specifications:
    - Meal type: ${preferences.mealType || 'dinner'}
    - Cooking time: ${preferences.cookingTime || '30-60 minutes'}
    - Cuisine: ${preferences.cuisineType || 'Mediterranean'}
    - Skill level: ${preferences.skillLevel || 'beginner'}
    - Dietary preferences: ${preferences.preferences?.join(', ') || 'balanced'}
    - Allergies to avoid: ${preferences.allergies?.join(', ') || 'none'}
    - Address nutritional deficiencies: ${preferences.deficiencies?.join(', ') || 'general nutrition'}

    Please provide a complete recipe in valid JSON format with these exact fields:
    {
      "title": "Recipe Name",
      "description": "Brief description focusing on health benefits",
      "prep_time": "20 minutes",
      "servings": 4,
      "calories": 400,
      "difficulty": "Easy/Intermediate/Advanced",
      "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
      "instructions": ["detailed step 1", "detailed step 2"],
      "nutritional_info": {"protein": "25g", "carbs": "30g", "fat": "15g", "fiber": "8g", "iron": "3mg"},
      "youtube_search": "search terms for finding cooking tutorial"
    }

    Make sure the recipe specifically addresses the mentioned nutritional deficiencies and avoids all listed allergies. Return only valid JSON.`

    console.log('Calling OpenAI API...')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and chef. Generate healthy recipes in valid JSON format only. Focus on nutritional benefits and clear instructions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text())
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('OpenAI response received')
    
    let generatedRecipe;
    try {
      // Try to parse the JSON response from OpenAI
      const recipeContent = result.choices[0].message.content.trim()
      console.log('Recipe content:', recipeContent)
      
      // Remove any markdown formatting if present
      const cleanContent = recipeContent.replace(/```json\n?|\n?```/g, '').trim()
      generatedRecipe = JSON.parse(cleanContent)
      
      // Add a YouTube link based on the search terms
      const youtubeSearchQuery = encodeURIComponent(generatedRecipe.youtube_search || `${generatedRecipe.title} recipe cooking tutorial`)
      generatedRecipe.youtube_link = `https://www.youtube.com/results?search_query=${youtubeSearchQuery}`
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      
      // Fallback structured recipe if parsing fails
      generatedRecipe = {
        title: `Healthy ${preferences.cuisineType || 'Mediterranean'} ${preferences.mealType || 'Dinner'}`,
        description: `A nutritious ${preferences.skillLevel || 'beginner'}-friendly recipe rich in ${preferences.deficiencies?.join(', ') || 'essential nutrients'}`,
        prep_time: preferences.cookingTime || '30 minutes',
        servings: 4,
        calories: 350,
        difficulty: preferences.skillLevel === 'advanced' ? 'Advanced' : preferences.skillLevel === 'intermediate' ? 'Intermediate' : 'Easy',
        ingredients: [
          '2 cups fresh spinach',
          '1 cup cherry tomatoes, halved',
          '1/2 cup quinoa, uncooked',
          '2 tbsp olive oil',
          '1 lemon, juiced',
          '2 cloves garlic, minced',
          '1/4 cup pine nuts',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Rinse quinoa under cold water and cook according to package instructions (about 15 minutes)',
          'Heat olive oil in a large pan over medium heat',
          'Add minced garlic and cook for 1 minute until fragrant',
          'Add cherry tomatoes and cook for 3-4 minutes until they start to soften',
          'Add fresh spinach and cook until wilted (about 2 minutes)',
          'Mix in the cooked quinoa and pine nuts',
          'Season with lemon juice, salt, and pepper to taste',
          'Serve warm and enjoy your nutritious meal!'
        ],
        nutritional_info: {
          protein: '12g',
          carbs: '45g',
          fat: '14g',
          fiber: '6g',
          iron: '4mg',
          vitamin_c: '80mg'
        },
        youtube_link: `https://www.youtube.com/results?search_query=${encodeURIComponent('healthy quinoa spinach recipe cooking tutorial')}`
      }
    }

    return new Response(
      JSON.stringify({ recipe: generatedRecipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating recipe:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate recipe', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
