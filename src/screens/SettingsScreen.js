import React from 'react';
import {Text, View, StyleSheet, Dimensions, Linking, TextInput, Button, Platform, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {AppStyles} from '../AppStyles';
import IOSStatusBar from './IOSStatusBar';

class SettingsScreen extends React.Component {
  constructor(props){
    super();
  }
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <IOSStatusBar/>}
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          this.props.navigation.navigate('SettingsAboutScreen')
        }}>
          <Text style={styles.profileText}>About Us</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            color={AppStyles.color.main}
            size={14}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          this.props.navigation.navigate('SettingsContactScreen')
        }}>
          <Text style={styles.profileText}>Contact Us</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            color={AppStyles.color.main}
            size={14}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          Linking.openURL('https://www.facebook.com/');
        }}>
          <Text style={styles.profileText}>Terms & Conditions</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            color={AppStyles.color.main}
            size={14}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          Linking.openURL('https://www.facebook.com/');
        }}>
          <Text style={styles.profileText}>Privacy Policy</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            color={AppStyles.color.main}
            size={14}
            style={styles.profileIcon}
          />
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


export default connect()(SettingsScreen);