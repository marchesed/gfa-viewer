import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import GraphViewer from './screens/GraphViewer';
import { createClient } from '@segment/analytics-react-native';
import { LogBox } from 'react-native';
import * as Sentry from '@sentry/react-native';

Sentry.init({ 
  dsn: 'https://13c39a33c6f1459c91742be51513b473@o4504941124255744.ingest.sentry.io/4504941125500928',
  enableNative: false
});

LogBox.ignoreLogs(['sovran']);

const Stack = createNativeStackNavigator();

function App() {

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

export default Sentry.wrap(App);