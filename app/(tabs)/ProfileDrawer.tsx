// app/(tabs)/ProfileDrawer.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const Drawer = createDrawerNavigator();

function ProfileScreen() {
  const user = {
    name: "Senshi",
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

      <TouchableOpacity
        style={profileStyles.editButton}
        onPress={() => router.back()}
      >
        <Text style={profileStyles.editButtonText}>Save</Text>
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
        swipeEnabled: true,       // ✅ moved inside screenOptions
        swipeEdgeWidth: 50,       // ✅ correct prop name (edgeWidth → swipeEdgeWidth)
        drawerType: 'slide',      // ✅ also belongs here
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
