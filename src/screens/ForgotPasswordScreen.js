import React from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity} from 'react-native';
import {AppStyles} from '../AppStyles';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {startSetUser} from '../actions/user';


class ForgotPasswordScreen extends React.Component {
  constructor(props){
    super();
    this.state = {
      email: '',
      errors: {
        email: '',
      }
    }
  }

  updateEmail = (email) => {
    this.setState({
      email
    });
  }

  validate = () => {
    const {email,} = this.state;
    let valid = true;
    let emailError = '';

    if (!email) {
      emailError = 'Please enter a valid email address.';
      valid = false;
    } else {
      if (!email.includes('@')) {
        emailError = 'Please enter a valid email address.';
        valid = false;
      }
    }

    this.setState({
      errors: {
        email: emailError,
      }
    });

    return valid;
  }
  submitForm = () => {
    const validForm = this.validate();
    if (validForm) {
      const {email} = this.state;
      this.setState({
        errors: {
          email: '',
        }
      });

      auth().sendPasswordResetEmail(email).then(() => {
        this.props.navigation.navigate('ForgotPasswordSuccessScreen')
      }).catch(() => {
        this.props.navigation.navigate('ForgotPasswordSuccessScreen')
      });

    }
  }

  render() {
    const {email} = this.state.errors;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  onChange={(e) => this.updateEmail(e.nativeEvent.text)}
                />
                {
                  email != '' && (
                    <Text style={styles.error}>{email}</Text>
                  )
                }
              </View>
            </View>
            <View style={styles.submitSection}>
              <View>
                <TouchableOpacity style={styles.submitButton} onPress={() => this.submitForm()}>
                  <Text style={styles.submitButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.login} onPress={() => this.props.navigation.navigate('LoginScreen')}>Already have an account?</Text>
              <Text style={styles.login} onPress={() => this.props.navigation.navigate('RegisterScreen')}>Need to create an account?</Text>
            </View>
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
  form: {
    marginTop: 5,
  },
  field: {
    marginBottom: 25,
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#eee',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
  },
  error: {
    color: 'red',
  },
  submitSection: {
    marginBottom: 0,
  },
  terms: {
    fontSize: 12,
  },
  login: {
    color: AppStyles.color.main,
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 15,
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

export default connect()(ForgotPasswordScreen);