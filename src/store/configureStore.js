import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import categoriesReducer from '../reducers/categories';
import featuresReducer from '../reducers/features';
import filtersReducer from '../reducers/filters';
import locationsReducer from '../reducers/locations';
import userReducer from '../reducers/user';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      categories: categoriesReducer,
      features: featuresReducer,
      filters: filtersReducer,
      locations: locationsReducer,
      user: userReducer,
    }),
    composeEnhancers(applyMiddleware(thunk))
  );
  return store;
};