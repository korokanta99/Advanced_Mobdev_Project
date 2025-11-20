import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { memo, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
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
  username: string;
  email: string;
  genre: string;
}

interface ValidationErrors {
  username: string;
  email: string;
  genre: string;
}

// Genre options with placeholder images
const GENRES = [
  { label: 'Select a genre', value: '' },
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
    if (!genre) return 'https://via.placeholder.com/100?text=Profile';
    return `https://via.placeholder.com/100?text=${encodeURIComponent(genre)}`;
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.previewCard, animatedStyle]}>
      <Text style={styles.previewTitle}>Profile Preview</Text>
      <View style={styles.previewContent}>
        <Image
          source={{ uri: getGenreImage(formData.genre) }}
          style={styles.profileImage}
        />
        <View style={styles.previewInfo}>
          <Text style={styles.previewUsername}>{formData.username || 'Username'}</Text>
          <Text style={styles.previewEmail}>{formData.email || 'email@example.com'}</Text>
          <Text style={styles.previewGenre}>
            {formData.genre ? `♪ ${formData.genre}` : '♪ No genre selected'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});

export default function ProfileForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    genre: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    username: '',
    email: '',
    genre: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation values
  const usernameShake = useSharedValue(0);
  const emailShake = useSharedValue(0);
  const genreShake = useSharedValue(0);
  const errorFade = useSharedValue(0);

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
      const cachedData = await AsyncStorage.getItem('profileFormData');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setFormData(parsed);
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const cacheFormData = async () => {
    try {
      await AsyncStorage.setItem('profileFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error caching form data:', error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem('profileFormData');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Validation functions
  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    if (username.length < 3 || username.length > 20) {
      return 'Username must be 3-20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateGenre = (genre: string): string => {
    if (!genre) return 'Please select a favorite genre';
    return '';
  };

  // Shake animation function
  const triggerShake = (shakeValue: Animated.SharedValue<number>) => {
    shakeValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  // Handle input changes with real-time validation
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    let error = '';
    switch (field) {
      case 'username':
        error = validateUsername(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'genre':
        error = validateGenre(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));

    // Trigger error animation if there's an error
    if (error) {
      errorFade.value = withTiming(1, { duration: 300 });
      switch (field) {
        case 'username':
          triggerShake(usernameShake);
          break;
        case 'email':
          triggerShake(emailShake);
          break;
        case 'genre':
          triggerShake(genreShake);
          break;
      }
    } else {
      errorFade.value = withTiming(0, { duration: 300 });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate all fields
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const genreError = validateGenre(formData.genre);

    const newErrors = {
      username: usernameError,
      email: emailError,
      genre: genreError,
    };

    setErrors(newErrors);

    // If there are errors, trigger shake animations
    if (usernameError) triggerShake(usernameShake);
    if (emailError) triggerShake(emailShake);
    if (genreError) triggerShake(genreShake);

    // Check if form is valid
    const isValid = !usernameError && !emailError && !genreError;

    if (isValid) {
      // Simulate successful submission
      Alert.alert(
        'Success!',
        'Profile created successfully!',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Clear cache and reset form
              await clearCache();
              setFormData({ username: '', email: '', genre: '' });
              setErrors({ username: '', email: '', genre: '' });
            },
          },
        ]
      );
    } else {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
    }

    setIsSubmitting(false);
  };

  // Animated styles
  const usernameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: usernameShake.value }],
    borderColor: interpolateColor(
      usernameShake.value,
      [-10, 0, 10],
      ['#ff4444', '#1DB954', '#ff4444']
    ),
  }));

  const emailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: emailShake.value }],
    borderColor: interpolateColor(
      emailShake.value,
      [-10, 0, 10],
      ['#ff4444', '#1DB954', '#ff4444']
    ),
  }));

  const genreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: genreShake.value }],
    borderColor: interpolateColor(
      genreShake.value,
      [-10, 0, 10],
      ['#ff4444', '#1DB954', '#ff4444']
    ),
  }));

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Spotify Profile</Text>
          <Text style={styles.subtitle}>Join millions of music lovers</Text>
        </View>

        <View style={styles.form}>
          {/* Username Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            <Animated.View style={[styles.inputContainer, usernameAnimatedStyle]}>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) => handleInputChange('username', text)}
                placeholder="Enter your username"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
            </Animated.View>
            {errors.username ? (
              <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
                {errors.username}
              </Animated.Text>
            ) : null}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <Animated.View style={[styles.inputContainer, emailAnimatedStyle]}>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animated.View>
            {errors.email ? (
              <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
                {errors.email}
              </Animated.Text>
            ) : null}
          </View>

          {/* Genre Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Favorite Genre</Text>
            <Animated.View style={[styles.inputContainer, genreAnimatedStyle]}>
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
                    color="#000"
                  />
                ))}
              </Picker>
            </Animated.View>
            {errors.genre ? (
              <Animated.Text style={[styles.errorText, errorAnimatedStyle]}>
                {errors.genre}
              </Animated.Text>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Preview */}
        <ProfilePreview formData={formData} isVisible={shouldShowPreview} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#b3b3b3',
  },
  form: {
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  picker: {
    height: 50,
    color: '#ffffff',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#1DB954',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 15,
    textAlign: 'center',
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  previewInfo: {
    flex: 1,
  },
  previewUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  previewEmail: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 5,
  },
  previewGenre: {
    fontSize: 14,
    color: '#1DB954',
    fontStyle: 'italic',
  },
});