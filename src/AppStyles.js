import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const SCREEN_WIDTH = width < height ? width : height;
const numColumns = 2;

export const AppStyles = {
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    height: '100%',
  },
  scrollView: {
    marginTop: 10,
  },
  screen:{
    positionTop: "4%",
    positionLeft: "4%",
    positionRight: "4%",
  },
  color: {
    background: '#ffffff',
    heading: '#602d7b',
    main: '#602d7b',
    subHeading: "#000000",
    text: '#000000',
  },
  fontSize: {
    title: 16,
    text: 16,
    heading: 24,
    subHeading: 20,
  },
  fontName: {
    main: 'Lato-Regular',
    bold: 'Flama Bold',
  },
  images: {
    logo: '/',
  },
  navbar: {
    activeColor: "#602d7b",
    backgroundColor: "#ffffff",
    size: 26,
  }
};
