import { Tabs } from 'expo-router';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8E8E93",

        tabBarStyle: {
          backgroundColor: "#0B0B0C",
          borderTopWidth: 0,
          elevation: 0,
          height: 62,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 22 : 10,

          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 14 : 12,
          borderRadius: 18,

          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
        },

        tabBarShowLabel: false,

        tabBarItemStyle: {
          borderRadius: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name={focused ? 'dumbbell' : 'dumbbell'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
