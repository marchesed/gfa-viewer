import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import GraphViewer from './screens/GraphViewer';
import {
  createClient,
  AnalyticsProvider,
} from '@segment/analytics-react-native';
import { LogBox } from 'react-native';
import * as Sentry from '@sentry/react-native';
import 'react-native-get-random-values';

Sentry.init({ 
  dsn: 'https://13c39a33c6f1459c91742be51513b473@o4504941124255744.ingest.sentry.io/4504941125500928',
  enableNative: false
});

LogBox.ignoreLogs(['sovran']);

const segmentClient = createClient({
  writeKey: "UETRD4HvZWAI8EtKS8UQJS4hYH9g9GEd",
  trackAppLifecycleEvents: true,
});

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AnalyticsProvider client={segmentClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="GFA Viewer" component={Home} />
          <Stack.Screen options={{ headerBackTitleVisible: false }} name="Map" component={GraphViewer} />
        </Stack.Navigator>
      </NavigationContainer>
    </AnalyticsProvider>
  );
}

export default Sentry.wrap(App);