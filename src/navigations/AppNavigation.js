import React, {useEffect} from 'react';
import {Text, Share} from 'react-native';
import {NavigationContainer, TabActions,} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';

import {startAddCategory, startSetCategories} from '../actions/categories';
import {startAddFeature, startSetFeatures} from '../actions/features';
import {clearFilters} from '../actions/filters';
import {startSetLocations} from '../actions/locations';
import {startSetUser} from '../actions/user';
import AddReviewScreen from '../screens/AddReviewScreen';
import AddSearchScreen from '../screens/AddSearchScreen';
import LocationScreen from '../screens/LocationScreen';
import MapScreen from '../screens/MapScreen';
import MapFilterScreen from '../screens/MapFilterScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import ViewProfileScreen from '../screens/ViewProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import ModalLoginScreen from '../screens/ModalLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ModalRegisterScreen from '../screens/ModalRegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ForgotPasswordSuccessScreen from '../screens/ForgotPasswordSuccessScreen';
import ModalForgotPasswordScreen from '../screens/ModalForgotPasswordScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import {AppStyles} from '../AppStyles';
import {navigationRef} from './NavigationReference';
import { createModalNavigator } from 'react-navigation-native-modal';

const Modal = createModalNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MapStack = ({dispatch}) => {
  const onShare = async (name) => {
    try {
      const result = await Share.share({
        message:
          'I think you might be interested in this Accessible place, ' + name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}
      animation="fade"
    >
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="MapFilterScreen" component={MapFilterScreen} options={
        {
          title: 'Filter',
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontSize: 16,
          },
          headerRight: () => (
            <Text style={{marginRight: 10}} onPress={() => dispatch(clearFilters())}>Clear all</Text>
          )
        }
      }></Stack.Screen>
      <Stack.Screen name="MapLocationScreen" component={LocationScreen} options={({ route }) =>
        ({
          title: 'Details',
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontSize: 16,
          },
          headerRight: () => (
            <MaterialCommunityIcons
              name="share-variant"
              color="#000"
              size={20}
              style={{marginRight: 10}}
              onPress={() => onShare(route.params.location.name)}
            />
          ),
        })
      }></Stack.Screen>
      <Stack.Screen name="MapAddReviewScreen" component={AddReviewScreen} options={{
        title: 'Rate this place',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
      }}></Stack.Screen>
      <Stack.Screen name="MapViewProfileScreen" component={ViewProfileScreen} options={{ headerShown: false, }}></Stack.Screen>
    </Stack.Navigator>
  );
}

const AddStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
      animation="fade"
    >
      <Stack.Screen name="AddScreens" component={AddScreensStack} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  );
}

const AddScreensStack = () => {
  const onShare = async (name) => {
    try {
      const result = await Share.share({
        message:
          'I think you might be interested in this Accessible place, ' + name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}
      animation="fade"
    >
      <Stack.Screen name="AddSearchScreen" component={AddSearchScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="AddLocationScreen" component={LocationScreen} options={{
        title: 'Details',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
        headerRight: () => (
          <MaterialCommunityIcons
            name="share-variant"
            color="#000"
            size={20}
            style={{marginRight: 10}}
            onPress={() => onShare(route.params.location.name)}
          />
        ),
      }}></Stack.Screen>
      <Stack.Screen name="AddReviewScreen" component={AddReviewScreen} options={{
        title: 'Rate this place',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
      }}></Stack.Screen>
      <Stack.Screen name="AddViewProfileScreen" component={ViewProfileScreen} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  );
}

const ModalProfileStack = () => {
  return (
    <Modal.Navigator>
      <Modal.Screen name="ModalLoginScreen" component={ModalLoginScreen}></Modal.Screen>
      <Modal.Screen name="ModalRegisterScreen" component={ModalRegisterScreen}></Modal.Screen>
      <Modal.Screen name="ModalForgotPasswordScreen" component={ModalForgotPasswordScreen}></Modal.Screen>
    </Modal.Navigator>
  );
}

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}
      animation="fade"
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="ProfileSettingsScreen" component={ProfileSettingsScreen} options={{
        title: 'Settings',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
       }}></Stack.Screen>
       <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} options={{
        title: 'Edit Profile',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
       }}></Stack.Screen>
    </Stack.Navigator>
  );
}

const CreateProfileStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}
      animation="fade"
    >
      <Stack.Screen name="CreateProfileScreen" component={CreateProfileScreen} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
        title: 'Login',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
      }}></Stack.Screen>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen}  options={{
        title: 'Create Account',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
      }}></Stack.Screen>
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{
        title: 'Forgot Password',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
      }}></Stack.Screen>
      <Stack.Screen name="ForgotPasswordSuccessScreen" component={ForgotPasswordSuccessScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}


const MoreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}
      animation="fade"
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name="SettingsContactScreen" component={ContactScreen} options={{
        title: 'Contact Us',
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 16,
        },
      }}></Stack.Screen>
    </Stack.Navigator>
  );
}

const AppNavigation = ({userLoggedIn, dispatch}) => (
  <Tab.Navigator
    initialRouteName="Feed"
    activeColor={AppStyles.navbar.activeColor}
    barStyle={{backgroundColor: AppStyles.navbar.backgroundColor}}
    tabBarOptions={{
      activeTintColor: AppStyles.color.main,
      labelStyle:{ fontSize: 10, },
      indicatorStyle: {backgroundColor: AppStyles.color.main},
      showIcon: true,
      showLabel: false,
    }}
  >
    <Tab.Screen name="Map"
      options={{
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons
            name="map"
            color={color}
            size={AppStyles.navbar.size}
          />
        ),
      }}
    >
      {props => <MapStack {...props} dispatch={dispatch}/>}
    </Tab.Screen>
    <Tab.Screen name="Add" component={AddStack}
      options={{
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons
            name="map-marker"
            color={color}
            size={AppStyles.navbar.size}
          />
        ),
      }}
    ></Tab.Screen>
    <Tab.Screen name="Profile" component={!userLoggedIn ? CreateProfileStack : ProfileStack}
      options={{
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons
            name="account-outline"
            color={color}
            size={AppStyles.navbar.size}
          />
        ),
      }}
    ></Tab.Screen>
    <Tab.Screen name="More" component={MoreStack}
      options={{
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons
            name="dots-horizontal"
            color={color}
            size={AppStyles.navbar.size}
          />
        ),
      }}
    ></Tab.Screen>
  </Tab.Navigator>
);

const App = ( {loggedIn, dispatch} ) => {

  useEffect(() => {
    let mounted = true;
    const verifyLogin = async () => {
      let userToken;
      try {
        userToken = await auth().currentUser;
      } catch (e) {}
      if (mounted) {
        dispatch(startSetLocations());
        dispatch(startSetCategories());
        dispatch(startSetFeatures());
        // dispatch(startAddCategory({
        //   name: 'Entertainment',
        //   icon: 'popcorn',
        //   colour: '#2ac4c7'
        // }))
        if (userToken != null) {
          dispatch(startSetUser(userToken.uid));
          dispatch({type: 'RESTORE_LOGIN', loggedIn: true});
        } else {
          dispatch({type: 'RESTORE_LOGIN', loggedIn: false});
        }
      }
    };

    verifyLogin();
    return () => mounted = false;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          ...TransitionPresets.FadeFromBottomAndroid,
        }}>
        <Stack.Screen name="Navigation">
          {props => <AppNavigation {...props} dispatch={dispatch} userLoggedIn={loggedIn}/>}
        </Stack.Screen>
        <Stack.Screen name="AddLoginModal" component={ModalProfileStack}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = state => ({
  loggedIn: state.auth.isLoggedIn
});

const AppStack = connect(mapStateToProps)(App);

export {AppStack, App};

//Cafe
//Restaurant / Bar
//Accomodation
//Attractions
//Walks / Parks