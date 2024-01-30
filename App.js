import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, LgoinScreen, SignUpScreen, SplashScreen, Message, Gallery, Map, ChatScreen, Catalog, Profile, AddToChatScreen, Achievement } from "./screens";
import { Provider } from "react-redux";  // Corrected import statement
import Store from "./context/Store";


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LgoinScreen" component={LgoinScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="Gallery" component={Gallery} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="Catalog" component={Catalog} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="AddToChatScreen" component={AddToChatScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Achievement" component={Achievement} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
