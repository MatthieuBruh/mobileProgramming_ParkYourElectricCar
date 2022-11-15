import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import DisplayListSpots from './DisplayListSpots';
import { INIT_FIREBASE } from '../constants';

initializeApp(INIT_FIREBASE);

export default function ParkingSpotDetails({ route, navigation }) {
    const parkingSpot = route.params.parkingSpots;
    const user = route.params.user;
    const [isLoading, setLoading] = useState(true);
    const [parkingsSpotDetails, setParkingsSpotDetails] = useState([]);

    useEffect(() => {
        let url;
        if (parkingSpot.attributes) {
            url = `https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfe.ladestellen-elektromobilitaet&searchText=${parkingSpot.attributes.Street}&searchField=Street&returnGeometry=false`;
            navigation.setOptions({ title: parkingSpot.attributes.Street });
        } else {
            url = `https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfe.ladestellen-elektromobilitaet&searchText=${parkingSpot.properties.Street}&searchField=Street&returnGeometry=false`;
            navigation.setOptions({ title: parkingSpot.properties.Street });
        }
        fetch(url)
        .then((response) => response.json())
        .then((json) => {
            setParkingsSpotDetails(json.results)
            setLoading(false)
        })
    }, []);

    return (
        <View style={styles.container}>
            <Header
                backgroundColor='#da291c'
                leftComponent={{ icon: 'arrow-back', color: '#fff', iconStyle: { color: '#fff' }, onPress: () => navigation.goBack() }}
                centerComponent={{ text: parkingSpot.attributes ? parkingSpot.attributes.Street : parkingSpot.properties.Street, style: { color: '#fff' } }}
                rightComponent={{ icon: 'home' , color: '#fff', onPress: () => navigation.navigate('Home') }}
            />

            {
                isLoading ? <Text>Loading...</Text> :
                (
                    <View style={{ flex: 1, width: '100%'}}>
                        <DisplayListSpots spots={parkingsSpotDetails} user={user}/>
                    </View>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});