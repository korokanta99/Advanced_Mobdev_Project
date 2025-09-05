import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const SettingsScreen: React.FC = () => {
  const router = useRouter();

  // Local state for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Profile Section */}
      <TouchableOpacity 
        style={styles.profileButton} 
        onPress={() => router.push("/ComponentShowcase")} // Navigate to profile screen
      >
        <View style={styles.profileContent}>
          <Image 
            source={require('@/assets/images/senshi.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Senshi</Text>
            <Text style={styles.profileEmail}>senshi@gmail.com</Text>
          </View>
          <View style={styles.chevronContainer}>
            <Text style={styles.chevron}>›</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Notifications Toggle */}
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#555", true: "#1DB954" }}
          thumbColor="#fff"
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          trackColor={{ false: "#555", true: "#1DB954" }}
          thumbColor="#fff"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => router.replace("/login")} // ✅ replace so user can't go back
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
    textAlign: "center",
  },
  profileButton: {
    backgroundColor: "#121212",
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    color: "#888",
    fontSize: 14,
    marginBottom: 6,
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "#888",
    fontSize: 13,
  },
  statDivider: {
    color: "#888",
    fontSize: 13,
    marginHorizontal: 8,
  },
  chevronContainer: {
    paddingLeft: 16,
  },
  chevron: {
    color: "#888",
    fontSize: 24,
    fontWeight: "300",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingText: {
    color: "#fff",
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});