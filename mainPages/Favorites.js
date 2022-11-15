import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from'firebase/database';
import DisplayListSpots from './DisplayListSpots';
import { INIT_FIREBASE } from '../constants';

initializeApp(INIT_FIREBASE);

export default function Favorites({ route, navigation }) {
    const [ready, setReady] = useState(false);
    const user = route.params.user;
    const database = getDatabase();
    const [favorites, setFavorites] = useState([]);


    /**
     * This function is used to get the user's favorites from the database
     * Then we fetch the API to get the details of the parking spots
     */
    const getFavorites = () => {
        setFavorites(currentFav => {
            return [];
        });
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
    };

    /**
     * This function is used to call the getFavorites function when the component is mounted
     */
    useEffect(() => {
        getFavorites();
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
                ( <DisplayListSpots spots={favorites} setFavorites={setFavorites} user={user} favorite={true} /> ) :
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