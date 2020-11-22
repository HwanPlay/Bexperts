import React, { useState, useEffect } from 'react';
import { NavigationContainer, StatusBar } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import { StyleSheet } from 'react-native';
import LoginScreen from './screens/Login';
import MainScreen from './screens/Main';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <StatusBar style="auto" /> */}
      <Stack.Navigator hideStatusBar headerMode="none">
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
// });
