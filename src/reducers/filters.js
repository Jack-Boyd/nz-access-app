// Filters Reducer
const filtersReducerDefaultState = {
  categories: [],
  features: []
};

export default (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_CATEGORY_FILTER':
      let filteredCats = state.categories;
      filteredCats.push(action.categoryId);
      return {
        ...state,
        categories: filteredCats
      };
    case 'REMOVE_CATEGORY_FILTER':
      let beforeCats = state.categories;
      beforeCats.splice(beforeCats.indexOf(action.categoryId), 1);
      return {
        ...state,
        categories: beforeCats
      };
    case 'ADD_FEATURE_FILTER':
      let filteredFeatures = state.features;
      filteredFeatures.push(action.featureId);
      return {
        ...state,
        features: filteredFeatures
      };
    case 'REMOVE_FEATURE_FILTER':
      let beforeFeatures = state.features;
      beforeFeatures.splice(beforeFeatures.indexOf(action.featureId), 1);
      return {
        ...state,
        features: beforeFeatures
      };
    case 'CLEAR_FILTER':
      return {
        categories: [],
        features: []
      };
    default:
      return state;
  }
};