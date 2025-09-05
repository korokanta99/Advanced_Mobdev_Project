import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const SpotifyLogin: React.FC = () => {
  const router = useRouter();

  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [year, setYear] = useState<string>("");

  // Generate days and years
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 100 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );

  return (
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
        <Text style={styles.title}>Sign up to start listening</Text>

        {/* Input fields */}
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#aaa"
        />

            <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dobContainer}>
          {/* Month */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={month}
              onValueChange={(value) => setMonth(value)}
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

          {/* Day */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={day}
              onValueChange={(value) => setDay(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Day" value="" color="#aaa" />
              {days.map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </View>

          {/* Year */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={year}
              onValueChange={(value) => setYear(value)}
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


        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("../auth/login")}>
            
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Sign In Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an Account?</Text>
          <TouchableOpacity onPress={() => router.push("../auth/login")}>
            <Text style={styles.signupLink}> Login here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SpotifyLogin;

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
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#121212",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  dobContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginHorizontal: 4,
  },
  picker: {
    color: "#fff",
    height: 50,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#aaa",
    marginHorizontal: 10,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
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
});
