import React from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Button, Platform, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import {startSetUser} from '../actions/user';
import {AppStyles} from '../AppStyles';
import loginFirebaseWithFacebook from '../selectors/facebook';

class LoginScreen extends React.Component {
  constructor(props){
    super();
    this.state = {
      email: '',
      password: '',
      errors: {
        general: '',
        email: '',
        password: '',
      }
    }
  }

  updateEmail = (email) => {this.setState({email});}

  updatePassword = (password) => {this.setState({password});}

  validate = () => {
    const {email, password,} = this.state;
    let valid = true;
    let emailError = '', passwordError = '';

    if (!email) {
      emailError = 'Please enter a valid email address.';
      valid = false;
    } else {
      if (!email.includes('@')) {
        emailError = 'Please enter a valid email address.';
        valid = false;
      }
    }

    if (!password) {
      passwordError = 'Please enter your password.';
      valid = false;
    }

    this.setState({
      errors: {
        email: emailError,
        password: passwordError,
      }
    });

    return valid;
  }

  facebookLogin = () => {
    const ctx = this;
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            const PROFILE_REQUEST_PARAMS = {
              fields: {
                string: 'id, name, email, first_name, last_name',
              },
            };
            const profileRequest = new GraphRequest(
              '/me',
              {accessToken, parameters: PROFILE_REQUEST_PARAMS},
              (error, result) => {
                if (error) {
                  console.log('login info has error: ' + error);
                } else {
                  console.log('result:', result);
                  loginFirebaseWithFacebook(result, ctx).then(authId => {
                    if (authId) {
                      ctx.props.dispatch(startSetUser(authId.id));
                      ctx.props.dispatch({ type: "LOGIN", id: authId.id });
                      ctx.props.navigation.navigate("Map");
                    } else {
                      ctx.setState({errors: {general: 'Facebook email already in use for existing user. Please login regularly, or select forgot password.',}});
                    }
                  }).catch(error => {
                    console.log('facebook promise error: ', error)
                    ctx.setState({errors: {general: 'Something went wrong. Please try again.',}});
                  });
                }
              },
            );
            new GraphRequestManager().addRequest(profileRequest).start();
          }).catch((error) => console.log('E: ', error));
        }
      },
      function(error) {
        ctx.setState({errors: {general: 'Login fail.',}});
        console.log('Login fail with error: ' + error);
      },
    );
  };

  submitForm = () => {
    const ctx = this;
    const validForm = this.validate();
    if (validForm) {
      const {email, password} = this.state;
      this.setState({
        errors: {
          email: '',
          password: '',
        }
      });

      auth().signInWithEmailAndPassword(email, password).then((user) => {
        if (user.user.uid) {
          this.props.dispatch(startSetUser(user.user.uid));
          this.props.dispatch({ type: "LOGIN", id: user.user.uid });
          this.props.navigation.navigate("Map");
        }
        else {
          ctx.setState({errors: {general: 'Invalid email and/or password. Please try again or select forgot your password.',}});
          return;
        }
      }).catch((error) => {
        ctx.setState({errors: {general: 'Invalid email and/or password. Please try again or select forgot your password.',}});
      });

    }
  }

  render() {
    const {general, email, password,} = this.state.errors;
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
              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  onChange={(e) => this.updatePassword(e.nativeEvent.text)}
                />
                {
                  password != '' && (
                    <Text style={styles.error}>{password}</Text>
                  )
                }
              </View>
            </View>
            {
              general != '' && (
                <Text style={styles.error}>{general}</Text>
              )
            }
            <View style={styles.submitSection}>
              <View>
                <TouchableOpacity style={styles.submitButton} onPress={() => this.submitForm()}>
                  <Text style={styles.submitButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.submitButtonFacebook} onPress={() => this.facebookLogin()}>
                  <MaterialCommunityIcons
                    name="facebook"
                    color="#3b5998"
                    size={22}
                    style={styles.submitButtonFacebookIcon}
                  />
                  <Text style={styles.submitButtonFacebookText}>Continue with Facebook</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.login} onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}>Forgot your password?</Text>
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
    marginTop: 5,
  },
  submitButtonFacebook: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3b5998',
    marginTop: 12,
    textAlign: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 7,
    paddingBottom: 7,
  },
  submitButtonFacebookIcon: {
    marginTop: 5,
    marginRight: 5,
  },
  submitButtonFacebookText: {
    textAlign: 'center',
    color: '#3b5998',
    fontWeight: 'bold',
    paddingTop: 7,
    paddingBottom: 7,
  }
})

export default connect()(LoginScreen);