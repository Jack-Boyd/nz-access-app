import database from '@react-native-firebase/database';

const db = database();


//ADD_FEATURE
export const addFeature = (feature) => ({
  type: 'ADD_FEATURE',
  feature
});

export const startAddFeature = (featureData = {} ) => {
  return (dispatch) => {
    const {
      name = '',
    } = featureData;
    const feature = { name,};
    return db.ref(`/features/`).push(feature).then((ref) => {
        dispatch(addFeature({
          id: ref.key,
          ...feature,
        }))
    });
  };
};

//SET_FEATURES
export const setFeatures = (features) => ({
  type: 'SET_FEATURES',
  features
});

export const startSetFeatures = () => {
  return (dispatch) => {
    return db.ref(`/features/`).once('value').then((snapshot) => {
        const features = [];
        snapshot.forEach((childSnapshot) => {
          features.push({
            id: childSnapshot.key,
              ...childSnapshot.val()
          });
        });
        dispatch(setFeatures(features));
    });
  };
};
