import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { ListItem, Badge, Button, Icon } from 'react-native-elements';
import { Linking } from 'react-native';
import { getDatabase, ref, update } from'firebase/database';

export default function DisplayListSpots(props) {
    const parkingsSpotDetails = props.spots;
    const user = props.user;
    const favorite = props.favorite;

    /**
     * This function is used to save the parking spot in the user's favorites
     * @param {*} feature_id corresponds to the id of the parking spot
     */
    const saveParkingSpot = (feature_id) => {
        const database = getDatabase();
        update( ref(database, 'users/' + user + '/spots/'),{
            [feature_id]: true
        });
    }
    
    /**
     * This function is used to remove the parking spot from the user's favorites
     * @param {*} feature_id corresponds to the id of the parking spot
     */
    const removeParkingSpot = (feature_id) => {
        const database = getDatabase();
        update( ref(database, 'users/' + user + '/spots/'),{
            [feature_id]: null
        });
        props.setFavorites(currentFav => {
            return [];
        });
    }

    /**
     * This function is used to ensure that the user wants to make an itinerary to a unavailable parking spot
     * @returns 
     */
    const verify = () => {
        return new Promise((resolve, reject) => {
            Alert.alert(
                'Station may not be available',
                'This station is marked as unavailable. Do you want to continue?',
                [
                    {text: 'YES', onPress: () => resolve(true) },
                    {text: 'NO', onPress: () => resolve(false) }
                ],
                { cancelable: false }
            )
        })
    }

    /**
     * This function is used to make an itinerary to the parking spot
     * @param {*} spot 
     * @returns 
     */
    const goTo = async (spot) => {
        if (spot.attributes.Availability !== 'Available') {
            if (!await verify() ) {
                return;
            } 
        }
        Linking.openURL(`https://maps.google.com/?q=${spot.attributes.Latitude},${spot.attributes.Longitude}`)
    }

    return(
        <ScrollView style={styles.scroll} >
            {parkingsSpotDetails.map((ps) => (
                <ListItem.Swipeable key={ps.EvseID} bottomDivider
                    rightContent={
                        <View style={{
                            backgroundColor: ps.attributes.Availability === 'Available' ? '#00b300' : '#ff0000',
                            }}>
                            {
                                !favorite ?
                                (
                                    <Button
                                    disabled={!user}
                                    type='clear'
                                    icon={<Icon name="star" type="font-awesome" color="orange" size={30} />}
                                    onPress={() => saveParkingSpot(ps.attributes.EvseID)}
                                    buttonStyle={{ minHeight: '50%' }} />
                                ) :
                                (
                                    <Button
                                    disabled={!user}
                                    type='clear'
                                    icon={<Icon name="delete" color="red" size={30} />}
                                    onPress={() => removeParkingSpot(ps.attributes.EvseID)}
                                    buttonStyle={{ minHeight: '50%' }} />
                                )
                            }
                            
                            {listSeparator()}
                            <Button
                                type='clear'
                                onPress={() => goTo(ps)}
                                icon={<Icon name='map' type='font-awesome' size={30} color='black' />}
                                buttonStyle={{ minHeight: '50%' }} />

                        </View>
                    }>

                    <ListItem.Content>
                        <ListItem.Title style={{ width: '100%', textAlign: 'center', fontSize: 18, marginTop: 4 }}>
                            {ps.attributes.EvseID}
                        </ListItem.Title>
                        <ListItem.Subtitle style={{width: '100%', textAlign: 'center'}}>
                            {ps.attributes.Street + ', ' + ps.attributes.PostalCode + ' ' + ps.attributes.City}
                        </ListItem.Subtitle>

                        <ListItem.Title style={{ width: '100%', left: '2%'}}>
                                Payments methods:
                        </ListItem.Title>
                        {ps.attributes.AuthenticationModes.map((paymentMethod) => (
                            <ListItem.Subtitle style={{ width: '100%', left: '4%'}}>° {paymentMethod}</ListItem.Subtitle>
                        ))}

                        <ListItem.Title style={{ width: '100%', left: '2%'}} >
                            Operator: {ps.attributes.OperatorName}
                        </ListItem.Title>
                        <ListItem.Subtitle style={{ width: '100%', left: '4%'}}>
                            <Icon name='phone' type='font-awesome' color='#da291c' size={20}
                            onPress={() => Linking.openURL(`tel:${ps.attributes.HotlinePhoneNumber}`)} />
                            <Text> {ps.attributes.HotlinePhoneNumber}</Text>
                        </ListItem.Subtitle>

                        <ListItem.Subtitle style={{ width: '100%', left: '4%'}}>
                            <Icon name='internet-explorer' type='font-awesome' color='#da291c' size={20}
                                onPress={() => Linking.openURL(`${ps.attributes.ProviderURL}`)} />
                            <Text> {ps.attributes.ProviderURL}</Text>
                        </ListItem.Subtitle>

                        <Badge
                            width={'100%'}
                            height={'100%'}
                            status= {ps.attributes.Availability === 'Available' ? 'success' : 'error' }
                            containerStyle={{ position: 'absolute', top: -4, right: -4, width: '100%' }}
                            badgeStyle={ ps.attributes.Availability === 'Unknown' ? { backgroundColor: 'grey', width: '100%' } : null }
                        />
                    </ListItem.Content>
                </ListItem.Swipeable>
               
            ))}
        </ScrollView >
    );
};


const listSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "#CED0CE",
        }} />
    );
  }


const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'white',
    }
});