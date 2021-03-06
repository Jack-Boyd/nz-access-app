import React from 'react';
import {Dimensions, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import {AppStyles} from '../AppStyles';

class LocationScreen extends React.Component {
  constructor(props){
    super(props);
  }
  getLocation (id) {
    return this.props.locations.filter((location) => {
      return location.id == id;
    })[0];
  }

  getFeature (id) {
    return this.props.features.filter((feature) => {
      return feature.id == id;
    })[0];
  }

  getCategory (id) {
    return this.props.categories.filter((category) => {
      return category.id == id;
    })[0];
  }

  render() {
    const {locationId, map} = this.props.route.params;
    const location = this.getLocation(locationId);
    const category = this.getCategory(location.category);
    let featuresString = null;
    location.features.map((feature, index) => {
      const featureName = this.getFeature(feature);
      if (index == 0) {
        featuresString = featureName.name + ', ';
      } else if (index == (location.features.length - 1)) {
        featuresString += featureName.name;
      } else {
        featuresString += featureName.name + ', ';
      }
    })
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            <View style={styles.titleSection}>
              <MaterialCommunityIcons
                name={category.icon}
                color="#ffffff"
                size={27}
                style={{
                  backgroundColor: category.colour,
                  borderRadius: 19,
                  height: 37,
                  justifyContent: 'center',
                  paddingLeft: 5,
                  paddingTop: 5,
                  width: 37,
                }}
              />
              <Text style={styles.titleSectionName}>{location.name}</Text>
            </View>
            <View style={styles.listSection}>
              <MaterialCommunityIcons
                name="map-marker"
                color="#000000"
                size={18}
                style={styles.listSectionIcon}
              />
              <Text style={styles.listSectionName}>{location.address}</Text>
            </View>
            {
              location.phone != '' && (
                <View style={styles.listSection}>
                  <MaterialCommunityIcons
                    name="phone"
                    color="#000000"
                    size={18}
                    style={styles.listSectionIcon}
                  />
                  <Text style={styles.listSectionLink} onPress={() => Linking.openURL(`tel:${location.phone}`)}>{location.phone}</Text>
                </View>
              )
            }
            {
              location.website != '' && (
                <View style={styles.listSection}>
                  <MaterialCommunityIcons
                    name="web"
                    color="#000000"
                    size={18}
                    style={styles.listSectionIcon}
                  />
                  <Text style={styles.listSectionLink} onPress={() => Linking.openURL(location.website)}>{location.website}</Text>
                </View>
              )
            }
            {
              featuresString != null && (
                <View style={styles.listSection}>
                  <MaterialCommunityIcons
                    name="tag"
                    color="#000000"
                    size={18}
                    style={styles.listSectionIcon}
                  />
                  <Text style={styles.listSectionLink, {color: 'black'}}>{featuresString}</Text>
                </View>
              )
            }
            <View style={styles.addReviewSection}>
              <TouchableOpacity style={styles.submitButton} onPress={() => {
                this.props.navigation.navigate((map ? 'MapAddReviewScreen' : 'AddReviewScreen'), {
                  locationId: location
                })
              }}>
                <Text style={styles.submitButtonText}>Add Review</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.report} onPress={() => Linking.openURL('mailto:rgdufton@gmail.com')}>
              <MaterialCommunityIcons
                name="alert"
                color="#000000"
                size={18}
                style={styles.reportIcon}
              />
              <Text style={styles.reportText}>Report a Problem</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewSection}>
            <View style={styles.reviewScreen}>
                <Text style={styles.reviewTitle}>Reviews / {location.reviews.length}</Text>
                <View style={styles.reviews}>
                  {
                    location.reviews.map((review, index) => {

                      let reviewFeaturesString = null;
                      review.features.map((feature, index) => {
                        const featureName = this.getFeature(feature);
                        if (index == 0) {
                          reviewFeaturesString = featureName.name + ', ';
                        } else if (index == (review.features.length - 1)) {
                          reviewFeaturesString += featureName.name;
                        } else {
                          reviewFeaturesString += featureName.name + ', ';
                        }
                      })
                      return (
                        <TouchableOpacity key={index} style={styles.review} onPress={() => {
                          this.props.navigation.navigate((map ? 'MapViewProfileScreen' : 'AddViewProfileScreen'), {
                            map: map,
                            user: review.user,
                          })
                        }}>
                          <Image
                            style={styles.reviewImage}
                            source={{
                              uri:
                                'https://i.pinimg.com/originals/e7/d4/50/e7d450d8c31ae10aa663d082fdbb3db9.png',
                            }}
                          />
                          <View style={styles.reviewText}>
                            <Text style={styles.reviewTextTitle}>{review.user.name}</Text>
                            <View style={styles.createdAtRow}>
                              <MaterialCommunityIcons
                                name="clock-time-eight"
                                color="#000000"
                                size={12}
                                style={styles.createdAtIcon}
                              />
                              <Text>{review.createdAt}</Text>
                            </View>
                            <View style={styles.createdAtRow}>
                              <MaterialCommunityIcons
                                name="tag"
                                color="#000000"
                                size={12}
                                style={styles.createdAtIcon}
                              />
                              <Text>{reviewFeaturesString}</Text>
                            </View>
                            <Text>{review.review}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  }
                </View>
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
    marginTop: 10,
    marginRight: 20,
    width: Dimensions.get("window").width - 40,
  },
  titleSection: {
    flexDirection: "row",
  },
  titleSectionName:{
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 8,
  },
  listSection: {
    flexDirection: "row",
    marginTop: 20,
  },
  listSectionIcon: {
    marginRight: 5,
  },
  listSectionName: {
    lineHeight: 18,
    marginRight: 5,
  },
  listSectionLink: {
    lineHeight: 18,
    color: AppStyles.color.main,
  },
  addReviewSection: {
    marginTop: 20,
    marginBottom: 5,
  },
  reviewSection: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 20,
    paddingTop: 15,
  },
  reviewScreen:{
    marginLeft: 20,
    marginRight: 20,
  },
  reviewTitle: {
    fontWeight: 'bold',
  },
  reviews: {
    marginTop: 10,
  },
  review: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  reviewImage: {
    height: Dimensions.get('screen').width / 12,
    width: Dimensions.get('screen').width / 12,
  },
  reviewText: {
    marginLeft: 10,
    width: (Dimensions.get('screen').width / 10) * 8,
  },
  reviewTextTitle: {
    color: AppStyles.color.main,
    fontSize: 16,
    fontWeight: 'bold',
  },
  createdAtRow: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 3,
  },
  createdAtIcon: {
    marginTop: 4,
    marginRight: 5,
  },
  report: {
    marginTop: 10,
    flexDirection: 'row',
  },
  reportIcon: {
    color: AppStyles.color.main,
    marginRight: 5,
  },
  reportText: {
    fontWeight: 'bold',
    color: AppStyles.color.main,
  },
  submitButton: {
    backgroundColor: AppStyles.color.main,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 7,
    paddingBottom: 7,
  }
});

const mapStateToProps = (state) => ({
  categories: state.categories,
  features: state.features,
  locations: state.locations,
});

export default connect(mapStateToProps)(LocationScreen);
