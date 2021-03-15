import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';

import configureStore from './src/store/configureStore';
import { AppStack } from "./src/navigations/AppNavigation";

const store = configureStore();

LogBox.ignoreAllLogs();

class WheelEasyApp extends React.Component {
  render() {
    return (
      //add cloud messaging listening functionality
      <Provider store={store}>
        <AppStack/>
      </Provider>
    );
  }
}

export default WheelEasyApp;