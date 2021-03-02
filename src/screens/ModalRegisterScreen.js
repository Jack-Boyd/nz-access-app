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

import {startAddUser, startSetUser} from '../actions/user';
import {startAddLocation, startAddFeatures, startAddReview} from '../actions/locations';
import {AppStyles} from '../AppStyles';
import loginFirebaseWithFacebook from '../selectors/facebook';

class ModalRegisterScreen extends React.Component {
  constructor(props){
    super();
    this.state = {
      name: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmed: false,
      errors: {
        general: '',
        name: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmed: '',
      }
    }
  }

  updateName = (name) => {this.setState({name});}

  updateUsername = (username) => {this.setState({username});}

  updateEmail = (email) => {this.setState({email});}

  updatePassword = (password) => {this.setState({password});}

  isConfirmedPassword = (confirm) => {
    if (confirm === this.state.password) {
      this.setState({
        passwordConfirmed: true
      });
    } else {
      this.setState({
        passwordConfirmed: false
      });
    }
  }

  validate = () => {
    const {name, username, email, password, passwordConfirmed} = this.state;
    let valid = true;
    let nameError = '', usernameError = '', emailError = '', passwordError = '', passwordConfirmedError = '';

    if (!name) {
      nameError = 'This is a required field.';
      valid = false;
    }

    if (!username) {
      usernameError = 'Please enter a valid username. A valid username must be 6-50 characters and only consist of letters and/or numbers.';
      valid = false;
    } else {
      if (username.length < 6 && username.length > 50) {
        usernameError = 'Please enter a valid username. A valid username must be 6-50 characters and only consist of letters and/or numbers.';
        valid = false;
      } else {
        if (username.match(/[^a-zA-Z0-9]+/g)) {
          usernameError = 'Please enter a valid username. A valid username must be 6-50 characters and only consist of letters and/or numbers.';
          valid = false;
        }
      }
    }

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
      passwordError = 'Password must be at least 8 characters, must include at least one upper case letter, one lower case letter, and one numeric digit.';
      valid = false;
    } else {
      if (password.length < 8) {
        passwordError = 'Password must be at least 8 characters, must include at least one upper case letter, one lower case letter, and one numeric digit.';
        valid = false;
      } else {
        if (!password.match(/(.*[a-z].*)/g)) {
          passwordError = 'Password must be at least 8 characters, must include at least one upper case letter, one lower case letter, and one numeric digit.';
          valid = false;
        } else {
          if (!password.match(/(.*[A-Z].*)/g)) {
            passwordError = 'Password must be at least 8 characters, must include at least one upper case letter, one lower case letter, and one numeric digit.';
            valid = false;
          } else {
            if (!password.match(/(.*\d.*)/g)) {
              passwordError = 'Password must be at least 8 characters, must include at least one upper case letter, one lower case letter, and one numeric digit.';
              valid = false;
            }
          }
        }
      }
    }

    if (password || passwordConfirmed) {
      if (!passwordConfirmed) {
        passwordConfirmedError = 'New Password and Confirm Password must match.';
        valid = false;
      }
    }

    this.setState({
      errors: {
        name: nameError,
        username: usernameError,
        email: emailError,
        password: passwordError,
        passwordConfirmed: passwordConfirmedError,
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
        ctx.setState({errors: {general: 'Login fail.',}});
        console.log('Login fail with error: ' + error);
      },
    );
  };

  submitForm = () => {
    const ctx = this;
    const validForm = ctx.validate();
    let {toAddFeatures, toAddLocation, toAddReview, existing} = this.props.route.params;
    if (validForm) {
      const {name, username, email, password} = ctx.state;
      ctx.setState({
        errors: {
          name: '',
          username: '',
          email: '',
          password: '',
          passwordConfirmed: '',
        }
      });
      auth().createUserWithEmailAndPassword(email, password).then((user) => {
        if (user.user.uid) {
          const userId = user.user.uid
          ctx.props.dispatch(startAddUser({
            userId,
            name,
            username,
            email,
          }));

          auth().currentUser.updateProfile({
            displayName: ctx.state.username,
          });

          ctx.props.dispatch(startSetUser(userId));
          ctx.props.dispatch({ type: "LOGIN", id: user.user.uid });

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
        } else {
          ctx.setState({errors: {general: 'Unable to create account, Please try again.',}});
          return;
        }
      }).catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          ctx.setState({errors: {general: 'Unable to create account, The email address provided is already in use.',}});
        }
        if (error.code === 'auth/invalid-email') {
          ctx.setState({errors: {general: 'Unable to create account, The email address provided is invalid.',}});
        }
        console.log(error);
      });
    }
  }

  render() {
    const {general, name, username, email, password, passwordConfirmed} = this.state.errors;
    let {toAddFeatures, toAddLocation, toAddReview, existing} = this.props.route.params;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  onChange={(e) => this.updateName(e.nativeEvent.text)}
                />
                {
                  name != '' && (
                    <Text style={styles.error}>{name}</Text>
                  )
                }
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  onChange={(e) => this.updateUsername(e.nativeEvent.text)}
                />
                {
                  username != '' && (
                    <Text style={styles.error}>{username}</Text>
                  )
                }
              </View>
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
                  secureTextEntry={true}
                  onChange={(e) => this.updatePassword(e.nativeEvent.text)}
                />
                {
                  password != '' && (
                    <Text style={styles.error}>{password}</Text>
                  )
                }
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry={true}
                  onChange={(e) => this.isConfirmedPassword(e.nativeEvent.text)}
                />
                {
                  passwordConfirmed != '' && (
                    <Text style={styles.error}>{passwordConfirmed}</Text>
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
              <Text style={styles.terms}>By signing up for AccessNow you agree to our Terms & Conditions. Learn about how we process and use your data in our Privacy Policy and how we use cookies and similar technology in our Cookies Policy</Text>
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
              <Text style={styles.login} onPress={() => this.props.navigation.navigate('ModalLoginScreen', {
                params: {
                  toAddFeatures: toAddFeatures,
                  toAddLocation: toAddLocation,
                  toAddReview: toAddReview,
                  existing: existing
                }
              })}>Already have an account?</Text>
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

export default connect()(ModalRegisterScreen);