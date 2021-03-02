const featuresReducerDefaultState = [];

export default (state = featuresReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_FEATURE':
      return [
          ...state,
          action.feature
      ];
    case 'SET_FEATURES':
      return action.features;
    default:
      return state;
  }
};