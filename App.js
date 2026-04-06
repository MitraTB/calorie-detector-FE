import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './src/api/apollo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './src/screens/Dashboard';
import AddEntry from './src/screens/AddEntry';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f172a' },
          }}
        >
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="AddEntry" component={AddEntry} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </ApolloProvider>
  );
}
