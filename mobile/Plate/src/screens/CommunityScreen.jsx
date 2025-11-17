import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { styles } from '../styles/mainStyles';
import TabChip from '../components/TabChip';
import BottomNav from '../components/BottomNav';
import { MOCK_RECIPES } from '../constants/data'; // Get mock data
import { auth } from '../../firebaseConfig'; // Import Firebase auth

// This screen now receives `navigation` from the stack navigator
const CommunityScreen = ({ navigation }) => {
  const [category, setCategory] = useState('top');
  const recipes = MOCK_RECIPES; // Use the mock recipes

  const sortedRecipes = useMemo(() => {
    const copy = [...recipes];
    if (category === 'top') {
      return copy.sort((a, b) => b.rating - a.rating);
    }
    if (category === 'newest') {
      return copy.sort((a, b) => Number(b.id) - Number(a.id));
    }
    return copy.sort((a, b) => Number(a.id) - Number(b.id));
  }, [recipes, category]);

  // --- UPDATED: Navigate to RecipeDetail screen with the recipe item ---
  const handleSelectRecipe = (recipe) => {
    navigation.navigate('RecipeDetail', { recipe: recipe });
  };

  // --- UPDATED: Call Firebase sign out ---
  const handleLogout = () => {
    auth.signOut();
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleSelectRecipe(item)} // Use updated handler
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeMeta} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.recipeRatingPill}>
          <Text style={styles.recipeRatingText}>{item.rating.toFixed(1)} ⭐</Text>
        </View>
      </View>
      <View style={styles.recipeFooterRow}>
        <Text style={styles.recipeFooterText}>{item.time}</Text>
        <Text style={styles.recipeFooterText}>{item.difficulty}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Community</Text>
        <View style={styles.topBarIcons}>
          <View style={styles.circleIcon} />
          <View style={[styles.circleIcon, { marginLeft: 8 }]} />
        </View>
      </View>

      <View style={styles.categoryRow}>
        <TabChip
          label="Top Recipes"
          active={category === 'top'}
          onPress={() => setCategory('top')}
        />
        <TabChip
          label="Newest"
          active={category === 'newest'}
          onPress={() => setCategory('newest')}
        />
        <TabChip
          label="Oldest"
          active={category === 'oldest'}
          onPress={() => setCategory('oldest')}
        />
      </View>

      <FlatList
        data={sortedRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      />

      {/* --- UPDATED: Pass correct props to BottomNav --- */}
      <BottomNav
        active="community"
        isLoggedIn={true} // We are in the App Stack, so we are logged in
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
};

export default CommunityScreen;
