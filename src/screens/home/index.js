import React from 'react';
import Header from '../../components/header';
import RenderHomeCards from '../../components/RenderHomeCards';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Details from '../../screens/details';
import Entypo from '@expo/vector-icons/Entypo';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Details"
        component={Details}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="info-with-circle" size={size} color={color} />
          ),
          tabBarLabel: 'Details',
        }}
      />
    </Tab.Navigator>
  );
}

export default function Home() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <RenderHomeCards />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
