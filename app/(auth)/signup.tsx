import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Types
interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  month: string;
  day: string;
  year: string;
  username: string;
  email: string;
  genre: string;
}

interface ValidationErrors {
  firstName: string;
  lastName: string;
  password: string;
  birthDate: string;
  username: string;
  email: string;
  genre: string;
}

// Genre options with placeholder images
const GENRES = [
  { label: 'Select your favorite genre', value: '' },
  { label: 'Pop', value: 'Pop' },
  { label: 'Rock', value: 'Rock' },
  { label: 'Jazz', value: 'Jazz' },
  { label: 'Classical', value: 'Classical' },
  { label: 'Hip-Hop', value: 'Hip-Hop' },
];

// Memoized Profile Preview Component
const ProfilePreview = memo(({ formData, isVisible }: { formData: FormData; isVisible: boolean }) => {
  const fadeAnim = useSharedValue(0);
  
  useEffect(() => {
    fadeAnim.value = withTiming(isVisible ? 1 : 0, { duration: 500 });
  }, [isVisible, fadeAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: withSpring(isVisible ? 1 : 0.9) }],
  }));

  const getGenreImage = (genre: string) => {
    if (!genre) return 'https://via.placeholder.com/80?text=Profile';
    return `https://via.placeholder.com/80?text=${encodeURIComponent(genre)}`;
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.previewCard, animatedStyle]}>
      <Text style={styles.previewTitle}>Your Spotify Profile</Text>
      <View style={styles.previewContent}>
        <Image
          source={{ uri: getGenreImage(formData.genre) }}
          style={styles.profileImage}
        />
        <View style={styles.previewInfo}>
          <Text style={styles.previewUsername}>
            {formData.username || `${formData.firstName} ${formData.lastName}`.trim() || 'Your Name'}
          </Text>
          <Text style={styles.previewEmail}>{formData.email || 'your@email.com'}</Text>
          <Text style={styles.previewGenre}>
            {formData.genre ? `♪ ${formData.genre} Lover` : '♪ Music Lover'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});

