import database from '@react-native-firebase/database';

const db = database();

//ADD_LOCATION
export const addLocation = (location) => ({
  type: 'ADD_LOCATION',
  location
});

export const startAddLocation = (locationData = {} ) => {
  return (dispatch) => {
    const {
      accessibilityFeatures = [],
      address = "",
      category = "",
      createdAt = "",
      features = [],
      homeAccessible = false,
      latitude = 0,
      longitude = 0,
      name = "",
      phone = "",
      reference = "",
      reviews = [],
      website = "",
    } = locationData;
    const location = { accessibilityFeatures, address, category, createdAt, features, homeAccessible, latitude, longitude, name, phone, reference, reviews, website };
    return db.ref(`/locations/`).push(location).then((ref) => {
        dispatch(addLocation({
          id: ref.key,
          ...location,
        }))
    });
  };
};

//ADD_FEATURES
export const addFeatures = (locationId, updates) => ({
  type: 'ADD_FEATURES',
  locationId,
  updates,
});

export const startAddFeatures = (locationId, updates = {features: features}) => {
  return (dispatch) => {
    return db.ref(`/locations/${locationId}`).update(updates).then(() => {
        dispatch(addFeatures(locationId, updates));
    });
  };
};

//ADD_REVIEW
export const addReview = (locationId, updates) => ({
  type: 'ADD_REVIEW',
  locationId,
  updates,
});

export const startAddReview = (locationId, updates = {reviews: reviews}) => {
  return (dispatch) => {
    return db.ref(`/locations/${locationId}`).update(updates).then(() => {
        dispatch(addReview(locationId, updates));
    });
  };
};


//SET_LOCATIONS
export const setLocations = (locations) => ({
  type: 'SET_LOCATIONS',
  locations
});

export const startSetLocations = () => {
  return (dispatch) => {
    return db.ref(`/locations/`).once('value').then((snapshot) => {
        const locations = [];
        snapshot.forEach((childSnapshot) => {
          locations.push({
            id: childSnapshot.key,
              ...childSnapshot.val()
          });
        });
        dispatch(setLocations(locations));
    });
  };
};