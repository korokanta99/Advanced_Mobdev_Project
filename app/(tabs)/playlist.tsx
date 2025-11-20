import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useReducer, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

// ---------------- TYPES ----------------
type Song = { id: number; name: string };

type Action =
  | { type: "ADD"; payload: string }
  | { type: "REMOVE"; payload: number }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "LOAD"; payload: State };

type State = {
  songs: Song[];
  history: string[];
  past: { songs: Song[]; history: string[] }[];
  future: { songs: Song[]; history: string[] }[];
};

const initialState: State = {
  songs: [],
  history: [],
  past: [],
  future: [],
};

// ---------------- REDUCER ----------------
function playlistReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      if (!action.payload.trim()) return state;
      const newSong: Song = { id: Date.now(), name: action.payload };
      return {
        songs: [...state.songs, newSong],
        history: [...state.history, `Added: ${action.payload}`],
        past: [...state.past, { songs: state.songs, history: state.history }],
        future: [],
      };
    }
    case "REMOVE": {
      const removed = state.songs.find((s) => s.id === action.payload);
      return {
        songs: state.songs.filter((s) => s.id !== action.payload),
        history: removed
          ? [...state.history, `Removed: ${removed.name}`]
          : state.history,
        past: [...state.past, { songs: state.songs, history: state.history }],
        future: [],
      };
    }
    case "CLEAR":
      return {
        songs: [],
        history: [...state.history, "Cleared playlist"],
        past: [...state.past, { songs: state.songs, history: state.history }],
        future: [],
      };
    case "UNDO": {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        ...state,
        songs: prev.songs,
        history: prev.history,
        past: newPast,
        future: [
          { songs: state.songs, history: state.history },
          ...state.future,
        ],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        songs: next.songs,
        history: next.history,
        past: [...state.past, { songs: state.songs, history: state.history }],
        future: newFuture,
      };
    }
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

// ---------------- DATA ----------------
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

// ---------------- UI ----------------
export default function PlaylistScreen() {
  const router = useRouter();
  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const [songInput, setSongInput] = useState("");

  // Load persisted state
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem("playlistState");
        if (saved) {
          dispatch({ type: "LOAD", payload: JSON.parse(saved) });
        }
      } catch (e) {
        console.error("Failed to load state:", e);
      }
    };
    loadState();
  }, []);

  // Save state on change
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem("playlistState", JSON.stringify(state));
      } catch (e) {
        console.error("Failed to save state:", e);
      }
    };
    saveState();
  }, [state]);

  const handleAdd = () => {
    dispatch({ type: "ADD", payload: songInput });
    setSongInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            {/* Header Row with Profile Button */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push("/(tabs)/ProfileDrawer")}
              >
                <Ionicons name="person-circle-outline" size={40} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Search Bar (Add Song) */}
            <View style={styles.addRow}>
              <TextInput
                style={styles.searchBar}
                placeholder="Enter song name"
                placeholderTextColor="#aaa"
                value={songInput}
                onChangeText={setSongInput}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Undo / Redo */}
            <View style={styles.undoRedoRow}>
              <TouchableOpacity
                style={styles.undoButton}
                onPress={() => dispatch({ type: "UNDO" })}
              >
                <Text style={styles.addText}>Undo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.redoButton}
                onPress={() => dispatch({ type: "REDO" })}
              >
                <Text style={styles.addText}>Redo</Text>
              </TouchableOpacity>
            </View>

            {/* Your Songs */}
            <Text style={styles.sectionTitle}>Your Songs</Text>
          </>
        }
        data={state.songs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={styles.songRow}
          >
            <Text style={styles.songName}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => dispatch({ type: "REMOVE", payload: item.id })}
            >
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No songs yet</Text>
        }
        ListFooterComponent={
          <>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => dispatch({ type: "CLEAR" })}
            >
              <Text style={styles.addText}>Clear All</Text>
            </TouchableOpacity>

            {/* Made For You Section */}
            <Text style={styles.sectionTitle}>Made For You</Text>
            <View style={styles.playlistRow}>
              {playlists.map((playlist) => (
                <TouchableOpacity key={playlist.id} style={styles.playlistCard}>
                  <Image source={playlist.cover} style={styles.coverImage} />
                  <Text style={styles.playlistTitle}>{playlist.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Now Playing big player */}
            <Text style={styles.sectionTitle}>Now Playing</Text>
            <View style={styles.bigPlayer}>
              <Image
                source={require("@/assets/images/music.png")}
                style={styles.bigCover}
              />
              <Text style={styles.songTitle}>Don't Stop Me Now</Text>
              <Text style={styles.songArtist}>Queen</Text>

              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>1:32</Text>
                <Text style={styles.timeText}>3:20</Text>
              </View>

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
          </>
        }
        contentContainerStyle={styles.scrollContainer}
      />
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 16 },
  profileButton: { padding: 4 },
  addRow: { flexDirection: "row", marginBottom: 20 },
  searchBar: {
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  addText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  songRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#181818",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  songName: { color: "#fff", fontSize: 16 },
  emptyText: { color: "#888", textAlign: "center", marginBottom: 12 },
  clearButton: {
    alignSelf: "center",
    marginBottom: 24,
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
  },
  undoRedoRow: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  undoButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  redoButton: { backgroundColor: "#555", padding: 10, borderRadius: 8 },
  playlistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  playlistCard: { width: "30%", alignItems: "center" },
  coverImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 8 },
  playlistTitle: { color: "#fff", fontSize: 14, textAlign: "center" },
  bigPlayer: {
    backgroundColor: "#181818",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  bigCover: { width: 120, height: 120, borderRadius: 8, marginBottom: 12 },
  songTitle: { color: "#fff", fontSize: 18, fontWeight: "600", textAlign: "center" },
  songArtist: { color: "#aaa", fontSize: 14, marginBottom: 12, textAlign: "center" },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: { width: "40%", height: "100%", backgroundColor: "#1DB954", borderRadius: 2 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 16 },
  timeText: { color: "#aaa", fontSize: 12 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 8,
  },
  playButton: { marginHorizontal: 12 },
});
