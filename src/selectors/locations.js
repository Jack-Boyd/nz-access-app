export default (locations, {categories, features}) => {
  return locations.filter((location) => {
    return categories.length ? categories.includes(location.category) : true;
  }).filter((location) => {
    return features.length ? (location.features ? features.filter(f => location.features.indexOf(f) !== -1).length : false) : true;
  });
}