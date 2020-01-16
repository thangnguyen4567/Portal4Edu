/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';


import { WebView } from 'react-native-webview';
import firebase from 'react-native-firebase'
import AsyncStorage from '@react-native-community/async-storage';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'diviceId': '',
      'Token': null
    }
  }

  // lấy được cấp quyền chúng ta sẽ lấy Fcm Token về ( như id của mỗi thiết bị ) lưu vào AsynStorage
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    //console.log("before fcmToken: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        //console.log("after fcmToken: ", fcmToken);

        await AsyncStorage.setItem('fcmToken', fcmToken);
        this.setState({ 'diviceId': fcmToken});
      }
    }
    else
    {
      let diviceIdFromAsyncStorage = await AsyncStorage.getItem('fcmToken') ;
      this.setState({ 'diviceId': diviceIdFromAsyncStorage});
    }
  };
  async setStateDivice() {
    const Token = await AsyncStorage.getItem('Token');
    
    
    if (Token != null) {
      this.setState({ 'Token': Token , 'diviceId': await AsyncStorage.getItem('fcmToken') });
    }
    
  }
  // hàm yêu cầu cấp quyền
  async requestPermission() {

    firebase.messaging().requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  };
  // kiểm tra đã có  quyền chưa nếu chưa thì yêu cầu cấp , đã có thì getTokent()
  async checkPermission() {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          //console.log("Permission granted");
          this.getToken();
        } else {
          //console.log("Request Permission");
          this.requestPermission();
        }
      });
  }

  // hàm lắng nghe notification
  messageListener = async () => {
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel',
      firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');
    //console.log('my chanel id = ', channel);
    firebase.notifications().android.createChannel(channel);

    // bắt sự kiện gửi notification khi nguoi dung dang online (foreground)
    this.notificationListener = firebase.notifications().onNotification((notification) => {

      notification

        .android.setChannelId('test-channel') // gọi channel
        .android.setSmallIcon('ic_stat_vnr') // icon của notification
        .android.setColor('#33A2F8') // màu của icon
        .android.setPriority(firebase.notifications.Android.Priority.Max) // độ quan trọng 
        .setSound('default') // âm thanh mặc định
      firebase.notifications()
        .displayNotification(notification) // hiển thị luôn notification khi có thông báo

    });
    // nhâp vào thông báo ở màn hình chính khi app đang offline (background)
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      //console.log('getInitial Notification', notificationOpen.notification.data);

      const { title, body } = notificationOpen.notification.data;
      this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage((message) => {

      //console.log(JSON.stringify(message));
    });
  }
  async componentDidMount() {
    //AsyncStorage.setItem('fcmToken', '');
    this.checkPermission();
    this.messageListener();
    this.setStateDivice();
  }

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }


  // sendNotification = () => {
  //   //const { tokent } = this.state;
  //   const key = 'AAAAQ44pt8M:APA91bEDAxuxb_fcCPn0oqx1RpZ0mPWGQHBW2Hp8ZkjyGAyxrbpd01wYtVv1-3vPP_QHXbMiG9DHEHU0Y-Wovm0tG6itbV-bBHuIWZAAoE6bKZzSG-oGgGUCPlIVytBNiaNnlPzbaP4a';
  //   const to = this.state.Token;
  //   //const to = 'cKxI-RMsrt8:APA91bEU1JQpW-jz7Xtu7-HlmCF9N1subLLqzCIrSn6yBYljpXklkwWW8spDqNkkIbjwWX9D3v9hX8eCvu68Fe-9F2M7tLjufaog4HuUslbhoD7GhaktOgApRBvChHtRT7hrLUSP1qM8';
  //   const notification = {
  //     "body": "Thông báo từ admin",
  //     "title": "React Native Firebase",
  //     "content_available": true,
  //     "priority": "high", // độ ưu tiên cao , độ quan trọng 
  //     "android_channel_id": "test-channel", // kênh được khai báo ở trên với android 8.0 trở lên phải có kenh thì notifi mới show
  //     "image": "https://tinyjpg.com/images/social/website.jpg" // image cho nitification
  //   };
  //   const data = { // nội dung của thông báo khi người dùng nhấp vào thông báo
  //     "body": "data cua thong bao",
  //     "title": "React Native Firebase",
  //     "content_available": true,
  //     "priority": "high"
  //   }
  //   fetch('https://fcm.googleapis.com/fcm/send', {
  //     'method': 'POST',
  //     'headers': {
  //       'Authorization': 'key=' + key,
  //       'Content-Type': 'application/json'
  //     },
  //     'body': JSON.stringify({
  //       'notification': notification,
  //       'to': to,
  //       'data' : data
  //     })
  //   }).then(function(response) {
  //     console.log('push succuessful' ,response);
  //   }).catch(function(error) {
  //     console.error(error);
  //   })
  // }
  RenderWebView = ()=>{
    
    const {diviceId,Token} = this.state; 
    const script_Inject = `
      setTimeout(function () {
        
        if(window.location.hash === "#/access/LoginMobile" && LoginMobile && typeof LoginMobile == "function"){
          LoginMobile('${diviceId}','${Token}');
        }
      },3000);
      true;
    `;
    console.log(script_Inject);
    return (
        <WebView 
        source={{ uri: 'https://portal4edu.vnresource.net:82/#/access/LoginMobile' }}
        javaScriptEnabled = {true}//localStorage.setItem("authorizationData", "{"UserID":24872,"Token":"np9Mu1WT10jOK6NL8kdKQa4ReUCf5oeM","UserName":"vnr","UserCode":"vnr","urlApi":"http://portalapi4edu.vnresource.net/","CenterCode":"vnr","IPInternet":null,"IPLocal":null,"AccessTime":"2020-01-07T16:41:12.007875+07:00","ExpireTime":"2020-01-07T17:11:12.007875+07:00","Status":0,"ClientInfo":{},"UserResource":{}}");
        injectedJavaScript={script_Inject}
        
        onMessage={event => {
          //debugger
          console.log(event.nativeEvent.data,'event.nativeEvent.data');
          AsyncStorage.setItem('Token', event.nativeEvent.data);
        }}
      />
    )
  }
  render() {
    const {diviceId ,Token} = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'column',justifyContent:'center' }}>
          {(diviceId != '' && diviceId != null) ? this.RenderWebView() : <View></View>}
      </View>
      //https://portal4edu.vnresource.net:82
      

      
    );
    

    
  }
};