const SpotifySignup2: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    password: '',
    month: '',
    day: '',
    year: '',
    username: '',
    email: '',
    genre: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    firstName: '',
    lastName: '',
    password: '',
    birthDate: '',
    username: '',
    email: '',
    genre: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation values
  const shakeAnimations = {
    firstName: useSharedValue(0),
    lastName: useSharedValue(0),
    password: useSharedValue(0),
    username: useSharedValue(0),
    email: useSharedValue(0),
    genre: useSharedValue(0),
  };
  const errorFade = useSharedValue(0);

  // Generate days and years
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 100 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );

  // Load cached data on component mount
  useEffect(() => {
    loadCachedData();
  }, []);

  // Cache form data whenever it changes
  useEffect(() => {
    cacheFormData();
  }, [formData]);

  const loadCachedData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('signupFormData');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const cacheFormData = async () => {
    try {
      await AsyncStorage.setItem('signupFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error caching form data:', error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem('signupFormData');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Validation functions
  const validateField = (field: keyof FormData, value: string): string => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name too short';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name too short';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3 || value.length > 20) return 'Username must be 3-20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'genre':
        if (!value) return 'Please select your favorite genre';
        return '';
      default:
        return '';
    }
  };

  const validateBirthDate = (): string => {
    if (!formData.month || !formData.day || !formData.year) {
      return 'Please select your complete birth date';
    }
    return '';
  };

  // Shake animation function
  const triggerShake = (shakeValue: Animated.SharedValue<number>) => {
    shakeValue.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  // Handle input changes with real-time validation
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    // Trigger error animation if there's an error
    if (error && shakeAnimations[field as keyof typeof shakeAnimations]) {
      errorFade.value = withTiming(1, { duration: 300 });
      triggerShake(shakeAnimations[field as keyof typeof shakeAnimations]);
    }
  };

  // Handle date changes
  const handleDateChange = (type: 'month' | 'day' | 'year', value: string) => {
    setFormData(prev => ({ ...prev, [type]: value }));
    
    // Validate birth date
    const newFormData = { ...formData, [type]: value };
    const birthDateError = !newFormData.month || !newFormData.day || !newFormData.year 
      ? 'Please select your complete birth date' : '';
    setErrors(prev => ({ ...prev, birthDate: birthDateError }));
  };

  // Handle form submission
  const handleSignUp = async () => {
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: ValidationErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      password: validateField('password', formData.password),
      birthDate: validateBirthDate(),
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      genre: validateField('genre', formData.genre),
    };

    setErrors(newErrors);

    // Trigger shake animations for errors
    Object.entries(newErrors).forEach(([field, error]) => {
      if (error && shakeAnimations[field as keyof typeof shakeAnimations]) {
        triggerShake(shakeAnimations[field as keyof typeof shakeAnimations]);
      }
    });

    // Check if form is valid
    const isValid = Object.values(newErrors).every(error => !error);

    if (isValid) {
      // Save user profile data for use throughout the app
      try {
        const userProfile = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          genre: formData.genre,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          createdAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // Clear the temporary signup cache
        await clearCache();
        router.push("/(tabs)/playlist");
      } catch (error) {
        console.error('Error saving user profile:', error);
      }
    }

    setIsSubmitting(false);
  };

  // Create animated styles for each field
  const createAnimatedStyle = (field: keyof typeof shakeAnimations) => {
    return useAnimatedStyle(() => ({
      transform: [{ translateX: shakeAnimations[field].value }],
      borderColor: interpolateColor(
        shakeAnimations[field].value,
        [-8, 0, 8],
        ['#ff4444', '#333', '#ff4444']
      ),
    }));
  };

  const errorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: errorFade.value,
  }));

  // Check if preview should be visible
  const shouldShowPreview = Boolean(formData.username || formData.email || formData.genre);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Spotify Logo */}
          <Image
            source={require("@/assets/images/spotify-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Just a few more details to get started</Text>

          {/* Basic Info Section */}
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          {/* Name fields */}
          <Animated.View style={[styles.inputContainer, createAnimatedStyle('firstName')]}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#aaa"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
            />
          </Animated.View>
          {errors.firstName ? (
            <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
              {errors.firstName}
            </Animated.Text>
          ) : null}

          <Animated.View style={[styles.inputContainer, createAnimatedStyle('lastName')]}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
            />
          </Animated.View>
          {errors.lastName ? (
            <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
              {errors.lastName}
            </Animated.Text>
          ) : null}

          <Animated.View style={[styles.inputContainer, createAnimatedStyle('password')]}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
          </Animated.View>
          {errors.password ? (
            <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
              {errors.password}
            </Animated.Text>
          ) : null}

          {/* Date of Birth */}
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.dobContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.month}
                onValueChange={(value) => handleDateChange('month', value)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Month" value="" color="#aaa" />
                <Picker.Item label="January" value="01" />
                <Picker.Item label="February" value="02" />
                <Picker.Item label="March" value="03" />
                <Picker.Item label="April" value="04" />
                <Picker.Item label="May" value="05" />
                <Picker.Item label="June" value="06" />
                <Picker.Item label="July" value="07" />
                <Picker.Item label="August" value="08" />
                <Picker.Item label="September" value="09" />
                <Picker.Item label="October" value="10" />
                <Picker.Item label="November" value="11" />
                <Picker.Item label="December" value="12" />
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.day}
                onValueChange={(value) => handleDateChange('day', value)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Day" value="" color="#aaa" />
                {days.map((d) => (
                  <Picker.Item key={d} label={d} value={d} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.year}
                onValueChange={(value) => handleDateChange('year', value)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Year" value="" color="#aaa" />
                {years.map((y) => (
                  <Picker.Item key={y} label={y} value={y} />
                ))}
              </Picker>
            </View>
          </View>
          {errors.birthDate ? (
            <Text style={styles.errorText}>{errors.birthDate}</Text>
          ) : null}

          {/* Profile Section */}
          <Text style={styles.sectionTitle}>Create Your Profile</Text>

          <Animated.View style={[styles.inputContainer, createAnimatedStyle('username')]}>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor="#aaa"
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
              autoCapitalize="none"
            />
          </Animated.View>
          {errors.username ? (
            <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
              {errors.username}
            </Animated.Text>
          ) : null}

          <Animated.View style={[styles.inputContainer, createAnimatedStyle('email')]}>
            <TextInput
              style={styles.input}
              placeholder="Your email address"
              placeholderTextColor="#aaa"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>
          {errors.email ? (
            <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
              {errors.email}
            </Animated.Text>
          ) : null}

          <Text style={styles.label}>Favorite Music Genre</Text>
          <Animated.View style={[styles.inputContainer, createAnimatedStyle('genre')]}>
            <Picker
              selectedValue={formData.genre}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('genre', value)}
              dropdownIconColor="#1DB954"
            >
              {GENRES.map((genre) => (
                <Picker.Item
                  key={genre.value}
                  label={genre.label}
                  value={genre.value}
                  color="#fff"
                />
              ))}
            </Picker>
          </Animated.View>
          {errors.genre ? (
            <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
              {errors.genre}
            </Animated.Text>
          ) : null}

          {/* Profile Preview */}
          <ProfilePreview formData={formData} isVisible={shouldShowPreview} />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            <Text style={styles.loginButtonText}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an Account?</Text>
            <TouchableOpacity onPress={() => router.push("../(auth)/login")}>
              <Text style={styles.signupLink}> Login here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SpotifySignup2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#1DB954",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    backgroundColor: "#121212",
    marginBottom: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  dobContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginHorizontal: 2,
  },
  picker: {
    color: "#fff",
    height: 50,
    width: "100%",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: "#666",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signupText: {
    color: "#aaa",
    fontSize: 14,
  },
  signupLink: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "bold",
  },
  previewCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1DB954",
    marginVertical: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1DB954",
    marginBottom: 12,
    textAlign: "center",
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  previewEmail: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 4,
  },
  previewGenre: {
    fontSize: 12,
    color: "#1DB954",
    fontStyle: "italic",
  },
});