import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import GraphViewer from './screens/GraphViewer';
import { createClient } from '@segment/analytics-react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['sovran']);

const Stack = createNativeStackNavigator();

export default function App() {

  if (process.env.NODE_ENV !== 'development') {
    createClient({
      writeKey: "UETRD4HvZWAI8EtKS8UQJS4hYH9g9GEd",
      trackAppLifecycleEvents: true,
    });
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="GFA Viewer" component={Home} />
        <Stack.Screen name="Map" component={GraphViewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}