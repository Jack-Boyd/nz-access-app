import React from 'react';
import {Text, View, Button, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';

import {startRemoveUser} from '../actions/user';

class SettingsScreen extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <View>
        <Text>Settings Screen</Text>
      </View>
    );
  }
}

export default connect()(SettingsScreen);