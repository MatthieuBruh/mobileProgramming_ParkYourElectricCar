import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from'react-native-maps';
import { Header } from 'react-native-elements';


export default function FindByMap({ route, navigation }) {
    const user = route.params.user;
    const municipality = route.params.municipality;
    const [isLoading, setLoading] = useState(true);
    const [parkingSpots, setParkingSpots] = useState([]);
    const [region, setRegion] = useState({
        latitude: 46.8,
        longitude: 8.2,
        latitudeDelta: 5,
        longitudeDelta: 5,
    });

    /**
     * Fetches the parking spots from the API
     * We use the zip code of the municipality to the API to get the parking spots
     */
    useEffect(() => {
        fetch(`https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfe.ladestellen-elektromobilitaet&searchText=${municipality.zip}&searchField=PostalCode&returnGeometry=false`)
        .then((response) => response.json())
        .then((json) => {
            setParkingSpots(json.results)
            if (json.results.length > 0) {
                setRegion({
                    latitude: json.results[0].attributes.Latitude,
                    longitude: json.results[0].attributes.Longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0922,
                })
            }
            setLoading(false)
        })
    }, []);


    return (
        <View style={styles.container}>
            <Header
                backgroundColor='#da291c'
                leftComponent={{ icon: 'arrow-back', color: '#fff', iconStyle: { color: '#fff' }, onPress: () => navigation.goBack() }}
                centerComponent={{ text: 'Your search area', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home' , color: '#fff', onPress: () => navigation.navigate('Home') }}
            />

            { isLoading ?
                <View style={{ flex: 1}}>
                    <Text>Loading...</Text>
                </View>
                : (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={region}
                        onRegionChangeComplete={region => setRegion(region)}>
                        {parkingSpots.map((parkingSpot, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: parkingSpot.attributes.Latitude,
                                    longitude: parkingSpot.attributes.Longitude,
                                }}
                                onPress={() => navigation.navigate('ParkingSpotDetails', { parkingSpots: parkingSpot, user: user })} />
                        ))}
                    </MapView>
                </View>
            )}

            
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