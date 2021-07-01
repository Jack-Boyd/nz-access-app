import React from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, Platform, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {AppStyles} from '../AppStyles';
import IOSStatusBar from './IOSStatusBar';

const ContactScreen = () => {
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <IOSStatusBar/>}
      <ScrollView style={styles.scrollView}>
        <View style={styles.screen}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>Talk to us</Text>
          <Text>We are a community passionate about change. Together, we can empower each other.</Text>
          <TouchableOpacity onPress={() => {
            Linking.openURL('mailto:info@wheeleasy.nz');
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginTop:5,
              color: AppStyles.color.main
            }}>Email us: info@wheeleasy.nz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: AppStyles.container.flex,
    height: AppStyles.container.height,
  },
  scrollView: {
    marginTop: AppStyles.scrollView.marginTop,
  },
  screen: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default connect()(ContactScreen);