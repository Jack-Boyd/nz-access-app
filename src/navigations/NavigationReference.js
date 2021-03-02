//Used for navigation outside of the Navigation Container set in the AppNavigation.js file
import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}