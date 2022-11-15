import { StyleSheet} from 'react-native';
import { NavigationContainer } from'@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';
import Favorites from './mainPages/Favorites';
import NearMe from './mainPages/NearMe';
import Home from './mainPages/Home';
import FindByCities from './findBy/FindByCities';
import FindByMap from './findBy/FindByMap';
import ParkingSpotDetails from './mainPages/ParkingSpotDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false}} />
        <Stack.Screen name="Favorites" component={Favorites} options={{ headerShown: false }} />
        <Stack.Screen name="NearMe" component={NearMe} options={{ headerShown: false}} />
        <Stack.Screen name="FindByMunicipalities" component={FindByCities} options={{ headerShown: false}} />
        <Stack.Screen name="FindByMap" component={FindByMap} options={{ headerShown: false}} />
        <Stack.Screen name="ParkingSpotDetails" component={ParkingSpotDetails} options={{ title:'Title', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
