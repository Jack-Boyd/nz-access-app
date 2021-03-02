export default (locations, {categories, features}) => {
  return locations.filter((location) => {
    return categories.length ? categories.includes(location.category) : true;
  }).filter((location) => {
    return features.length ? false : true;
  });
}