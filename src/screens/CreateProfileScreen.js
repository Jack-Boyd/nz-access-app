import React from 'react';
import {Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {AppStyles} from '../AppStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

class CreateProfileScreen extends React.Component {
  constructor(props){
    super();
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          this.props.navigation.navigate('LoginScreen')
        }}>
          <Text style={styles.profileText}>Login</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            color={AppStyles.color.main}
            size={14}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileRow} onPress={() => {
          this.props.navigation.navigate('RegisterScreen')
        }}>
          <Text style={styles.profileText}>Create Account</Text>
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
    paddingBottom: 12,
    paddingLeft: 10,
    paddingTop: 12,
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

export default CreateProfileScreen;