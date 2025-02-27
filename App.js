import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import LoginScreen from './app/screens/LoginScreen.js';
import HomeScreen from './app/screens/HomeScreen.js';
import ScheduleScreen from './app/screens/ScheduleScreen.js';
import TicketScreen from './app/screens/Ticket.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./app/assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Bold': require('./app/assets/fonts/Inter_18pt-Bold.ttf'), 
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Ticket" component={TicketScreen} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
