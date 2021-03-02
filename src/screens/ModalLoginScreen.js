import React from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import moment from 'moment';

import {startSetUser} from '../actions/user';
import {startAddLocation, startAddFeatures, startAddReview} from '../actions/locations';
import {AppStyles} from '../AppStyles';
import loginFirebaseWithFacebook from '../selectors/facebook';

class ModalLoginScreen extends React.Component {
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

  updateEmail = (email) => {
    this.setState({
      email
    });
  }

  updatePassword = (password) => {
    this.setState({
      password
    });
  }

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
    let {toAddFeatures, toAddLocation, toAddReview, existing} = this.props.route.params;
    LoginManager.logInWithPermissions(['email']).then(
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
                      if (existing) {
                        let location = toAddLocation;
                        location.reviews.push({
                          createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                          features: toAddFeatures,
                          review: toAddReview,
                          user: {
                            id: authId.id,
                            name: authId.username,
                          }
                        });
                        const features = toAddLocation.features;
                        const reviews = toAddLocation.reviews;
                        ctx.props.dispatch(startAddFeatures(location.id, {features}));
                        ctx.props.dispatch(startAddReview(toAddLocation.id, {reviews}));
                      } else {
                        let newFeatures = toAddLocation.features;
                        toAddFeatures.forEach((feature) => {
                          if (!newFeatures.includes(feature)) {
                            newFeatures.push(feature);
                          }
                        });
                        toAddLocation.features = newFeatures;
                        toAddLocation.reviews = [{
                          createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                          features: toAddFeatures,
                          review: toAddReview,
                          user: {
                            id: authId.id,
                            name: authId.username,
                          }
                        }];
                        ctx.props.dispatch(startAddLocation(toAddLocation));
                      }

                      ctx.props.navigation.popToTop();
                      ctx.props.navigation.navigate('Navigation', {
                        screen: 'Map',
                      });
                      ctx.props.navigation.popToTop();
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
        console.log('Login fail with error: ' + error);
        ctx.setState({errors: {general: 'Login fail.',}});
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

      let {toAddFeatures, toAddLocation, toAddReview, existing} = this.props.route.params;

      auth().signInWithEmailAndPassword(email, password).then((user) => {
        if (user.user.uid) {
          this.props.dispatch(startSetUser(user.user.uid));
          this.props.dispatch({ type: "LOGIN", id: user.user.uid });

          if (existing) {
            let location = toAddLocation;
            location.reviews.push({
              createdAt: moment().format('MMMM Do YYYY, h:mm a'),
              features: toAddFeatures,
              review: toAddReview,
              user: {
                id : user.user.uid,
                name: user.user.displayName,
              }
            });
            const features = toAddLocation.features;
            const reviews = toAddLocation.reviews;
            this.props.dispatch(startAddFeatures(location.id, {features}));
            this.props.dispatch(startAddReview(toAddLocation.id, {reviews}));
          } else {
            let newFeatures = toAddLocation.features;
            toAddFeatures.forEach((feature) => {
              if (!newFeatures.includes(feature)) {
                newFeatures.push(feature);
              }
            });
            toAddLocation.features = newFeatures;
            toAddLocation.reviews = [{
              createdAt: moment().format('MMMM Do YYYY, h:mm a'),
              features: toAddFeatures,
              review: toAddReview,
              user: {
                id : user.user.uid,
                name: user.user.displayName,
              }
            }];
            this.props.dispatch(startAddLocation(toAddLocation));
          }

          this.props.navigation.popToTop();
          this.props.navigation.navigate('Navigation', {
            screen: 'Map',
          });
          this.props.navigation.popToTop();
        }
        else {
          ctx.setState({errors: {general: 'Invalid email and/or password. Please try again or select forgot your password.',}});
          return;
        }
      }).catch((error) => {
        console.log(error);
        ctx.setState({errors: {general: 'Invalid email and/or password. Please try again or select forgot your password.',}});
      });

    }
  }

  render() {
    const {general, email, password,} = this.state.errors;
    let {toAddFeatures, toAddLocation, toAddReview, existing} = this.props.route.params;

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
                  <Text style={styles.submitButtonFacebookText}>Login with Facebook</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.login} onPress={() => this.props.navigation.navigate('ModalForgotPasswordScreen', {
                params: {
                  toAddFeatures: toAddFeatures,
                  toAddLocation: toAddLocation,
                  toAddReview: toAddReview,
                  existing: existing
                }
              })}>Forgot your password?</Text>
              <Text style={styles.login} onPress={() => this.props.navigation.navigate('ModalRegisterScreen', {
                toAddFeatures: toAddFeatures,
                toAddLocation: toAddLocation,
                toAddReview: toAddReview,
                existing: existing
              })}>Need to create an account?</Text>
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
  },
  submitButton: {
    backgroundColor: AppStyles.color.main,
    marginTop: 10,
  },
  submitButtonFacebook: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3b5998',
    marginTop: 10,
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

export default connect()(ModalLoginScreen);