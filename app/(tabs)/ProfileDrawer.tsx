// app/(tabs)/ProfileDrawer.tsx
import { Picker } from "@react-native-picker/picker";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React, { memo, useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const Drawer = createDrawerNavigator();

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
const ProfilePreview = memo(({ 
  name, 
  email, 
  genre, 
  isVisible 
}: { 
  name: string; 
  email: string; 
  genre: string; 
  isVisible: boolean; 
}) => {
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
    <Animated.View style={[profileStyles.previewCard, animatedStyle]}>
      <Text style={profileStyles.previewTitle}>Live Profile Preview</Text>
      <View style={profileStyles.previewContent}>
        <Image
          source={{ uri: getGenreImage(genre) }}
          style={profileStyles.previewImage}
        />
        <View style={profileStyles.previewInfo}>
          <Text style={profileStyles.previewName}>
            {name || 'Your Name'}
          </Text>
          <Text style={profileStyles.previewEmail}>
            {email || 'your@email.com'}
          </Text>
          <Text style={profileStyles.previewGenre}>
            {genre ? `♪ ${genre} Lover` : '♪ Music Lover'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});

function ProfileScreen() {
  const user = {
    name: "Hi",
    email: "senshi@gmail.com",
    avatar: require('@/assets/images/senshi.png'),
  };

  return (
    <SafeAreaView style={profileStyles.container}>
      <Image source={user.avatar} style={profileStyles.avatar} />
      <Text style={profileStyles.name}>{user.name}</Text>
      <Text style={profileStyles.email}>{user.email}</Text>

      <TouchableOpacity style={profileStyles.editButton}>
        <Text style={profileStyles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Senshi');
  const [email, setEmail] = useState('senshi@gmail.com');
  const [genre, setGenre] = useState('');

  // Check if preview should be visible (any field has content)
  const shouldShowPreview = Boolean(name || email || genre);

  return (
    <SafeAreaView style={profileStyles.container}>
      <Text style={profileStyles.editHeader}>Edit Profile</Text>
      <Image source={require('@/assets/images/senshi.png')} style={profileStyles.avatar} />

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#888"
        style={profileStyles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        style={profileStyles.input}
      />

      {/* Genre Selection */}
      <Text style={profileStyles.label}>Favorite Music Genre</Text>
      <View style={profileStyles.pickerContainer}>
        <Picker
          selectedValue={genre}
          style={profileStyles.picker}
          onValueChange={(value) => setGenre(value)}
          dropdownIconColor="#1DB954"
        >
          {GENRES.map((genreOption) => (
            <Picker.Item
              key={genreOption.value}
              label={genreOption.label}
              value={genreOption.value}
              color="#fff"
            />
          ))}
        </Picker>
      </View>

      {/* Dynamic Profile Preview */}
      <ProfilePreview 
        name={name}
        email={email}
        genre={genre}
        isVisible={shouldShowPreview}
      />

      <TouchableOpacity
        style={profileStyles.editButton}
        onPress={() => router.back()}
      >
        <Text style={profileStyles.editButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={settingsStyles.container}>
      <Text style={settingsStyles.header}>Settings</Text>

      {/* Profile Section */}
      <TouchableOpacity
        style={settingsStyles.profileButton}
        onPress={() => router.push('/(tabs)/ComponentShowcase')}
      >
        <View style={settingsStyles.profileContent}>
          <Image source={require('@/assets/images/senshi.png')} style={settingsStyles.profileImage} />
          <View style={settingsStyles.profileInfo}>
            <Text style={settingsStyles.profileName}>Senshi</Text>
          </View>
          <View style={settingsStyles.chevronContainer}>
            <Text style={settingsStyles.chevron}>›</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Notifications Toggle */}
      <View style={settingsStyles.settingRow}>
        <Text style={settingsStyles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#555', true: '#1DB954' }}
          thumbColor="#fff"
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={settingsStyles.settingRow}>
        <Text style={settingsStyles.settingText}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          trackColor={{ false: '#555', true: '#1DB954' }}
          thumbColor="#fff"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={settingsStyles.logoutButton}
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text style={settingsStyles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default function ProfileDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#121212' },
        drawerActiveTintColor: '#1DB954',
        drawerInactiveTintColor: '#fff',
        swipeEnabled: true,
        swipeEdgeWidth: 50,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Edit Profile" component={EditProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

/* ----------------- Styles ----------------- */

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editHeader: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#121212',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#121212',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
  },
  // NEW PREVIEW STYLES
  previewCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1DB954',
    marginVertical: 16,
    width: '100%',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  previewEmail: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  previewGenre: {
    fontSize: 12,
    color: '#1DB954',
    fontStyle: 'italic',
  },
});

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
  },
  profileButton: {
    backgroundColor: '#121212',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#888',
    fontSize: 14,
    marginBottom: 6,
  },
  chevronContainer: {
    paddingLeft: 16,
  },
  chevron: {
    color: '#888',
    fontSize: 24,
    fontWeight: '300',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#E53935',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});