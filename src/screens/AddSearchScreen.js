import React from 'react';
import {Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {AppStyles} from '../AppStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

class AddSearchScreen extends React.Component {
  constructor(props){
    super();
  }

  addLocation(data, details, savedLocation) {
    this.props.navigation.navigate((savedLocation ? 'AddLocationScreen' : 'AddReviewScreen'), {
      locationId: (savedLocation ? savedLocation.id : data),
      locationDetails: details,
      map: false,
    })
  }

  getCategory (id) {
    return this.props.categories.filter((category) => {
      return category.id == id;
    })[0];
  }

  render() {
    const headingTextLimit = 38;
    const subHeadingTextLimit = 42;
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder='Search for place'
          minLength={4}
          autoFocus={true}
          ref={(instance) => { this.GooglePlacesRef = instance }}
          enablePoweredByContainer={false}
          listViewDisplayed="auto"
          returnKeyType={'search'}
          fetchDetails={true}
          renderLeftButton={() => <Image
            source={{
              uri:
              'https://i.pinimg.com/originals/e7/d4/50/e7d450d8c31ae10aa663d082fdbb3db9.png',
            }}
            style={styles.imageStyle}
          />}
          onPress={(data, details = null) => {
            this.GooglePlacesRef.setAddressText("");
            const reference = data.reference;
            const savedLocation = this.props.locations.find((location) => location.reference == reference);
            this.addLocation(data, details, savedLocation);
          }}
          query={{
            key: 'AIzaSyAdkZOsaNcKuPp2I1Iq1dvQ_A3FriSV918',
            language: 'en',
            components: 'country:nz'
          }}
          nearbyPlacesAPI= 'GooglePlacesSearch'
          debounce={200}
          renderRow={(rowData) => {
            const title = rowData.structured_formatting.main_text;
            const address = rowData.structured_formatting.secondary_text;
            const reference = rowData.reference;
            const savedLocation = this.props.locations.find((location) => location.reference == reference);
            let category = {};
            if (savedLocation)
            {
              category = this.getCategory(savedLocation.category);
            }
            //this.props.locations;
            return (
              <View key={reference} style={styles.searchSectionItem}>
                <MaterialCommunityIcons
                  name={savedLocation ? category.icon : "plus"}
                  color={savedLocation ? "#ffffff" : "#999999"}
                  size={28}
                  style={savedLocation ? {
                    backgroundColor: category.colour,
                    borderRadius: 19,
                    height: 38,width: 38,
                    justifyContent: 'center',
                    marginBottom: 15,marginLeft: 15,marginRight: 15,marginTop: 15,
                    paddingLeft: 5,paddingTop: 5,
                  } : styles.searchSectionEmptyIcon}
                />
                <View style={styles.searchSectionText}>
                  <Text style={styles.searchSectionHeading}>{
                    ((title).length > headingTextLimit) ?
                    (((title).substring(0, headingTextLimit)) + "...") :
                    title
                  }</Text>
                  <Text style={styles.searchSectionSubHeading}>{
                    (address) ?
                      (
                        ((address).length > subHeadingTextLimit) ?
                          (
                            ((address).substring(0, subHeadingTextLimit)) + "..."
                          ) :
                          address
                      ) : ''
                  }</Text>
                </View>
                <MaterialCommunityIcons
                  name="greater-than"
                  color={AppStyles.color.main}
                  size={14}
                  style={styles.searchSectionMore}
                />
              </View>
            );
          }}
          styles={searchStyles}>
        </GooglePlacesAutocomplete>
        <View style={styles.screen}>
          <View style={styles.iconPosition}>
            <MaterialCommunityIcons
              name="magnify"
              color="#bcbcbc"
              size={70}
              style={styles.icon}
            />
          </View>
          <View style={styles.text}>
            <Text style={styles.textHeading}>Add Review</Text>
            <Text style={styles.textBlurb}>Search for a place to add to the map. Share what you know about places in your community and around the world. Together we are creating access now!</Text>
          </View>
        </View>
      </View>
    );
  }
}
const searchStyles = StyleSheet.create({
  container: {
    flex: AppStyles.screen.flex,
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    backgroundColor: '#fff',
  },
  textInputContainer: {
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    height: 48,
    marginBottom: 0,
  },
});

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
  iconPosition: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
  },
  icon: {
    width: 100,
    height: 100,
    paddingTop: 15,
    paddingLeft: 15,
    borderWidth: 5,
    borderColor: '#bcbcbc',
    borderRadius: 70,
  },
  text: {
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },
  textHeading: {
    color: '#000',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textBlurb: {
    color: "#000",
    alignSelf: 'center',
    justifyContent:"flex-start",
    alignItems: 'center',
    maxWidth: 250,
    marginTop: 10,
    lineHeight: 18,
    fontSize: 14,
  },
  imageStyle: {
    alignItems: 'center',
    height: 25,
    marginTop: 12,
    marginLeft: 5,
    resizeMode: 'stretch',
    width: 25,
    backgroundColor: '#fff',
  },
  searchSection: {
    backgroundColor: 'white',
    maxHeight: 160,
    marginTop: 48,
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  searchSectionItem: {
    // borderTopColor: '#ccc',
    // borderTopWidth: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  searchSectionEmptyIcon: {
    backgroundColor: "white",
    borderColor: "#999999",
    borderRadius: 19,
    borderWidth: 2,
    height: 38,
    justifyContent: 'center',
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    paddingLeft: 5,
    paddingTop: 5,
    width: 38,
  },
  searchSectionIcon: {
    backgroundColor: "green",
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    paddingLeft: 5,
    paddingTop: 5,
    width: 38,
  },
  searchSectionIconMap: {
    backgroundColor: "green",
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    paddingLeft: 5,
    paddingTop: 5,
    width: 34,
  },
  searchSectionText: {
    marginBottom: 5,
    marginTop: 5,
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
})

const mapStateToProps = (state) => ({
  locations: state.locations,
  categories: state.categories,
});

export default connect(mapStateToProps)(AddSearchScreen);