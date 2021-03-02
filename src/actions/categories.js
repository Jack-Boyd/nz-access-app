import database from '@react-native-firebase/database';

const db = database();


//ADD_CATEGORY
export const addCategory = (category) => ({
  type: 'ADD_CATEGORY',
  category
});

export const startAddCategory = (categoryData = {} ) => {
  return (dispatch) => {
    const {
      name = '',
      icon = '',
      colour = '',
    } = categoryData;
    const category = { name, icon, colour};
    return db.ref(`/categories/`).push(category).then((ref) => {
        dispatch(addCategory({
          id: ref.key,
          ...category,
        }))
    });
  };
};

//SET_CATEGORIES
export const setCategories = (categories) => ({
  type: 'SET_CATEGORIES',
  categories
});

export const startSetCategories = () => {
  return (dispatch) => {
    return db.ref(`/categories/`).once('value').then((snapshot) => {
        const categories = [];
        snapshot.forEach((childSnapshot) => {
          categories.push({
            id: childSnapshot.key,
              ...childSnapshot.val()
          });
        });
        dispatch(setCategories(categories));
    });
  };
};
