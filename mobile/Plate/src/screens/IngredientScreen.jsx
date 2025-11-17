import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';

// NOTE: Rename this file to IngredientScreen.jsx or IngredientScreen.js
export default function IngredientScreen() {
  // TypeScript types removed from useState
  const [ingredientInput, setIngredientInput] = useState('');
  const [addedIngredients, setAddedIngredients] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  // Type union ('like' | 'dislike' | null) is removed
  const [feedback, setFeedback] = useState(null); 
  const [currentRecipeId, setCurrentRecipeId] = useState(null);

  // Type annotation removed
  const quickAddItems = ['chicken', 'rice', 'pasta', 'tomatoes', 'onions', 'garlic'];

  const addIngredient = (ingredient) => {
    if (ingredient && !addedIngredients.includes(ingredient.toLowerCase())) {
      setAddedIngredients([...addedIngredients, ingredient.toLowerCase()]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredient) => {
    setAddedIngredients(addedIngredients.filter(i => i !== ingredient));
  };

  // Type annotation removed
  const generateRecipe = async (promptType = '') => {
    if (addedIngredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setShowRecipe(true);
    setFeedback(null); // Reset feedback for new recipe

    try {
        const response = await fetch('http://10.173.185.123:3000/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: addedIngredients,
          allergies: allergies
        })
      });

      const data = await response.json();

      if (data.success) {
        setRecipe(data.recipe);
        // Generate a unique ID for this recipe
        setCurrentRecipeId(Date.now().toString());
      } else {
        setRecipe('Failed to generate recipe. Please try again.');
      }
    } catch (err) {
      setRecipe('Could not connect to server. Make sure your backend is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Type annotation removed
  const handleFeedback = async (type) => {
    // Toggle feedback: if clicking the same button, remove feedback
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);

    // Send feedback to your backend
    try {
      await fetch('http://192.168.4.51:3000/api/recipe-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: currentRecipeId,
          feedback: newFeedback,
          ingredients: addedIngredients,
          recipe: recipe,
          timestamp: new Date().toISOString()
        }),
      });
      
      // Optional: Show a brief success message
      console.log(`Feedback ${newFeedback} submitted successfully`);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Don't revert the UI state - keep the feedback shown even if network fails
    }
  };

  if (showRecipe) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowRecipe(false)}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTabs}>
            <View style={styles.tab}>
              <Text style={styles.tabText}>Ingredients</Text>
              <Text style={styles.tabCount}>{addedIngredients.length}</Text>
            </View>
            <View style={[styles.tab, styles.tabInactive]}>
              <Text style={styles.tabTextInactive}>Recipes</Text>
              <Text style={styles.tabCount}>0</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>CookSmart AI</Text>
            <Text style={styles.headerSubtitle}>Recipe Assistant</Text>
          </View>
        </View>

        {/* AI Assistant Section */}
        <View style={styles.aiAssistantCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>🤖 AI Chef Assistant</Text>
            <Text style={styles.betaBadge}>Beta</Text>
          </View>
          <View style={styles.suggestionButtons}>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>What can I make?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>Quick dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>Healthy option</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>Dessert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Display */}
        <ScrollView style={styles.recipeContainer}>
          <Text style={styles.recipeLabel}>AI Recipe Response...</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7BA99C" />
              <Text style={styles.loadingText}>Generating your recipe...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.recipeText}>{recipe}</Text>
              
              {/* Feedback Section */}
              {recipe && !loading && (
                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackTitle}>Was this recipe helpful?</Text>
                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity
                      style={[
                        styles.feedbackButton,
                        feedback === 'like' && styles.feedbackButtonActive
                      ]}
                      onPress={() => handleFeedback('like')}
                    >
                      <Text style={styles.feedbackIcon}>
                        {feedback === 'like' ? '👍' : '👍🏻'}
                      </Text>
                      <Text style={[
                        styles.feedbackButtonText,
                        feedback === 'like' && styles.feedbackButtonTextActive
                      ]}>
                        Like
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.feedbackButton,
                        feedback === 'dislike' && styles.feedbackButtonActive
                      ]}
                      onPress={() => handleFeedback('dislike')}
                    >
                      <Text style={styles.feedbackIcon}>
                        {feedback === 'dislike' ? '👎' : '👎🏻'}
                      </Text>
                      <Text style={[
                        styles.feedbackButtonText,
                        feedback === 'dislike' && styles.feedbackButtonTextActive
                      ]}>
                        Dislike
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {feedback && (
                    <Text style={styles.feedbackThankYou}>
                      Thanks for your feedback! 🙏
                    </Text>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.regenerateButton} onPress={() => generateRecipe()}>
            <Text style={styles.regenerateButtonText}> Regenerate Recipe</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>📚</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTabs}>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Ingredients</Text>
            <Text style={styles.tabCount}>{addedIngredients.length}</Text>
          </View>
          <View style={[styles.tab, styles.tabInactive]}>
            <Text style={styles.tabTextInactive}>Recipes</Text>
            <Text style={styles.tabCount}>0</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerTitle}>CookSmart AI</Text>
          <Text style={styles.headerSubtitle}>Recipe Assistant</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* My Ingredients Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Ingredients</Text>
          <Text style={styles.cardSubtitle}>What's in your kitchen?</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add ingredient..."
              value={ingredientInput}
              onChangeText={setIngredientInput}
              onSubmitEditing={() => addIngredient(ingredientInput)}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => addIngredient(ingredientInput)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>📷 Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>📱 Scan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Quick Add:</Text>
          <View style={styles.quickAddContainer}>
            {quickAddItems.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.quickAddChip}
                onPress={() => addIngredient(item)}
              >
                <Text style={styles.quickAddText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Added ({addedIngredients.length})</Text>
          <View style={styles.addedContainer}>
            {addedIngredients.map((item) => (
              <View key={item} style={styles.addedChip}>
                <Text style={styles.addedText}>{item}</Text>
                <TouchableOpacity onPress={() => removeIngredient(item)}>
                  <Text style={styles.removeText}> ×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* AI Assistant Card */}
        <View style={styles.aiAssistantCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>🤖 AI Chef Assistant</Text>
            <Text style={styles.betaBadge}>Beta</Text>
          </View>
          <View style={styles.suggestionButtons}>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>What can I make?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>Quick dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>Healthy option</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>Dessert</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.aiInput}
            placeholder="Ask me about recipes..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomInfo}>
          <Text style={styles.emojiLarge}>👨‍🍳</Text>
          <Text style={styles.bottomTitle}>Ready to cook?</Text>
          <Text style={styles.bottomSubtitle}>Add ingredients and ask AI for recipe ideas</Text>
        </View>
      </ScrollView>

      {/* Ask AI Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.voiceButton}>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.askButton}
          onPress={() => generateRecipe()}
        >
          <Text style={styles.askButtonText}>Ask AI ({addedIngredients.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📚</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  backButton: {
    fontSize: 24,
    color: '#7BA99C',
  },
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#E8F0EE',
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 4,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    color: '#333',
    marginRight: 4,
  },
  tabTextInactive: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  tabCount: {
    fontSize: 12,
    color: '#666',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#7BA99C',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  actionBtnText: {
    fontSize: 14,
    color: '#666',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    marginTop: 8,
  },
  quickAddContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  quickAddChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  quickAddText: {
    fontSize: 14,
    color: '#666',
  },
  addedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  addedText: {
    fontSize: 14,
    color: '#333',
  },
  removeText: {
    fontSize: 18,
    color: '#666',
    marginLeft: 4,
  },
  aiAssistantCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  betaBadge: {
    backgroundColor: '#E8F0EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    color: '#7BA99C',
  },
  suggestionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  suggestionBtn: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: '#7BA99C',
  },
  aiInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  bottomInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  emojiLarge: {
    fontSize: 48,
    marginBottom: 8,
  },
  bottomTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bottomSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceIcon: {
    fontSize: 20,
  },
  askButton: {
    flex: 1,
    backgroundColor: '#7BA99C',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  askButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#7BA99C',
    borderRadius: 32,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
  },
  recipeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  recipeLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  recipeText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  bottomSection: {
    padding: 16,
  },
  regenerateButton: {
    backgroundColor: '#7BA99C',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  regenerateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // New feedback styles
  feedbackSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8F0EE',
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 6,
  },
  feedbackButtonActive: {
    backgroundColor: '#E8F0EE',
  },
  feedbackIcon: {
    fontSize: 20,
  },
  feedbackButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  feedbackButtonTextActive: {
    color: '#7BA99C',
  },
  feedbackThankYou: {
    marginTop: 12,
    fontSize: 12,
    color: '#7BA99C',
    fontStyle: 'italic',
  },
});
