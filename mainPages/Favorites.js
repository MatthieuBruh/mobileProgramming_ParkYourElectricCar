import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, update, onValue } from'firebase/database';
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

export default function Favorites({ route, navigation }) {
    const [ready, setReady] = useState(false);
    const user = route.params.user;
    const database = getDatabase();
    const [favorites, setFavorites] = useState([]);


    useEffect(() => {
        setFavorites([]);
        let spotsRef = ref(database, 'users/' + user + '/spots/');
        onValue(spotsRef, (snapshot) => {
            const data = snapshot.val();
            if (data == null) {setReady(true); return;}
            const favoritesKeys = Object.keys(data);
            favoritesKeys.forEach((key) => {
                fetch('https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfe.ladestellen-elektromobilitaet&searchText=' + key + '&searchField=EvseID&returnGeometry=false')
                .then((response) => response.json())
                .then((json) => {
                    let spot = json.results[0];
                    if (spot != null) {
                        setFavorites(currentFav => {
                            return [...currentFav, spot];
                        });
                    }
                })
            })
            setReady(true);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Header
                backgroundColor='#da291c'
                leftComponent={{ icon: 'arrow-back', color: '#fff', iconStyle: { color: '#fff' }, onPress: () => navigation.goBack() }}
                centerComponent={{ text: 'Your favorites', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home' , color: '#fff', onPress: () => navigation.navigate('Home') }}
            />

            {
                !ready && <Text>Loading...</Text>
            }
            {
                ready && favorites.length > 0 ?
                ( <DisplayListSpots spots={favorites} user={user} favorite={true} /> ) :
                ( 
                    <View style={styles.noFavorite}>
                        <Text style={styles.noFavoriteText}>You don't have any favorites</Text>
                    </View>
                )
            }
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    noFavorite: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    noFavoriteText: {
        textAlign: 'center',
        fontSize: 18
    }
});