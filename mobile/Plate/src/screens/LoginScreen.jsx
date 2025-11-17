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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Firebase Imports ---
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user.uid);
      navigation.replace('Home');
    } catch (error) {
      // console.error(error); // This is safely removed
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Invalid email or password.');
      } else {
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  // --- THIS FUNCTION IS UPDATED ---
  const handleForgotPassword = () => {
    // It no longer shows an Alert, it navigates
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          {/* Logo/Icon Area */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>🍽️</Text>
          </View>

          {/* Login Title */}
          <Text style={styles.loginTitle}>Login</Text>

          {/* Username/Email Input */}
          <Text style={styles.label}>Username/Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor="#798E84"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordField}
              placeholder="••••••••"
              placeholderTextColor="#798E84"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
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

          {/* Forgot Password Button (onPress now works) */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          {/* "No Existing Account?" Text */}
          <Text style={styles.noAccountText}>No Existing Account?</Text>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles (Same as before)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6F2',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 80,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6EAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 50,
    color: '#80A89C',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A7F74',
    marginBottom: 40,
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
    marginBottom: 20,
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
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingRight: 10,
  },
  forgotPasswordText: {
    color: '#6A7F74',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#80A89C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 0,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noAccountText: {
    marginTop: 0,
    color: '#6A7F74',
    fontSize: 14,
    marginBottom: 10,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#80A89C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});

export default LoginScreen;