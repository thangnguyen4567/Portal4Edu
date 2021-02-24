import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
// import moment from 'moment';
import { VnrLoadingSevices } from '../components/VnrLoading/VnrLoadingPages';
// import { ToasterSevice } from '../components/Toaster/Toaster';
// import DocumentPicker from 'react-native-document-picker';
// import RNFS from 'react-native-fs';
// import base64 from 'react-native-base64';

export default class ManageFileSevice {

  static async ReviewFile(urlFile) {
    if (!urlFile) {
      return;
    }
    debugger
    VnrLoadingSevices.show();
    const title = urlFile.split('/').pop().split('#')[0].split('?')[0];
    const ext = title.substring(title.indexOf('.') + 1, title.length);
    const uriFileReplateSpace = urlFile.split(' ').join('%20');
    const configOption = {
      fileCache: true,
      //path: urlFile,
      title: title,
      appendExt: ext,
    };


    RNFetchBlob.config(configOption)
      .fetch('GET', uriFileReplateSpace, {})
      .then((res) => {
        // VnrLoadingSevices.hide();
        const filePath = res.path();
        FileViewer.open(filePath)
          .then(res => {
            VnrLoadingSevices.hide();
            console.log(res);
          })
          .catch(error => {
            VnrLoadingSevices.hide();
            console.log(error);
          })
        // FileViewer.open(filePath,
        //   {
        //     onDismiss: () => {
        //       VnrLoadingSevices.hide();
        //       res.flush()
        //     }
        //   });
      })
      .catch((e) => {
        // ToasterSevice.showError('NotTemplate', 4000)
        // VnrLoadingSevices.hide();
      });
  }
  static ActualDownload(urlFile) {
    VnrLoadingSevices.show();
    const { dirs } = RNFetchBlob.fs;
    const title = urlFile.split('/').pop().split('#')[0].split('?')[0];
    const configOption = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: title,
        path: `${dirs.DownloadDir}/${(new Date()).getTime()}/${title}`,
      },
    }
    RNFetchBlob.config(configOption)
      .fetch('GET', urlFile, {})
      .then((res) => {
        VnrLoadingSevices.hide();
        // ToasterSevice.showSuccess("DownloadSucceesfull", 5000);
      })
      .catch((error) => {
        VnrLoadingSevices.hide();
        // ToasterSevice.showError('HRM_Payroll_ErrorInProcessing', 5000);
      });
  }
  static async DownloadFile(urlFile) {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.ActualDownload(urlFile);
      } else {
        Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
      }
    } catch (err) {
      console.warn(err);
    }
  }
}