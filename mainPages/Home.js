import React, { useState, useEffect, promptAsync } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Button, Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, update, onValue } from'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';


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

WebBrowser.maybeCompleteAuthSession();

export default function Home({ navigation }) {
    const [user, setUser] = useState({});
    /*const [user, setUser] = useState({
        uid: 'R3K4U9nfcRNvm95rJJBDVqJDJ4o2'
    });*/
    const database = getDatabase();
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
            clientId: '305020031978-t4jlmefhr1qjnarafuounakgb26cmsvg.apps.googleusercontent.com',
        },
    );
    
    useEffect(() => {
        if (response?.type === 'success') {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const auth = getAuth();
          signInWithCredential(auth, credential)
            .then((result) => {
              setUser(result.user);
              const user = result.user;
              const uid = user.uid;
              const email = user.email;
              const name = user.displayName;
              const photo = user.photoURL;
              update(ref(database, 'users/' + uid), {
                uid: uid,
                email: email,
                name: name,
                photo: photo,
              });
    
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              const email = error.email;
              const credential = GoogleAuthProvider.credentialFromError(error);
            });
        }
      }, [response]);

    return (
        <View style={styles.container}>
            <Header
                backgroundColor='#da291c'
                centerComponent={ !user.uid ? 
                    <Text style={{ color: '#fff', fontSize: 20 }}>Welcome</Text>
                :
                    <Text style={{ color: '#fff', fontSize: 20 }}>Welcome {user.displayName}</Text>
                }

                rightComponent={ !user.uid ?
                    (
                        <Button
                        buttonStyle={styles.button}
                        icon={ <Icon name="google" size={18} color="white" /> }
                        onPress={() => promptAsync()}/>
                    ) : (
                        <Button
                        buttonStyle={styles.button}
                        icon={ <Icon name="sign-out" size={18} color="white" /> }
                        onPress={() => setUser({})}/>
                    )
                    
                }

            />
            <ImageBackground source={require('../assets/background.jpg')} style={styles.image}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Swiss charging stations for electric cars</Text>
            </View>

            <Button
                buttonStyle={styles.button}
                icon={ <Icon name='star' size={15} color="white" /> }
                containerStyle={styles.myContainerStyle}
                title=" Favorites"
                disabled={ !user.uid }
                onPress={() => navigation.navigate('Favorites', {
                    user: user.uid,
                } )}/>

            <Button
                buttonStyle={styles.button}
                icon={ <Icon name="map-marker" size={15} color="white" /> }
                containerStyle={styles.myContainerStyle}
                title=" Near me"
                onPress={() => navigation.navigate('NearMe', {
                    user: user.uid,
                })}/>
            
            <Button
                buttonStyle={styles.button}
                icon={ <Icon name="search" size={15} color="white" /> }
                containerStyle={styles.myContainerStyle}
                title=" Search"
                onPress={() => navigation.navigate('FindByMunicipalities', {
                    user: user.uid,
                })}/>
            </ImageBackground>

           
        </View>
    );
}

/*

 {
                user.uid ? (
                    <View style={{marginBottom: 20, width: '100%'}}>
                        <Text style={styles.userText}>Welcome {user.displayName}</Text>
                    </View>
                    
                    
                ) : (
                    <View style={{marginBottom: 20}}>
                        <Button
                            buttonStyle={styles.button}
                            icon={ <Icon name="google" size={15} color="white" /> }
                            onPress={() => promptAsync()}/>
                    </View>
                )
            }

*/



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      
    },
    titleContainer: {
      width: '100%',
      height: '30%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 20,
      width: '60%',
      height: '50%',
      textAlign: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#da291c',
    },
    myContainerStyle: {
        width: 150,
        marginHorizontal: 50,
        marginVertical: 10,
    }
});