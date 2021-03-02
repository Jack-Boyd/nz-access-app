const locationsReducerDefaultState = [];

export default (state = locationsReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_LOCATION':
      return [
        ...state,
        action.location
      ];
    case 'ADD_FEATURES':
      const fLocation = state.find((l) => l.id === action.locationId);
      const fIndex = state.indexOf(fLocation);
      fLocation.features = action.updates.features;
      state[fIndex] = fLocation;
      return null;
    case 'ADD_REVIEW':
      const rLocation = state.find((l) => l.id === action.locationId);
      const rIndex = state.indexOf(rLocation);
      rLocation.reviews = action.updates.reviews;
      state[rIndex] = rLocation;
      return state;
    case 'SET_LOCATIONS':
      return action.locations;
    default:
      return state;
  }
};