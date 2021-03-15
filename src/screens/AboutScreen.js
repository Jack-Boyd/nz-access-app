import React from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, TextInput, Button, Platform, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {AppStyles} from '../AppStyles';

class AboutScreen extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <View>
        <Text>About Screen</Text>
      </View>
    );
  }
}

export default connect()(AboutScreen);