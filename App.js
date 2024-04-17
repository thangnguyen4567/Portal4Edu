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
  SafeAreaView,
  Platform,
  View,
  Alert,
} from 'react-native';
import WebViewComponent from './components/WebView';
import Vnr_Function from './utils/Vnr_Function';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DeviceInfo from 'react-native-device-info';
import VnrLoading from './components/VnrLoading/VnrLoading';
import VnrLoadingPages from './components/VnrLoading/VnrLoadingPages';
import NetInfo from '@react-native-community/netinfo';
import OfflineView from './components/OfflineView';
export default class App extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      deviceId: '',
      token: null,
      dataNotification: null,
      refreshWebView: false,
      isConnected: true
    }
  }

  OneSignalInit = () => {
      // Đẩy thông báo App
      OneSignal.setAppId("646c0def-07ca-40f8-a51b-5b87f48644c1");
      OneSignal.getDeviceState().then(deviceState => {
          this.onIds(deviceState)
      })
      OneSignal.setNotificationOpenedHandler(this.onOpened);
    }

  componentWillUnmount() {
    // Hủy đăng ký xử lý khi component unmount
    OneSignal.clearHandlers();
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    if (!Vnr_Function.CheckIsNullOrEmpty(openResult.notification.payload) &&
      !Vnr_Function.CheckIsNullOrEmpty(openResult.notification.payload.additionalData) &&
      !Vnr_Function.CheckIsNullOrEmpty(openResult.notification.payload.additionalData.screenName)) {
      let screenName = openResult.notification.payload.additionalData.screenName;
      let params = {};
      if (!Vnr_Function.CheckIsNullOrEmpty(openResult.notification.payload.additionalData.params)) {
        params = openResult.notification.payload.additionalData.params;
      }
      let _dataNotification = JSON.stringify({ screenName: screenName, params: params });
      this.setState({
        dataNotification: _dataNotification,
        refreshWebView: !this.state.refreshWebView
      })
    }
  }

  onIds = async (device) => {
    if (device.userId != null) {
      //this.setState({ playerId: device.userId , deviceId : device.userId });
      await AsyncStorage.setItem('DeviceId', device.userId);
      this.SetDeviceId(device.userId);
      // this.setState({ 'deviceId': device.userId})
    }
  }

  checkEmptyDeviceId = async () => {
    const _deviceId = await AsyncStorage.getItem('DeviceId');
    if (_deviceId != null) {
      this.SetDeviceId(_deviceId);
      this.OneSignalInit();
    }
    else {
      this.SetDeviceId('first_app');
      this.OneSignalInit();
    }
  }
  componentDidMount() {
    this.checkEmptyDeviceId();
    console.disableYellowBox = true;
    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor('#33A2F8', true);
    }
    NetInfo.addEventListener((state) => {
      var status = `${state.isConnected}`;
      if(status == 'true') {
          this.setState({isConnected:true})
      } else {
          this.setState({isConnected:false})
      }
    })
  }

  SetDeviceId = async (_deviceId) => {
    // const UniqueId = DeviceInfo.getUniqueId();
    const _Token = await AsyncStorage.getItem('Token');
    if (_Token != undefined && _Token != '') {
      this.setState({ 'deviceId': _deviceId, 'token': _Token });
    }
    else {
      this.setState({ 'deviceId': _deviceId, 'token': '' });
    }
  }

  render() {
    const { deviceId, token, dataNotification, refreshWebView, isConnected } = this.state;
    let viewWeb = <VnrLoading size={'large'} />;
    if (deviceId != '' && deviceId != null) {
      viewWeb = (
        <WebViewComponent
          DeviceId={deviceId}
          Token={token}
          DataNotification={dataNotification}
          refreshWebView={refreshWebView}
        />);
    }
    return (
      <View style={{ flex: 1, }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#33A2F8' }}></SafeAreaView>
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <VnrLoadingPages />
          {isConnected == true ? (
            viewWeb
          ) : (
            <OfflineView/>
          )}
          {/* {
            deviceId && (
              <TextInput value={deviceId}>
              </TextInput>
            )
          } */}
        </SafeAreaView>
      </View>
      //https://portal4edu.vnresource.net:82
    );
  }
};