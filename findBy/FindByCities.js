import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import { initializeApp } from'firebase/app';
import { getDatabase, ref, onValue } from'firebase/database';
import { Button, Input, Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function FindByCities({ route, navigation }) {
    const user = route.params.user;
    // Firebase connection
    const firebaseConfig = {
        apiKey: "AIzaSyDSwV47orAG2kxn7jNLQ8WHtdEO3lfm8lc",
        authDomain: "parkyourelectriccar.firebaseapp.com",
        databaseURL: "https://parkyourelectriccar-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "parkyourelectriccar",
        storageBucket: "parkyourelectriccar.appspot.com",
        messagingSenderId: "305020031978",
        appId: "1:305020031978:web:1fc2e0c1cecc5dec75d893",
        measurementId: "G-5ZS5KRJF8D"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const [streetSearch, setStreetSearch] = useState({
        "attributes": {
            "Street": '',
        }
    });
    const [search, setSearch] = useState('');
    const [municipalities, setMunicipalities] = useState([]);
    const [fMunicipalities, setFMunicipalities] = useState([]);

    /**
     * Get all municipalities from Firebase
     */
    useEffect(() => {
        const itemsRef = ref(database, 'municipalities/');
        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            setMunicipalities(Object.values(data));
            setFMunicipalities(Object.values(data));
        })
    },[]);

    /**
     * This function is called when the user types in the search field.
     * It filters the municipalities based on the search string.
     *
     * @param {String} text 
     */
    const searchMunicipalities = (text) => {
        setSearch(text);
        if (text.length > 0) {
            let filteredMunicipalities = municipalities.filter((municipality) => {
                const itemData = municipality.name.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFMunicipalities(filteredMunicipalities);
        } else {
            setFMunicipalities(municipalities)
        }
    }

    return (
        <View style={styles.container}>
            <Header
                backgroundColor='#da291c'
                leftComponent={{ icon: 'arrow-back', color: '#fff', iconStyle: { color: '#fff' }, onPress: () => navigation.goBack() }}
                centerComponent={{ text: 'Search', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home' , color: '#fff', onPress: () => navigation.navigate('Home') }}
            />
            <View style={ styles.addressView }>
                <Text style={ styles.title }>Search by street Name</Text>
                <View style={ styles.addressSearchView } >
                    <Input
                        placeholder="Street name"
                        onChangeText={text => setStreetSearch({ ...streetSearch, attributes: { Street: text } })}
                        value={streetSearch.attributes.Street} />
                    <Button
                        buttonStyle={{ backgroundColor: '#da291c' }}
                        icon={
                            <Icon
                                name="search"
                                size={15}
                                color="white"
                            />
                        }
                        containerStyle={{
                            marginTop: -20,
                            marginBottom: 0,
                        }}
                        onPress={() => navigation.navigate('ParkingSpotDetails', {parkingSpots: streetSearch, user: user})} />
                </View>
            </View>

            {separator()}

            <View style={ styles.municipalitiesView }>
                <Text style={ styles.title }>Search by municipalities</Text>
                <Input
                    rightIcon={{ type: 'font-awesome', name: 'search' }}
                    placeholder="Search a municipality"
                    value={search}
                    onChangeText={text => searchMunicipalities(text)}
                />

                <FlatList
                    style={{ width: '75%' }}
                    data={fMunicipalities}
                    renderItem={({item}) =>
                        <Button
                            buttonStyle={{ borderColor: 'black', borderWidth: 1, backgroundColor: '#fff' }}
                            titleStyle={{ color: '#da291c' }}
                            type='outline'
                            title={item.name + ' | ' + item.zip}
                            onPress={() => navigation.navigate('FindByMap', {municipality: item, user: user})}
                        />
                    }
                    keyExtractor={(item, index) => index}
                />
            </View>
        </View>
    );
}

const separator = () => {
    return (
        <View
            style={{
            height: 10,
            width: "100%",
            backgroundColor: "#CED0CE",
            marginTop: -20,
            marginBottom: 20,
            }}
        />
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addressView: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
    },
    addressSearchView:{
        flexDirection: 'row',
        width: '75%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
    },
    municipalitiesView: {
        flex: 4,
        width: '75%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});