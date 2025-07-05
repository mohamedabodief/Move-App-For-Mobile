import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState("EN");
  const [showDropdown, setShowDropdown] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // ====== Get favorites count ======
  useEffect(() => {
    const getFavoritesCount = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites) {
          setFavoritesCount(JSON.parse(favorites).length);
        }
      } catch (error) {
        console.error("Error getting favorites count:", error);
      }
    };

    getFavoritesCount();
    const interval = setInterval(getFavoritesCount, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectLanguage = (lang) => {
    setSelectedLang(lang);
    setShowDropdown(false);
  };

  return (
    <View style={styles.navbar}>
      <StatusBar backgroundColor={"#FFE353"} barStyle={`dark-content`} />
      <Text style={styles.brand}>Movie App</Text>

      <View style={styles.rightItems}>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={styles.dropdownHeader}
          >
            <Text style={styles.navLink}>{selectedLang}</Text>
            <AntDesign
              name={showDropdown ? "up" : "down"}
              size={14}
              color="black"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownOptions}>
              <TouchableOpacity onPress={() => selectLanguage("EN")}>
                <Text style={styles.langOption}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectLanguage("AR")}>
                <Text style={styles.langOption}>AR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ====== Watchlist button with counter ====== */}
        <TouchableOpacity
          style={styles.watchlist}
          onPress={() => navigation.navigate("WatchList")}
        >
          <FontAwesome
            name="heart"
            size={20}
            color="black"
            style={{ marginRight: 5 }}
          />
          {favoritesCount > 0 && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{favoritesCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    backgroundColor: "#FFE353",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    rowGap: 10,
  },
  brand: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  navItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  rightItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 10,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownOptions: {
    position: "absolute",
    top: 35,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 3,
    paddingVertical: 4,
    width: 80,
  },
  langOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  watchlist: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  counter: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
