import React from 'react';
import {Text, View, StyleSheet, Dimensions, ScrollView, TextInput, Button, Platform, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';

import {startAddReview} from '../actions/locations';
import {startEditUser, startSetUser} from '../actions/user';
import {AppStyles} from '../AppStyles';

class ProfileScreen extends React.Component {
  constructor(props){
    super();
    this.state = {
      username: '',
      summary: '',
      summaryCount: 80,
    }
  }

  componentDidMount() {
    this.setState({
      username: this.props.user.username,
      summary: this.props.user.summary,
    })
  }

  updateUsername(username) {
    this.setState({
      username: username,
    });
  }

  updateSummary(summary) {
    this.setState({
      summary,
      summaryCount: 80 - summary.length,
    });
  }

  submitForm() {
    const {user} = this.props;
    const {username, summary} = this.state;

    auth().currentUser.updateProfile({
      displayName: username,
    });

    this.props.dispatch(startEditUser(user.id, {username: username, summary: summary}));
    this.props.dispatch(startSetUser(user.id));

    this.props.locations.forEach(location => {
      location.reviews.forEach(review => {
        if (review.user.id == user.id) {
          console.log(location.reviews);
          let rvw = review
          rvw.user.name = username;
          location.reviews[location.reviews.indexOf(review)] = rvw;
          console.log(location.reviews);
          let reviews = location.reviews;
          this.props.dispatch(startAddReview(location.id, {reviews}))
        }
      })
    });

    this.props.navigation.popToTop();
  }

  render() {
    const {summaryCount} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            <View style={styles.input}>
              <Text style={styles.inputText}>Username</Text>
              <TextInput
                style={styles.textInput}
                onChange={(e) => this.updateUsername(e.nativeEvent.text)}
                value={this.state.username}
              />
            </View>
            <View style={styles.warning}>
              <Text>By updating your username all reviews added previously and in the future, will show as added by you with your new username.</Text>
            </View>
            <View style={styles.warning}>
              <Text>Note: You can only change your username once in a 90 day period.</Text>
            </View>
            <View style={styles.input}>
              <Text style={styles.inputText}>Short Bio</Text>
              <TextInput
                multiline
                style={styles.multiLineInput}
                maxLength={80}
                onChange={(e) => this.updateSummary(e.nativeEvent.text)}
                value={this.state.summary}
              />
              <Text style={styles.characterCount}>{summaryCount} characters remaining</Text>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={() => this.submitForm()}>
              <Text style={styles.submitButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: AppStyles.container.flex,
    height: AppStyles.container.height,
  },
  scrollView: {
    marginTop: AppStyles.scrollView.marginTop,
  },
  screen: {
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    marginTop: 5,
    marginBottom: 15,
  },
  inputText: {
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#eee',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    marginBottom: 5,
  },
  multiLineInput: {
    backgroundColor: '#eee',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  characterCount: {
    fontSize: 12,
    color: '#878787',
  },
  warning: {
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: AppStyles.color.main,
    marginTop: 10,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 7,
    paddingBottom: 7,
  },
});

const mapStateToProps = (state) => ({
  locations: state.locations,
  user: state.user,
});

export default connect(mapStateToProps)(ProfileScreen);