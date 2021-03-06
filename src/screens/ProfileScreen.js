import React from 'react';
import { Dimensions } from 'react-native';
import {Text, View, StyleSheet, ScrollView, Image, TextInput, Button, ActivityIndicator} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

import {AppStyles} from '../AppStyles';

class ProfileScreen extends React.Component {
  constructor(props){
    super();
    this.state = {
      uploading: false,
    }
  }

  onUploadAvatar() {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        const ext = uri.split('.').pop(); // Extract image extension

        console.log(ext);

        //firebase storage
      }
    });
  }

  render() {
    const {uploading} = this.state;
    return (

      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            {
              uploading &&
                <ActivityIndicator
                  animating={uploading}
                  color={AppStyles.color.main}
                  size="large"
                  style={styles.activityIndicator}
                />
            }
            {
              !uploading &&
              <View>
                <View style={styles.settingsView}>
                  <TouchableOpacity onPressIn={() => {this.props.navigation.navigate('ProfileSettingsScreen')}}>
                    <FontAwesome
                      name="cog"
                      color={AppStyles.color.main}
                      style={styles.settingsIcon}
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
                {
                  this.props.user ?
                    this.props.user.photo == null ? (
                      <View style={styles.userSection}>
                        <View style={styles.noPhoto}>
                          <MaterialCommunityIcons
                            name="account-circle"
                            color={AppStyles.color.main}
                            style={styles.userNoPhotoIcon}
                            size={110}
                          />
                          <View style={styles.userUploadPhotoWidth}>
                            <View style={styles.userUploadPhotoView}>
                              <TouchableOpacity onPressIn={() => this.onUploadAvatar()}>
                                <MaterialCommunityIcons
                                  name="camera"
                                  color={"white"}
                                  style={styles.userUploadPhotoIcon}
                                  size={28}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                      </View>
                    ) : (<View></View>)
                  : (<View></View>)
                }
                {
                  this.props.user ?
                    this.props.user.username ? (
                      <Text style={styles.userTitle}>{this.props.user.username}</Text>
                    ) : (<View></View>)
                  : (<View></View>)
                }
              </View>
            }
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
  settingsView: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  settingsIcon: {
    zIndex: 1,
  },
  noPhoto: {
    margin: 0,
  },
  userSection: {
    textAlign: 'center',
    flex: 1,
    alignSelf: 'center',
    marginTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe',
    width: Dimensions.get('screen').width,
  },
  userNoPhotoIcon: {
    alignSelf: 'center',
  },
  userUploadPhotoWidth: {
    alignSelf: 'center',
    width: 100,
  },
  userUploadPhotoView: {
    padding: 4,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userUploadPhotoIcon: {
    backgroundColor: AppStyles.color.main,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 23,
    paddingBottom: 3,
    paddingLeft: 9,
    paddingRight: 3,
    paddingTop: 9,

    zIndex: 2,
  },
  userPhoto: {
    marginTop: 10,
    marginBottom: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userTitle : {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(ProfileScreen);
