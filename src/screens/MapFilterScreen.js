import React from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Animated, Platform, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import {AppStyles} from '../AppStyles';
import {addCategoryFilter, removeCategoryFilter, addFeatureFilter, removeFeatureFilter, clearFilters} from '../actions/filters';

class MapFilterScreen extends React.Component {
  constructor(props){
    super();
  }

  selectCategory = (category, isSelected) => {
    if (!isSelected) {
      this.props.dispatch(addCategoryFilter(category.id));
    } else {
      this.props.dispatch(removeCategoryFilter(category.id));
    }
  }

  selectFeature = (feature, isSelected) => {
    if (!isSelected) {
      this.props.dispatch(addFeatureFilter(feature.id));
    } else {
      this.props.dispatch(removeFeatureFilter(feature.id));
    }
  }

  render() {
    const {categories, features} = this.props;
    let iconRows = [];
    const itemsPerRow = 3;
    const noOfRows = Math.ceil(categories.length / itemsPerRow);
    for(let i=0; i<noOfRows; i++) {
      const row = categories.slice((i*itemsPerRow), ((i+1)*itemsPerRow));
      iconRows.push(row);
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.screen}>
            <View style={styles.categories}>
              {
                iconRows.map((row, index) => {
                  return (
                    <View style={styles.iconRow} key={index}>
                      {
                        row.map((category, indx) => {
                          let selected = this.props.filters.categories.length;
                          if (selected) {
                            selected = this.props.filters.categories.includes(category.id);
                          }

                          return (
                            <View key={category.id} style={styles.icon}>
                                <MaterialCommunityIcons
                                  name={category.icon}
                                  color={(selected ? "#ffffff" : category.colour)}
                                  size={26}
                                  style={{
                                    backgroundColor: selected ? category.colour : ("#ffffff"),
                                    borderColor: category.colour,
                                    borderWidth: 2,
                                    borderRadius: 26,
                                    overflow: 'hidden',

                                    height: 52,width: 52,
                                    marginTop: 5,marginLeft: 32, marginRight: 32,
                                    paddingLeft: 13, paddingTop: 12,
                                  }}
                                  onPress={(e) => {
                                    this.selectCategory(category, selected);
                                  }}
                                />
                                <Text style={styles.iconName}>{category.name}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  )
                })
              }
            </View>
            <View style={styles.features}>
              {
                features.map(feature => {
                  let selected = this.props.filters.features.length;
                  if (this.props.filters.features.length) {
                    selected = this.props.filters.features.includes(feature.id);
                  }
                  return (
                    <TouchableOpacity key={feature.id} onPress={() => this.selectFeature(feature, selected)}>
                      <Text style={selected ? styles.featureSelected : styles.feature}>{feature.name}</Text>
                    </TouchableOpacity>
                  );
                })
              }
            </View>
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
  iconRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  icon: {
    width: '33%',
  },
  iconName: {
    textAlign: 'center',
  },
  categories: {
    marginBottom: 20,
  },
  features: {
    alignSelf:"flex-start",
    backgroundColor: '#ecf0f1',
    flex: 1,
    flexDirection:"row",
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 8,
    textAlign: 'center',
  },
  feature: {
    borderRadius: 18,
    borderWidth: 1,
    fontWeight: 'bold',
    color: 'black',
    padding: 8,
    overflow: 'hidden',
    marginBottom: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  featureSelected: {
    backgroundColor: AppStyles.color.main,
    borderColor: AppStyles.color.main,
    borderRadius: 18,
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 8,
    marginBottom: 10,
    marginRight: 10,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => ({
  categories: state.categories,
  features: state.features,
  filters: state.filters,
});

export default connect(mapStateToProps)(MapFilterScreen);

