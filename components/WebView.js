// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Platform,
  BackHandler,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import VnrLoading from './VnrLoading/VnrLoading';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
const { height, width } = Dimensions.get('window');
export default class WebViewComponent extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      visible: true,
      //url: null
      //script_Inject : null,
    };
    this.refWebView = null;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    if (this.refWebView != null) {
      this.refWebView.goBack();
      return true;
    }
  }
  

  componentWillReceiveProps(nextProps) {
    if (this.props.refreshWebView != nextProps.refreshWebView) {
      console.log('componentWillReceiveProps');
      const { DeviceId, Token, DataNotification } = nextProps;
      const script_Inject = `
      setTimeout(function () {
        if(LoginMobile && typeof LoginMobile == "function"){
          LoginMobile('${DeviceId}','${Token}','${DataNotification}');  
        }
      },500);
      true;
    `;
      this.refWebView.injectJavaScript(script_Inject);
    }
  }
  render() {
    const { DeviceId, Token, DataNotification } = this.props;
    const script_Inject = `
      setTimeout(function () {
        if(window.location.hash === "#/access/LoginMobile" && LoginMobile && typeof LoginMobile == "function"){
          LoginMobile('${DeviceId}','${Token}','${DataNotification}');  
        }
      },2000);
      true;
    `;
    return (
      <View style={{ flex: 1 }}>
        <WebView
          onLoad={() => this.setState({ visible: false })}
          ref={ref => this.refWebView = ref}
          source={{ uri: 'https://portal4edu.vnresource.net:82/#/access/LoginMobile' }}
          javaScriptEnabled={true}//localStorage.setItem("authorizationData", "{"UserID":24872,"Token":"np9Mu1WT10jOK6NL8kdKQa4ReUCf5oeM","UserName":"vnr","UserCode":"vnr","urlApi":"http://portalapi4edu.vnresource.net/","CenterCode":"vnr","IPInternet":null,"IPLocal":null,"AccessTime":"2020-01-07T16:41:12.007875+07:00","ExpireTime":"2020-01-07T17:11:12.007875+07:00","Status":0,"ClientInfo":{},"UserResource":{}}");
          injectedJavaScript={script_Inject}
          onMessage={event => {
            AsyncStorage.setItem('Token', event.nativeEvent.data);
          }}
        />
        {this.state.visible && (
          <View style={{
            position: "absolute",
            top: 0,
            height: height,
            width: width,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator
              //style={{ position: "absolute", top: (height / 2) - 36, left: (width / 2) - 36 }}
              size="large"
              color={'#33A2F8'}
            />
          </View>

        )}
      </View>

    );
  }
};
