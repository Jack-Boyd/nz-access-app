import React from 'react';
import { Dimensions } from 'react-native';
import {Text, View, StyleSheet, ScrollView, Image, TextInput, Button, ActivityIndicator} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'

import * as ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

import {startAddUserPhoto, startSetUser} from '../actions/user';
import {AppStyles} from '../AppStyles';

class ProfileScreen extends React.Component {
  constructor(props){
    super();
    this.state = {
      imagePath: '',
      status: '',
      uploading: false,
    }
  }

  componentDidMount() {
    if (this.props.user.photo){
      let imageRef = storage().ref(this.props.user.photo);
      imageRef.getDownloadURL().then((url) => {
        this.setState({imagePath: url});
      })
    }
  }

  onUploadAvatar = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
          { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
          skipBackup: true, // do not backup to iCloud
          path: 'images', // store camera images under Pictures/images for android and Documents/images for iOS
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker', storage());
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const uri = response.uri;
        let path = response.uri;
        let fileName = this.getFileName(response.fileName, path);
        this.uploadImageToStorage(path, fileName);
      }
    });
  }

  getFileName(name, path) {
    if (name != null) { return name; }

    if (Platform.OS === "ios") {
        path = "~" + path.substring(path.indexOf("/Documents"));
    }
    return path.split("/").pop();
  }

  uploadImageToStorage(path, name) {
    this.setState({ uploading: true });
    let reference = storage().ref(`/users/${this.props.user.id}/${name}`);
    let task = reference.putFile(`${path}`);
    task.then((snapshot) => {
        console.log('Image uploaded to the bucket! ', snapshot);
        this.props.dispatch(startAddUserPhoto(this.props.user.id, {photo: `/users/${this.props.user.id}/${name}`}))
        this.props.dispatch(startSetUser(this.props.user.id));
        reference.getDownloadURL().then((url) => {
          this.setState({ imagePath: url, status: 'Image uploaded successfully', uploading: false });
        })
    }).catch((e) => {
        console.log('uploading image error => ', e);
        this.setState({ uploading: false, status: 'Something went wrong' });
    });
  }

  render() {
    const {uploading, imagePath} = this.state;
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
                <TouchableOpacity style={{height:30,width:30,alignSelf: 'flex-end',}} onPressIn={() => {this.props.navigation.navigate('ProfileSettingsScreen')}}>
                  <View style={styles.settingsView}>
                    <FontAwesome
                      name="cog"
                      color={AppStyles.color.main}
                      style={styles.settingsIcon}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
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
                              <TouchableOpacity onPressIn={async () => this.onUploadAvatar()}>
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
                    ) : (
                      <View style={styles.userSection}>
                        {
                          imagePath !== '' &&
                          <Image source={{uri: imagePath}} style={styles.imageStyle}/>
                        }
                      </View>
                    )
                  : (<View><Text>Error: No user found</Text></View>)
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
  imageStyle: {
    alignItems: 'center',
    height: 125,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5,
    marginRight: 6,
    padding: 10,
    resizeMode: 'stretch',
    width: 125,
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


  // async onUploadAvatar() {
  //   const options = {
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     maxHeight: 300,
  //     maxWidth: 300,
  //   };


  // }