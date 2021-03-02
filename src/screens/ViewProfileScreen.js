import React from 'react';
import {Dimensions, Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import {AppStyles} from '../AppStyles';

class ViewProfileScreen extends React.Component {
  constructor(props){
    super();
  }

  getFeature (id) {
    return this.props.features.filter((feature) => {
      return feature.id == id;
    })[0];
  }

  getReviews(id) {
    const locations = this.props.locations;
    const {user} = this.props.route.params;

    let reviews = [];

    locations.forEach(location => {
      location.reviews.forEach(review => {
        if (review.user.id == user.id) {
          review.locationId = location.id;
          reviews.push(review);
        }
      })
    });

    return reviews;
  }

  render() {
    const {user, map} = this.props.route.params;
    const reviews = this.getReviews(user.id);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {
            //photo
          }
          <View style={styles.userSection}>

            <Text style={styles.userTitle}>{user.name}</Text>
          </View>
          <View style={styles.reviewSection}>
            <View style={styles.reviewScreen}>
                <Text style={styles.reviewTitle}>Reviews / {reviews.length}</Text>
                <View style={styles.reviews}>
                  {
                    reviews.map((review, index) => {

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
                          this.props.navigation.navigate((map ? 'MapLocationScreen' : 'AddLocationScreen'), {
                            locationId: review.locationId,
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
  userSection: {
    textAlign: 'center',
    flex: 1,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
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
  reviewFeaturesString: {
    marginRight: 20,
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
  locations: state.locations,
  features: state.features,
});

export default connect(mapStateToProps)(ViewProfileScreen);

// <View>
// <MaterialCommunityIcons
//   name="tag"
//   color="#000000"
//   size={12}
//   style={styles.createdAtIcon}
// />
// <Text style={styles.reviewFeaturesString}>{reviewFeaturesString}</Text>
// </View>
// <Text>{review.review}</Text>