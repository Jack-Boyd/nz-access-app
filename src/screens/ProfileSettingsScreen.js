import React from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, TextInput, Button, Platform, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';

import {startRemoveUser} from '../actions/user';
import {AppStyles} from '../AppStyles';

class ProfileSettingsScreen extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          this.props.navigation.navigate('ProfileEditScreen')
        }}>
          <Text style={styles.profileText}>Edit Profile</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            color={AppStyles.color.main}
            size={14}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          auth().signOut().then(() => {
            this.props.dispatch(startRemoveUser());
            this.props.dispatch({ type: "LOGOUT" });
            this.props.navigation.navigate('MapScreen');
          }).catch((error) => {
              // An error happened.
          });
        }}>
          <Text style={styles.profileText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: AppStyles.container.flex,
    height: AppStyles.container.height,
  },
  profileRow: {
    alignItems: 'flex-end',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 10,
    paddingTop: 16,
    width: Dimensions.get('screen').width,
  },
  profileText: {
    color: AppStyles.color.main,
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    width: Dimensions.get('screen').width - 35,
  },
  profileIcon: {
    color: AppStyles.color.main,
    alignSelf: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
})

export default connect()(ProfileSettingsScreen);