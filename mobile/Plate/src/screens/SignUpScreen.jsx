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
  ScrollView,
  Alert, // Import Alert for showing messages
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Firebase Imports ---
import { auth, db } from '../../firebaseConfig'; // Import from your config file
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // To save user data

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleSignUp = async () => {
    // --- Validation ---
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // --- Firebase Auth & Firestore Logic ---
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created with UID:', user.uid);

      // 2. Save additional user data to Firestore
      // We use the user's UID as the document ID in the 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName,
        email: email,
        mobile: mobile,
        dob: dob,
        uid: user.uid,
      });

      console.log('User data saved to Firestore');
      Alert.alert('Success', 'Account created successfully!');
      
      // Navigate to Login screen or Home screen
      navigation.navigate('Login'); // Or navigation.replace('Home')

    } catch (error) {
      console.error(error);
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'That email address is invalid!');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
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
            {/* Title */}
            <Text style={styles.title}>Sign Up</Text>

            {/* Logo */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🍽️</Text>
            </View>

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor="#798E84"
            />

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

            {/* Mobile Number */}
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              placeholder="+ 123 456 789"
              placeholderTextColor="#798E84"
              keyboardType="phone-pad"
            />

            {/* Date of Birth */}
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="DD / MM / YYYY"
              placeholderTextColor="#798E84"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordField}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                placeholder="••••••••"
                placeholderTextColor="#798E84"
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color="#6A7F74"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordField}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
                placeholder="••••••••"
                placeholderTextColor="#798E84"
              />
              <TouchableOpacity
                onPress={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                style={styles.eyeIcon}
              >
                <Icon
                  name={
                    isConfirmPasswordVisible
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={24}
                  color="#6A7F74"
                />
              </TouchableOpacity>
            </View>

            {/* Terms Text */}
            <Text style={styles.termsText}>
              By continuing, you agree to
              <Text style={styles.termsLink}> Terms of Use</Text> and
              <Text style={styles.termsLink}> Privacy Policy.</Text>
            </Text>

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Log In Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles (No changes here)
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A7F74',
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6EAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 15,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#80A89C',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  passwordField: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#6A7F74',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#80A89C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    color: '#6A7F74',
    fontSize: 14,
  },
  loginLink: {
    color: '#A56A54',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;