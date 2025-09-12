import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const playlists = [
  {
    id: "1",
    title: "Daily Mix 1",
    cover: require("@/assets/images/playlist1.png"),
  },
  {
    id: "2",
    title: "Chill Vibes",
    cover: require("@/assets/images/playlist2.png"),
  },
  {
    id: "3",
    title: "Top 50 Global",
    cover: require("@/assets/images/playlist3.png"),
  },
];

export default function PlaylistScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Row with Profile Button */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(tabs)/ProfileDrawer")} // ✅ go to drawer
          >
            <Ionicons name="person-circle-outline" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="What do you want to listen to?"
          placeholderTextColor="#aaa"
        />

        {/* Playlists Section */}
        <Text style={styles.sectionTitle}>Made For You</Text>
        <View style={styles.playlistRow}>
          {playlists.map((playlist) => (
            <TouchableOpacity key={playlist.id} style={styles.playlistCard}>
              <Image source={playlist.cover} style={styles.coverImage} />
              <Text style={styles.playlistTitle}>{playlist.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bigger Music Player */}
        <Text style={styles.sectionTitle}>Now Playing</Text>
        <View style={styles.bigPlayer}>
          <Image
            source={require("@/assets/images/music.png")}
            style={styles.bigCover}
          />
          <Text style={styles.songTitle}>Don't Stop Me Now</Text>
          <Text style={styles.songArtist}>Queen</Text>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>1:32</Text>
            <Text style={styles.timeText}>3:20</Text>
          </View>

          {/* Player controls */}
          <View style={styles.controls}>
            <TouchableOpacity>
              <Ionicons name="shuffle" size={24} color="#aaa" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="play-skip-back" size={36} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="pause-circle" size={64} color="#1DB954" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="play-skip-forward" size={36} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="repeat" size={24} color="#aaa" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  profileButton: {
    padding: 4,
  },
  searchBar: {
    backgroundColor: "#121212",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  playlistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  playlistCard: {
    width: "30%",
    alignItems: "center",
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  bigPlayer: {
    backgroundColor: "#181818",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  bigCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  songTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  songArtist: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    width: "40%",
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  timeText: {
    color: "#aaa",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 8,
  },
  playButton: {
    marginHorizontal: 12,
  },
});
