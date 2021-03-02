import React from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Animated, Platform, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {connect} from 'react-redux';
import moment from 'moment';

import {AppStyles} from '../AppStyles';
import {startAddLocation, startAddFeatures, startAddReview} from '../actions/locations';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

class AddReviewScreen extends React.Component {
  constructor(props){
    super();
    this.categoryAnimation = [new Animated.Value(0),new Animated.Value(0),new Animated.Value(0),new Animated.Value(0),new Animated.Value(0),new Animated.Value(0),new Animated.Value(0),new Animated.Value(0)];
    this.state = {
      selectedCategoryAnimation: null,
      reviewCategory: {},
      reviewFeatures: [],
      reviewPhotos: [],
      reviewText: '',
    }
  }

  componentDidMount() {
    this.categoryAnimation[0].setValue(0);
    this.categoryAnimation[1].setValue(0);
    this.categoryAnimation[2].setValue(0);
    this.categoryAnimation[3].setValue(0);
    this.categoryAnimation[4].setValue(0);
    this.categoryAnimation[5].setValue(0);
    this.categoryAnimation[6].setValue(0);
    this.categoryAnimation[7].setValue(0);
  }

  endBackgroundColorAnimation = (variable) => {
    Animated.timing(
      variable, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }
    ).start(() => {});
  }

  startBackgroundColorAnimation = (variable) => {
    Animated.timing(
      variable, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }
    ).start(() => {});
  }

  selectCategory = (category, variable) => {
    const old = this.state.selectedCategoryAnimation;
    if (old) {
      this.endBackgroundColorAnimation(old);
    }
    this.startBackgroundColorAnimation(variable);
    this.setState({
      selectedCategoryAnimation: variable,
      reviewCategory: category,
    });
  }

  selectFeature = (feature) => {
    let features = this.state.reviewFeatures;
    if (features.includes(feature.id)) {
      features.splice(features.indexOf(feature.id), 1);
    } else {
      features.push(feature.id);
    }
    this.setState({
      reviewFeatures: features,
    });
  }

  onUploadAvatar() {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        //test on real device
        console.log(uri);
      }
    });
  }

  updateReviewText = (text) => {
    this.setState({
      reviewText: text,
    });
  }

  submitForm = () => {
    //Get location
    let {locationId} = this.props.route.params;

    //Determine if location already exists
    const isNewLocation = locationId.structured_formatting !== undefined;
    let newLocation = null;
    let toAddFeatures = this.state.reviewFeatures;

    if (isNewLocation) {
      //For new location
      const {locationDetails} = this.props.route.params;
      const catId = this.state.reviewCategory.id;
      newLocation = {
        address: locationDetails.formatted_address,
        category: catId,
        createdAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
        features: toAddFeatures,
        homeAccessible: false,
        latitude: locationDetails.geometry.location.lat,
        longitude: locationDetails.geometry.location.lng,
        name: locationId.structured_formatting.main_text,
        phone: locationDetails.formatted_phone_number,
        reference: locationDetails.reference,
        website: locationDetails.website,
      }

      if (!this.props.user) {
        this.props.navigation.navigate('AddLoginModal', {
          screen: 'ModalLoginScreen',
          params: {
            toAddFeatures: toAddFeatures,
            toAddLocation: newLocation,
            toAddReview: this.state.reviewText,
            existing: false,
          },
        });
      } else {
        newLocation.reviews = [{
          createdAt: moment().format('MMMM Do YYYY, h:mm a'),
          features: toAddFeatures,
          review: this.state.reviewText,
          user: {
            id: this.props.user.id,
            name: this.props.user.username,
          }
        }];
        this.props.dispatch(startAddLocation(newLocation));
        this.props.navigation.popToTop();
        this.props.navigation.navigate('Map');
      }

    } else {
      //For existing location

      if (!this.props.user) {
        this.props.navigation.navigate('AddLoginModal', {
          screen: 'ModalLoginScreen',
          params: {
            toAddFeatures: toAddFeatures,
            toAddLocation: location,
            toAddReview: this.state.reviewText,
            existing: true,
          },
        });
      } else {
        //TODO COMPARE GENERAL FEATURES
        let newFeatures = locationId.features;
        toAddFeatures.forEach((feature) => {
          if (!newFeatures.includes(feature)) {
            newFeatures.push(feature);
          }
        });
        locationId.features = newFeatures;
        locationId.reviews.push({
          createdAt: moment().format('MMMM Do YYYY, h:mm a'),
          features: toAddFeatures,
          review: this.state.reviewText,
          user: {
            id : this.props.user.id,
            name: this.props.user.username,
          }
        });
        const features = locationId.features;
        const reviews = locationId.reviews;
        this.props.dispatch(startAddFeatures(locationId.id, {features}));
        this.props.dispatch(startAddReview(locationId.id, {reviews}));
        this.props.navigation.popToTop();
        this.props.navigation.navigate('Map');
      }

    }
  }

  render() {
    const {locationId} = this.props.route.params;
    const {categories, features} = this.props;
    const newLocation = locationId.structured_formatting !== undefined;
    let iconRows = [];

    const itemsPerRow = 3;
    if (newLocation) {
      const noOfRows = Math.ceil(categories.length / itemsPerRow);
      for(let i=0; i<noOfRows; i++) {
        const row = categories.slice((i*itemsPerRow), ((i+1)*itemsPerRow));
        iconRows.push(row);
      }
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            <View style={styles.reviewForm}>
              <View style={styles.locationText}>
                <Text style={styles.locationName}>{newLocation ? locationId.structured_formatting.main_text : locationId.name}</Text>
                <Text style={styles.locationAddress}>{newLocation ? locationId.structured_formatting.secondary_text : locationId.address}</Text>
              </View>
              {
                newLocation && (
                  <View style={styles.icons}>
                    <View>
                      <Text>Please pick a category.</Text>
                    </View>
                     {
                      iconRows.map((row, index) => {
                        return (
                          <View style={styles.iconRow} key={index}>
                            {
                              row.map((category, indx) => {
                                const selected = category == this.state.reviewCategory;
                                const backgroundColorConfig = this.categoryAnimation[indx + (index*itemsPerRow)].interpolate({
                                  inputRange: [ 0, 1 ],
                                  outputRange: [ "#ffffff", category.colour ]
                                })
                                return (
                                  <View key={category.id} style={styles.icon}>
                                    <Animated.View>
                                      <AnimatedIcon
                                        name={category.icon}
                                        color={(selected ? "#ffffff" : category.colour)}
                                        size={26}
                                        style={{
                                          backgroundColor: backgroundColorConfig,
                                          borderColor: category.colour,
                                          borderWidth: 2,
                                          borderRadius: 26,
                                          height: 52,width: 52,
                                          marginTop: 5,marginLeft: 32, marginRight: 32,
                                          paddingLeft: 13, paddingTop: 12,
                                        }}
                                        onPress={(e) => {
                                          this.selectCategory(category, this.categoryAnimation[indx + (index*itemsPerRow)]);
                                        }}
                                      />
                                      <Text style={styles.iconName}>{category.name}</Text>
                                    </Animated.View>
                                  </View>
                                )
                              })
                            }
                          </View>
                        )
                      })
                    }
                  </View>
                )
              }
              <View style={styles.features}>
                {
                  features.map(feature => {
                    let selected = this.state.reviewFeatures.length;
                    if (selected) {
                      selected = this.state.reviewFeatures.includes(feature.id);
                    }
                    return (
                      <TouchableOpacity key={feature.id} onPress={() => this.selectFeature(feature, selected)}>
                        <Text style={selected ? styles.featureSelected : styles.feature}>{feature.name}</Text>
                      </TouchableOpacity>
                    );
                  })
                }
              </View>
              <View>
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Upload Photos</Text>
                </TouchableOpacity>
              </View>
              <View>
                <View>
                  <Text>Please write a review.</Text>
                </View>
                <TextInput
                  multiline
                  style={styles.reviewTextInput}
                  onChange={(e) => this.updateReviewText(e.nativeEvent.text)}
                />
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={() => this.submitForm()}>
                <Text style={styles.submitButtonText}>Done</Text>
              </TouchableOpacity>
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
    marginTop: 10,
  },
  reviewForm: {

  },
  locationText: {

  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  locationAddress: {
    marginBottom: 10,
  },
  icons: {
    flexDirection: 'column',
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 5,

  },
  icon: {
    width: '33%',
  },
  iconName: {
    textAlign: 'center',
  },
  reviewTextInput: {
    backgroundColor: '#eee',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
  },
  submitButton: {
    marginBottom: 25,
    backgroundColor: AppStyles.color.main,
    marginTop: 10,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 7,
    paddingBottom: 7,
  },
  features: {
    marginTop: 15,
    marginBottom: 25,

    alignSelf:"flex-start",
    backgroundColor: '#ecf0f1',
    flex: 1,
    flexDirection:"row",
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 8,
    textAlign: 'center',
  },
  feature: {
    borderRadius: 18,
    borderWidth: 1,
    fontWeight: 'bold',
    color: 'black',
    padding: 8,
    marginBottom: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  featureSelected: {
    backgroundColor: AppStyles.color.main,
    borderColor: AppStyles.color.main,
    borderRadius: 18,
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    marginBottom: 10,
    marginRight: 10,
    textAlign: 'center',
  },
})

const mapStateToProps = (state) => ({
  categories: state.categories,
  features: state.features,
  locations: state.locations,
  user: state.user,
});

export default connect(mapStateToProps)(AddReviewScreen);