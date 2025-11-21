import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, Text, View } from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapScreen() {
  const [location, setLocation] = useState(null);

  const requestPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; 
  };

  useEffect(() => {
    const startTracking = async () => {
      const ok = await requestPermission();
      if (!ok) return;

      Geolocation.watchPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        (err) => console.log("Location error:", err),
        { enableHighAccuracy: true, distanceFilter: 5, interval: 3000 }
      );
    };

    startTracking();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!location ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Finding your location…</Text>
        </View>
      ) : (
        <MapView
          style={{ flex: 1 }}
          showsUserLocation
          followsUserLocation
          initialRegion={location}
        >
          <Marker coordinate={location} title="You are here" />
        </MapView>
      )}
    </SafeAreaView>
  );
}
