import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

type Playlist = {
  id: string;
  title: string;
  cover: any;
};

const playlists: Playlist[] = [
  {
    id: "1",
    title: "Chill Vibes",
    cover: require("@/assets/images/playlist1.png"),
  },
  {
    id: "2",
    title: "Workout Hits",
    cover: require("@/assets/images/playlist2.png"),
  },
  {
    id: "3",
    title: "Top 50 Global",
    cover: require("@/assets/images/playlist3.png"),
  },
];

const PlaylistScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Playlists</Text>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.playlistCard}>
            <Image source={item.cover} style={styles.coverImage} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default PlaylistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 40,
  },
  playlistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
