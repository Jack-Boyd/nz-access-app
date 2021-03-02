import React from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity} from 'react-native';
import {AppStyles} from '../AppStyles';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//checkbox-marked-circle-outline

class ForgotPasswordSuccessScreen extends React.Component {
  constructor(props){
    super();
    this.state = {
      email: '',
      errors: {
        general: '',
        email: '',
      }
    }
  }

  continue = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate("Map");
  }


  render() {
    const {general, email,} = this.state.errors;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            <View style={styles.data}>
              <Text style={styles.successHeading}>Sent!</Text>
              <Text style={styles.successText}>If this address exists in our system, we've sent you a reset email.</Text>
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                color="green"
                size={120}
                style={{
                  marginBottom: 15,
                }}
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={() => this.continue()}>
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
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
  data: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  successHeading:{
    color: "#444444",
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },
  successText: {
    color: "#444444",
    marginBottom: 15,
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: AppStyles.color.main,
    marginTop: 10,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 7,
    paddingBottom: 7,
  }
})

export default connect()(ForgotPasswordSuccessScreen);