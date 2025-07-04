import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

export default function Header() {
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState('EN');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectLanguage = (lang) => {
    setSelectedLang(lang);
    setShowDropdown(false);
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.brand}>Movie App</Text>

      <View style={styles.navItems}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navLink}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Details')}>
          <Text style={styles.navLink}>Product</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightItems}>

        <View style={styles.dropdownWrapper}>
          <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
            <Text style={styles.navLink}>{selectedLang}</Text>
            <AntDesign name={showDropdown ? 'up' : 'down'} size={14} color="black" style={{ marginLeft: 5 }} />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownOptions}>
              <TouchableOpacity onPress={() => selectLanguage('EN')}>
                <Text style={styles.langOption}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectLanguage('AR')}>
                <Text style={styles.langOption}>AR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>


        <TouchableOpacity style={styles.watchlist}>
          <FontAwesome name="heart" size={20} color="black" style={{ marginRight: 5 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
  width: '100%',
  backgroundColor: '#FFE353',
  paddingVertical: 20,
  paddingHorizontal: 10,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  rowGap: 10,
},
brand: {
  fontWeight: 'bold',
  fontSize: 18,
  color: '#000',
//   marginRight: 5,
},
navItems: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
navLink: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
},
rightItems: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
dropdownWrapper: {
  position: 'relative',
  zIndex: 10,
},
dropdownHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 6,
  paddingHorizontal: 8,
  paddingVertical: 4,
},
dropdownOptions: {
  position: 'absolute',
  top: 35,
  backgroundColor: '#fff',
  borderRadius: 6,
  elevation: 3,
  paddingVertical: 4,
  width: 80,
},
langOption: {
  paddingVertical: 8,
  paddingHorizontal: 10,
  fontSize: 14,
  color: '#333',
},
watchlist: {
  flexDirection: 'row',
  alignItems: 'center',
},

});
