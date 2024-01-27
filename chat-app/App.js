import { StyleSheet, Text, View, LogBox, Alert } from "react-native";
import { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";

// import screens
import Start from "./components/Start";
import Chat from "./components/Chat";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// create the naviagator
const Stack = createNativeStackNavigator();

// firebase
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const App = () => {

  LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

  const connectionStatus = useNetInfo();

  const firebaseConfig = {
    apiKey: "AIzaSyBn0sEeyBOu9wwobHXXSnq7h9sDaWMEBOs",
    authDomain: "chat-app-54d0c.firebaseapp.com",
    projectId: "chat-app-54d0c",
    storageBucket: "chat-app-54d0c.appspot.com",
    messagingSenderId: "96108506966",
    appId: "1:96108506966:web:940dfa9e924b8b778930f7"
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (

    
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              db={db}
              storage={storage}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;