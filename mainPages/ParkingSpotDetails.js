import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { ListItem, Badge, Button, Icon, Header } from 'react-native-elements';
import { Linking } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from'firebase/database';
import DisplayListSpots from './DisplayListSpots';

initializeApp({
    apiKey: "AIzaSyDSwV47orAG2kxn7jNLQ8WHtdEO3lfm8lc",
    authDomain: "parkyourelectriccar.firebaseapp.com",
    databaseURL: "https://parkyourelectriccar-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "parkyourelectriccar",
    storageBucket: "parkyourelectriccar.appspot.com",
    messagingSenderId: "305020031978",
    appId: "1:305020031978:web:1fc2e0c1cecc5dec75d893",
    measurementId: "G-5ZS5KRJF8D"
});

export default function ParkingSpotDetails({ route, navigation }) {
    const parkingSpot = route.params.parkingSpots;
    const user = route.params.user;
    const [isLoading, setLoading] = useState(true);
    const [parkingsSpotDetails, setParkingsSpotDetails] = useState([]);


    const saveParkingSpot = (feature_id) => {
        const database = getDatabase();
        update( ref(database, 'users/' + user + '/spots/'),{
            [feature_id]: true
        });
    }

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