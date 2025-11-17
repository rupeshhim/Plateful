require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI with API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory storage for feedback (replace with database in production)
const feedbackStorage = [];

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Plateful Backend is running!' });
});

// Recipe generation endpoint
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients, allergies } = req.body;

    // Validate input
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ 
        error: 'Please provide at least one ingredient' 
      });
    }

    // Create the prompt for Gemini
    const prompt = createRecipePrompt(ingredients, allergies);

    // Get the generative model - using available model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipe = response.text();

    // Send the recipe back
    res.json({
      success: true,
      recipe: recipe,
      ingredients: ingredients,
      allergies: allergies || []
    });

  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({
      error: 'Failed to generate recipe',
      message: error.message
    });
  }
});

// Recipe feedback endpoint
app.post('/api/recipe-feedback', async (req, res) => {
  try {
    const { recipeId, feedback, ingredients, recipe, timestamp } = req.body;

    // Validate input
    if (!recipeId) {
      return res.status(400).json({ 
        error: 'Recipe ID is required' 
      });
    }

    // Store feedback (in production, save to database)
    const feedbackEntry = {
      recipeId,
      feedback, // 'like', 'dislike', or null
      ingredients,
      recipe,
      timestamp: timestamp || new Date().toISOString()
    };

    feedbackStorage.push(feedbackEntry);

    console.log(`📊 Feedback received: ${feedback || 'removed'} for recipe ${recipeId}`);
    console.log(`   Ingredients: ${ingredients.join(', ')}`);

    res.json({
      success: true,
      message: 'Feedback received',
      feedbackId: feedbackStorage.length - 1
    });

  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      error: 'Failed to save feedback',
      message: error.message
    });
  }
});

// Get feedback statistics (optional - for analytics)
app.get('/api/feedback-stats', (req, res) => {
  const likes = feedbackStorage.filter(f => f.feedback === 'like').length;
  const dislikes = feedbackStorage.filter(f => f.feedback === 'dislike').length;
  const total = feedbackStorage.length;

  res.json({
    total,
    likes,
    dislikes,
    likePercentage: total > 0 ? ((likes / total) * 100).toFixed(1) : 0
  });
});

// Helper function to create the prompt
function createRecipePrompt(ingredients, allergies) {
  let prompt = `Create a detailed, delicious recipe using the following ingredients: ${ingredients.join(', ')}.

Please format the recipe with:
- Recipe Name
- Prep Time and Cook Time
- Servings
- Ingredients list with measurements
- Step-by-step instructions
- Any helpful cooking tips

`;

  if (allergies && allergies.length > 0) {
    prompt += `IMPORTANT: This recipe MUST be safe for someone with the following allergies: ${allergies.join(', ')}. Do not include these ingredients or any derivatives of them.\n\n`;
  }

  prompt += `Make the recipe practical and easy to follow.`;

  return prompt;
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍽️  Plateful Backend running on http://localhost:${PORT}`);
  console.log(`📡 Ready to generate recipes!`);
  console.log(`📊 Feedback tracking enabled`);
});
