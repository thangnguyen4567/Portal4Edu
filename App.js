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
  View
} from 'react-native';
import WebViewComponent from './components/WebView';
import Vnr_Function from './utils/Vnr_Function';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
// import DeviceInfo from 'react-native-device-info';
import VnrLoading from './components/VnrLoading/VnrLoading';
export default class App extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      deviceId: '',
      token: null,
      dataNotification: null,
      refreshWebView: false
      //playerId: ''
    }
    this.isHaveDeviceId = false;

  }

  OneSignalInit = () => {
    OneSignal.init("646c0def-07ca-40f8-a51b-5b87f48644c1", {
      kOSSettingsKeyAutoPrompt: true, // tu dong nhac nguoi dung kich hoat thong bao
      kOSSettingsKeyInFocusDisplayOption: 2 // cau hinh hien thi khi app dang bat hien thi notification
    });
    OneSignal.inFocusDisplaying(2); // hien thi notification khi app dang bat
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
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
    if (device.userId != null && !this.isHaveDeviceId) {
      //this.setState({ playerId: device.userId , deviceId : device.userId });
      await AsyncStorage.setItem('DeviceId', device.userId);
      this.SetDeviceId(device.userId);
    }
  }

  checkEmptyDeviceId = async () => {
    const _deviceId = await AsyncStorage.getItem('DeviceId');
    if (_deviceId != null) {
      this.SetDeviceId(_deviceId);
      this.isHaveDeviceId = true;
      this.OneSignalInit();
    }
    else {
      this.OneSignalInit();
    }
  }
  componentDidMount() {
    this.checkEmptyDeviceId();
    console.disableYellowBox = true;
    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor('#33A2F8', true);
    }
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
    const { deviceId, token, dataNotification, refreshWebView } = this.state;
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
          {viewWeb}
        </SafeAreaView>
      </View>
      //https://portal4edu.vnresource.net:82
    );
  }
};

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// import React, { Component } from 'react';
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   View,
//   Button,
//   TouchableOpacity
// } from 'react-native';
// import OneSignal from 'react-native-onesignal';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// type Props = {};
// export default class App extends Component<Props> {

//   constructor(properties) {
//     super(properties);
//     OneSignal.init("646c0def-07ca-40f8-a51b-5b87f48644c1", {
//       kOSSettingsKeyAutoPrompt: true, // tu dong nhac nguoi dung kich hoat thong bao
//       kOSSettingsKeyInFocusDisplayOption: 2 // cau hinh hien thi khi app dang bat hien thi notification
//     });

//     OneSignal.addEventListener('received', this.onReceived);
//     OneSignal.addEventListener('opened', this.onOpened);
//     OneSignal.addEventListener('ids', this.onIds);
//     this.state = {
//       show: false
//     }
//   }

//   handleOpen = () => {
//     this.setState({ show: true })
//   }

//   handleClose = () => {
//     this.setState({ show: false })
//   }
//   componentWillUnmount() {

//     OneSignal.removeEventListener('received', this.onReceived);
//     OneSignal.removeEventListener('opened', this.onOpened);
//     OneSignal.removeEventListener('ids', this.onIds);
//     OneSignal.inFocusDisplaying(2); // hien thi notification khi app dang bat
//   }

//   onReceived(notification) {
//     console.log("Notification received: ", notification);
//   }

//   onOpened(openResult) {
//     console.log('Message: ', openResult.notification.payload.body);
//     console.log('Data: ', openResult.notification.payload.additionalData);
//     console.log('isActive: ', openResult.notification.isAppInFocus);
//     console.log('openResult: ', openResult);
//   }

//   onIds(device) {
//     debugger
//     console.log('Device info: ', device);
//   }

//   render() {
//     return (
//       <View style={styles.container}>

//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit App.js
//         </Text>
//         <Text style={styles.instructions}>
//           {instructions}
//         </Text>
//         <TouchableOpacity onPress={()=> { OneSignal.increaseBadgeCount() }}>
//           <Text>Increase badge</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
