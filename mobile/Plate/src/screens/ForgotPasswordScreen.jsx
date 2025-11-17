import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Firebase Imports ---
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Check Your Email',
        'A password reset link has been sent to your email. Please check your inbox (and spam folder).',
      );
      // Go back to the Login screen after success
      navigation.goBack();
    } catch (error) {
      console.error(error);
      // We can give a simple error message that covers most cases
      // (invalid email, user not found, etc.)
      Alert.alert('Error', 'Could not send reset link. Please check your email and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.container}>
            {/* Back Arrow */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-back-outline" size={30} color="#6A7F74" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Reset Password</Text>

            {/* Logo */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🔑</Text>
            </View>
            
            <Text style={styles.subtitle}>
              Enter your email address below and we'll send you a link to reset your password.
            </Text>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
              placeholderTextColor="#798E84"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Send Reset Link Button */}
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles based on your existing theme
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6F2',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 20, // Give some bottom padding
  },
  backButton: {
    position: 'absolute',
    top: 20, // Adjust as needed for status bar height
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A7F74',
    marginBottom: 30, // Space below title
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6A7F74',
    textAlign: 'center',
    marginBottom: 30,
    marginHorizontal: 10,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6EAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, // Space below logo
  },
  logoText: {
    fontSize: 50,
    color: '#80A89C',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 8,
    fontSize: 16,
    color: '#6A7F74',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#80A89C',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 25, // Space between input and button
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#80A89C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10, // Space above button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;