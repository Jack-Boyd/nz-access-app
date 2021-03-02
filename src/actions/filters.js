//ADD_CATEGORY_FILTER
export const addCategoryFilter = (categoryId = '') => ({
  type: 'ADD_CATEGORY_FILTER',
  categoryId
});

//REMOVE_CATEGORY_FILTER
export const removeCategoryFilter = (categoryId = '') => ({
  type: 'REMOVE_CATEGORY_FILTER',
  categoryId
});

//ADD_FEATURE_FILTER
export const addFeatureFilter = (featureId = '') => ({
  type: 'ADD_FEATURE_FILTER',
  featureId
});

//REMOVE_FEATURE_FILTER
export const removeFeatureFilter = (featureId = '') => ({
  type: 'REMOVE_FEATURE_FILTER',
  featureId
});

//CLEAR_FILTER
export const clearFilters = () => ({
  type: 'CLEAR_FILTER',
});