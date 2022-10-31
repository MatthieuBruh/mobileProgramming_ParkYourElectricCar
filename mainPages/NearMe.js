import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from'react-native-maps';
import * as Location from'expo-location';
import { Header } from 'react-native-elements';


export default function NearMe({ route, navigation }) {
    const user = route.params.user;
    const [places, setPlaces] = useState([]);
    const [isReady, setReady] = useState(false);
    const [region, setRegion] = useState({
        name: 'Bundesplatz 3, 3003 Bern, Switzerland',
        latitude: 46.946791,
        longitude: 7.444198,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    
    useEffect(() => {
        ( async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();if (status !== 'granted') {
                Alert.alert('No permission to get location')
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            // Faking data
            location.coords.latitude = 46.169306;
            location.coords.longitude = 6.111902;

            setRegion({
                ...region,
                name: 'Near you',
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            let regionLV95 = {};
            await fetch('https://geodesy.geo.admin.ch/reframe/wgs84tolv95?easting=' + location.coords.longitude + '&northing=' + location.coords.latitude + '&format=json')
            .then((response) => response.json())
            .then((jsonLV) => {
                regionLV95 = jsonLV;
            })

            fetch('https://api3.geo.admin.ch/rest/services/all/MapServer/identify?geometry=' + regionLV95.easting + ',' + regionLV95.northing + '&mapExtent=0,0,100,100&imageDisplay=100,100,100&geometryFormat=geojson&geometryType=esriGeometryPoint&lang=fr&layers=all:ch.bfe.ladestellen-elektromobilitaet&returnGeometry=true&tolerance=1000&sr=2056')
            .then((response) => response.json())
            .then((jsonPlaces) => {
                setPlaces(jsonPlaces.results);
            })
        }) ();
    }, []);


    return (
        <View style={styles.container}>
            <Header
                backgroundColor='#da291c'
                leftComponent={{ icon: 'arrow-back', color: '#fff', iconStyle: { color: '#fff' }, onPress: () => navigation.goBack() }}
                centerComponent={{ text: 'Near your position', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home' , color: '#fff', onPress: () => navigation.navigate('Home') }}
            />
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsScale={true}
                    showsTraffic={true}
                    showsBuildings={true}
                    showsPointsOfInterest={true} >
                    {places.map((place, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: place.properties.Latitude,
                                longitude: place.properties.Longitude,
                            }}
                            onPress={() => { navigation.navigate('ParkingSpotDetails', { parkingSpots: place, user: user }); }}
                            title={place.featureID} />
                ))}
                </MapView>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        width: '100%',
        height: '90%',
    }
});