// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView,Image,
  Platform
} from 'react-native';



export default class Loading extends Component {
  constructor(properties) {
    super(properties);

  }
  render() {
    return (
        <View style={{ flex: 1, flexDirection: 'column',justifyContent:'center',alignItems:'center',
        backgroundColor:'red'
        }}>
          <Image
            style={{ width : 100 }}
            source={require('../images/loading.gif')}
          />
        </View>
      
    );
  }
};
