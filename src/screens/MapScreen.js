import React from 'react';
import {
  TextInput,
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  Image,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, Callout} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import {AppStyles} from '../AppStyles';
import getVisibleLocations from '../selectors/locations';
import {setCurentLocation} from '../actions/currentLocation';

const requestCameraPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: "AccessNow NZ Location Permission",
      message:
        "AccessNow NZ needs access to your location",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    }
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return
  } else {
    return "Location permission denied";
  }
};


class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: {},
      initialLocation: {},
      loading: true,
      savedLocation: {},
      searchResults: [],
    };
  }

  async componentDidMount() {
    await requestCameraPermission();
    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition((position) => {
        this.setState({
          currentPosition: position,
          loading: false,
        });
        this.props.dispatch(setCurentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }));
      },(error) => {
        this.setState({ loading: false });
      },{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
    });
  }

  onSearchChange (search) {
    if (search.length >= 2) {
      const searchResults = [];
      this.props.locations.forEach((location) => {
        if (location.name.toLowerCase().includes(search.toLowerCase())) {
          searchResults.push(location);
        }
      });
      this.setState({
        searchResults
      });
    } else {
      this.setState({
        searchResults: []
      });
    }
  }

  getCategory (id) {
    return this.props.categories.filter((category) => {
      return category.id == id;
    })[0];
  }

  render() {
    const {currentPosition, loading, searchResults} = this.state;
    const {currentLocation} = this.props;
    const locationData = currentPosition.coords;
    const headingTextLimit = 38;
    const subHeadingTextLimit = 42;
    let region = {};

    return (
      <View style={styles.container}>
        {
          loading && (
            <ActivityIndicator
              animating={loading}
              color={AppStyles.color.main}
              size="large"
              style={styles.activityIndicator}
            />
          )
        }
        {
          !loading && (
            <View style={styles.screen}>
              <View style={styles.sectionStyle}>
                <Image
                  source={{
                    uri:
                      'https://i.pinimg.com/originals/e7/d4/50/e7d450d8c31ae10aa663d082fdbb3db9.png',
                  }}
                  style={styles.imageStyle}
                />
                <TextInput
                  style={{flex: 1}}
                  onChangeText={(e) => this.onSearchChange(e)}
                  placeholder="Search for place"
                  underlineColorAndroid="transparent"
                />
              </View>
              {
                searchResults &&
                  <ScrollView
                    style={styles.searchSection}
                    keyboardShouldPersistTaps={'handled'}>
                  {
                    searchResults.map((result) => {
                      const category = this.getCategory(result.category);
                      return (
                        <TouchableOpacity key={result.reference} style={styles.searchSectionItem} onPress={() => {
                          this.props.dispatch(setCurentLocation(region));
                          this.props.navigation.navigate('MapLocationScreen', {
                            locationId: result.id,
                          })
                        }}>
                          <MaterialCommunityIcons
                            name={category.icon}
                            color="#ffffff"
                            size={24}
                            style={{
                              backgroundColor: category.colour,
                              borderRadius: 17,
                              height: 34,width: 34,
                              justifyContent: 'center',
                              marginTop: 5,marginLeft: 20,marginRight: 20,
                              paddingLeft: 4,paddingTop: 4,
                            }}
                          />
                          <View style={styles.searchSectionText}>
                            <Text style={styles.searchSectionHeading}>{
                              ((result.name).length > headingTextLimit) ?
                              (((result.name).substring(0, headingTextLimit)) + "...") :
                              result.name
                            }</Text>
                            <Text style={styles.searchSectionSubHeading}>{
                              ((result.address).length > subHeadingTextLimit) ?
                              (((result.address).substring(0, subHeadingTextLimit)) + "...") :
                              result.address
                            }</Text>
                          </View>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            color={AppStyles.color.main}
                            size={14}
                            style={styles.searchSectionMore}
                          />
                        </TouchableOpacity>
                      );
                    })
                  }
                  </ScrollView>
              }
              {
                <View>
                  <MaterialCommunityIcons
                    name="tune"
                    color="#fff"
                    size={22}
                    style={styles.filterButton}
                    onPress={() => {
                      this.props.dispatch(setCurentLocation(region));
                      this.props.navigation.navigate('MapFilterScreen')
                    }}
                  />
                  <MaterialCommunityIcons
                    name="target"
                    color="#fff"
                    size={22}
                    style={styles.goToButton}
                    onPress={() => {
                      this.map.animateToRegion({
                        latitude: locationData.latitude,
                        longitude: locationData.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      })
                    }}
                  />
                  {
                    !loading &&
                    <MapView
                      ref={(map) => this.map = map}
                      style={styles.map}
                      showsUserLocation={true}
                      region={currentLocation}
                      onRegionChange={(completeRegion) => {
                        region = completeRegion;
                        //
                      }}
                      provider={"google"}>
                      {
                        this.props.locations.map((pin) => {
                          const coordinate = {
                            latitude: parseFloat(pin.latitude),
                            longitude: parseFloat(pin.longitude),
                          };
                          const category = this.getCategory(pin.category);
                          return (
                            <Marker
                              key={pin.reference}
                              coordinate={coordinate}
                              pinColor={'green'}
                              title={pin.name}>
                              <View style={styles.teardrop}>
                                <MaterialCommunityIcons
                                  name={category.icon}
                                  color="#ffffff"
                                  size={18}
                                  style={{
                                    backgroundColor: category.colour,
                                    borderRadius: 13,
                                    height: 24,
                                    justifyContent: 'center',
                                    paddingLeft: 3,paddingTop: 3,
                                    width: 24,
                                  }}
                                />
                              </View>
                              <Callout tooltip onPress={() => {
                                this.props.dispatch(setCurentLocation(region));
                                this.props.navigation.navigate('MapLocationScreen', {
                                  locationId: pin.id,
                                  map: true,
                                })
                              }}>
                              </Callout>
                            </Marker>
                          );
                        })
                      }
                    </MapView>
                  }

                </View>

              }
            </View>
          )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: AppStyles.container.flex,
    height: AppStyles.container.height,
  },
  screen: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  button: {
    color: AppStyles.color.main,
  },
  map: {
    height: Dimensions.get("window").height * 0.88,
    width: Dimensions.get("window").width ,
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchSection: {
    backgroundColor: 'white',
    maxHeight: 160,
    marginTop: 48,
    position: 'absolute',
    width: '100%',
    zIndex: 1001,
  },
  searchSectionItem: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  searchSectionIcon: {
    backgroundColor: "green",
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 4,
    paddingTop: 4,
    width: 34,
  },
  searchSectionIconMap: {
    backgroundColor: "green",
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    paddingLeft: 5,
    paddingTop: 5,
    width: 30,
  },
  searchSectionText: {
    marginTop: 5,
    marginBottom: 5,
    width: Dimensions.get('screen').width - 98,
  },
  searchSectionHeading:{
    color: AppStyles.color.main,
    fontSize: 16,
  },
  searchSectionSubHeading:{
    color: "#aaa",
    flexWrap: 'wrap'
  },
  searchSectionMore: {
    width: 30,
    marginTop: 24,
    justifyContent: 'center',
    flex: 1,
  },
  filterButton: {
    backgroundColor: AppStyles.color.main,
    borderRadius: 18,
    height: 30,
    marginRight: 10,
    marginTop: 10,
    paddingLeft: 4,
    paddingTop: 4,
    position: 'absolute',
    right: 0,
    width: 30,
    zIndex: 1000,
  },
  goToButton: {
    backgroundColor: AppStyles.color.main,
    borderRadius: 18,
    height: 30,
    marginRight: 10,
    marginTop: 60,
    marginBottom: 55,
    paddingLeft: 4,
    paddingTop: 4,
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    zIndex: 1000,
  },
  imageStyle: {
    alignItems: 'center',
    height: 25,
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5,
    marginRight: 6,
    padding: 10,
    resizeMode: 'stretch',
    width: 25,
  },

});

const mapStateToProps = (state) => ({
  categories: state.categories,
  currentLocation: state.currentLocation,
  locations: getVisibleLocations(state.locations, state.filters),
});

export default connect(mapStateToProps)(MapScreen);
