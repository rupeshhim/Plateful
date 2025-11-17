import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { API_URL } from '../constants/api';
import { styles } from '../styles/mainStyles';
import StarRow from '../components/StarRow';
import BottomNav from '../components/BottomNav';
import { auth } from '../../firebaseConfig'; // Import Firebase auth

// --- UPDATED: Receive `route` and `navigation` from navigator ---
const RecipeDetailScreen = ({ route, navigation }) => {
  // --- UPDATED: Get recipe from navigation parameters ---
  const { recipe } = route.params;

  const [selectedRating, setSelectedRating] = useState(0);
  const [averageRating, setAverageRating] = useState(recipe.rating);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // (This fetch logic is unchanged and fine)
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await fetch(`${API_URL}/ratings`);
        const data = await res.json();
        if (typeof data.averageRating === 'number') {
          setAverageRating(data.averageRating);
        }
        if (typeof data.totalRatings === 'number') {
          setTotalRatings(data.totalRatings);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [recipe]); // Add recipe.id to dep array if stats are per-recipe

  const handleSubmitRating = async () => {
    // --- UPDATED: Get current user from Firebase ---
    const user = auth.currentUser;

    if (!user) {
      // This should not happen if we are in the App Stack, but a good safeguard
      Alert.alert(
        'Login required',
        'You need to be logged in to rate this recipe.',
      );
      return;
    }

    if (!selectedRating) {
      Alert.alert('Select a rating', 'Tap a star 1–5.');
      return;
    }

    try {
      setSubmitting(true);
      
      // --- IMPORTANT: Get the Firebase JWT token ---
      const firebaseToken = await user.getIdToken();

      const res = await fetch(`${API_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // --- UPDATED: Send the Firebase token to your server ---
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({ rating: selectedRating }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.error || 'Failed to submit rating');
        return;
      }

      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
      Alert.alert('Thanks!', 'Your rating has been submitted.');
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topBar}>
        {/* --- UPDATED: Use navigation.goBack() --- */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{recipe.title}</Text>
        <View style={styles.topBarIcons}>
          <View style={styles.circleIcon} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: recipe.image }} style={styles.detailImage} />

        <View style={styles.detailSummaryRow}>
          <View>
            <Text style={styles.detailTitle}>{recipe.title}</Text>
            <Text style={styles.detailMeta}>
              {recipe.time} • {recipe.difficulty}
            </Text>
          </View>
          <View style={styles.detailRatingPill}>
            <Text style={styles.detailRatingText}>
              {averageRating.toFixed(1)} ⭐
            </Text>
            <Text style={styles.detailRatingSub}>
              {loadingStats ? 'Loading…' : `${totalRatings} ratings`}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Details</Text>
        <Text style={styles.detailDescription}>{recipe.description}</Text>

        <Text style={styles.sectionHeading}>Ingredients</Text>
        {recipe.ingredients.map((line, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{line}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>Steps</Text>
        {recipe.steps.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        <View style={styles.ratingBox}>
          <Text style={styles.sectionHeading}>Rate this recipe</Text>
          {/* We don't need the 'loginHint' anymore, as user must be logged in to see this */}
          <StarRow rating={selectedRating} onChange={setSelectedRating} />
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 14 }]}
            onPress={handleSubmitRating}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Submit Rating</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- UPDATED: Pass correct props --- */}
      <BottomNav
        active="community"
        isLoggedIn={true}
        onLogout={() => auth.signOut()}
      />
    </SafeAreaView>
  );
};

export default RecipeDetailScreen;
