// Current Location Reducer
const currentLocationReducerDefaultState = {
  latitude: -36.8687861,
  longitude: 174.7684134,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default (state = currentLocationReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_LOCATION':
      'Region: ', action);
      return action.region;
    default:
      return state;
  }
};