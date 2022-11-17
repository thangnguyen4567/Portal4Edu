// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

import React, { Component } from "react"
import {
  StatusBar,
  View,
  Platform,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Image
} from "react-native"

import VnrLoading from "./VnrLoading/VnrLoading"
import { WebView } from "react-native-webview"
import AsyncStorage from '@react-native-async-storage/async-storage';
import ManageFileSevice from "../utils/ManageFileSevice"
const { height, width } = Dimensions.get("window")
export default class WebViewComponent extends Component {
  constructor(properties) {
    super(properties)
    this.state = {
      visible: true,
      token: null,
      modalLeanOnline: {
        visible: false,
        uri: null
      },
      isCanGoback : false
      //url: null
      //script_Inject : null,
    }
    this.refWebView = null;
    this.refWebViewLean = null;
    this.canGoback = null;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    )
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    )
  }

  handleBackButtonClick = () => {
    if (this.refWebView != null) {
      this.refWebView.goBack()
      return true
    }
  }

  refreshWebView = async (nextProps) => {
    if (this.props.refreshWebView != nextProps.refreshWebView) {
      debugger
      // console.log("componentWillReceiveProps")
      const { DeviceId, DataNotification } = nextProps;
      const _Token = await AsyncStorage.getItem('Token');
      // { token } = this.state;

      let script_Inject = `
        setTimeout(function () {
          if(LoginMobile && typeof LoginMobile == "function"){
            LoginMobile('${DeviceId}','${_Token}','${DataNotification}');
          }
        },500);
        true;
      `;

      // if (token !== null) {
      //   console.log(token);

      // }
      // else {
      //   script_Inject = `
      //     setTimeout(function () {
      //       if(LoginMobile && typeof LoginMobile == "function"){
      //         LoginMobile('${DeviceId}','${Token}','${DataNotification}');
      //       }
      //     },500);
      //     true;
      //   `;
      // }
      this.refWebView.injectJavaScript(script_Inject)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.refreshWebView(nextProps)
  }

  isUrlValid = (userInput) => {
    var regexQuery =
      "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$"
    var url = new RegExp(regexQuery, "i")
    return url.test(userInput)
  }

  listenFromWeb = async (event) => {
    let data = null
    try {
      data = JSON.parse(event.nativeEvent.data)
    } catch (error) {
      data = event.nativeEvent.data
    }

    console.log(data, 'datadatadata')

    if (
      data != null &&
      typeof data == "object" &&
      data.type === "E_DOWNLOAD" &&
      data.uri !== null &&
      data.uri !== "" &&
      this.isUrlValid(data.uri)
    ) {
      if (Platform.OS == "ios") {
        ManageFileSevice.ReviewFile(data.uri)
      }
      else {
        ManageFileSevice.DownloadFile(data.uri)
      }
    }
    else if (data != null &&
      typeof data == "object" &&
      data.type === "E_LEARNONLINE" &&
      data.uri !== null &&
      data.uri !== ""
    ) {
      console.log(data.uri, 'data.uridata.uri')
      this.setState({
        modalLeanOnline: {
          visible: true,
          uri: data.uri
        }
      })
    }
    else if (event.nativeEvent.data && (data.uri == null && data.uri == "")) {
      await AsyncStorage.setItem("Token", event.nativeEvent.data)
      //this.setState({ token: event.nativeEvent.data })
    }
  }

  closeModalLean = () => {
    this.setState({
      modalLeanOnline: {
        visible: false,
        uri: null
      }
    })
  }

  goBack = () => {
    console.log(this.canGoback && this.refWebViewLean,'this.canGoback && this.refWebViewLean')
    if (this.canGoback && this.refWebViewLean) {
      this.refWebViewLean.goBack()
    }
    else {
      this.closeModalLean();
    }
  }

  render() {
    const { DeviceId, Token, DataNotification } = this.props;
    const { modalLeanOnline } = this.state;
    const script_Inject = `
      setTimeout(function () {
        if(window.location.hash === "#/access/LoginMobile" && LoginMobile && typeof LoginMobile == "function"){
          LoginMobile('${DeviceId}','${Token}','${DataNotification}');
        }
      },2000);
      true;
    `
    return (
      <View style={{ flex: 1 }}>
        <WebView
          onLoad={() => this.setState({ visible: false })}
          ref={(ref) => (this.refWebView = ref)}
          source={{
            uri:
              `https://portal4edu.vnresource.net:82/#/access/LoginMobile`,
          }}
          javaScriptEnabled={true} //localStorage.setItem("authorizationData", "{"UserID":24872,"Token":"np9Mu1WT10jOK6NL8kdKQa4ReUCf5oeM","UserName":"vnr","UserCode":"vnr","urlApi":"http://portalapi4edu.vnresource.net/","CenterCode":"vnr","IPInternet":null,"IPLocal":null,"AccessTime":"2020-01-07T16:41:12.007875+07:00","ExpireTime":"2020-01-07T17:11:12.007875+07:00","Status":0,"ClientInfo":{},"UserResource":{}}");
          injectedJavaScript={script_Inject}
          onMessage={(event) => this.listenFromWeb(event)}
        // sharedCookiesEnabled={true}
        // onNavigationStateChange={(navState) => {
        //   // Keep track of going back navigation within component
        //   console.log(navState, 'navState')
        // }}
        />
        <Modal visible={modalLeanOnline.visible}>
          <SafeAreaView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>

            <WebView
              // onLoad={() => this.setState({ visible: false })}
              ref={(ref) => (this.refWebViewLean = ref)}
              source={{
                uri: modalLeanOnline.uri,
              }}
              onLoadStart={syntheticEvent => {

              }}
              onLoadEnd={syntheticEvent => {
                // hàm gọi khi end load
                const { nativeEvent } = syntheticEvent;
                this.canGoback = nativeEvent.canGoBack;
                if (nativeEvent.canGoBack === false) {
                  this.setState({
                    isCanGoback: false
                  })
                }else{
                  this.setState({
                    isCanGoback: true
                  })
                }
              }}
            />

            <TouchableOpacity onPress={() => this.goBack()}
              style={{
                position: 'absolute',
                bottom: 20,
                left: (width / 2) - 15,
                zIndex: 2
              }}
            >
              <SafeAreaView>
                <View style={{ width: 30, height: 30, borderRadius: 17.5, backgroundColor: '#ffffff' }}>
                  {this.state.isCanGoback ? (
                    <Image source={require('../images/back.png')} style={{ width: 35, height: 35, }} />
                  ) : (
                    <Image source={require('../images/Close.png')} style={{ width: 35, height: 35, }} />
                  )}
                </View>
              </SafeAreaView>
            </TouchableOpacity>

          </SafeAreaView>
        </Modal>

        {this.state.visible && (
          <View
            style={{
              position: "absolute",
              top: 0,
              height: height,
              width: width,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              //style={{ position: "absolute", top: (height / 2) - 36, left: (width / 2) - 36 }}
              size="large"
              color={"#33A2F8"}
            />
          </View>
        )}
      </View>
    )
  }
}
