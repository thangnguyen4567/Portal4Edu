import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';


const api = {};
export const VnrLoadingSevices = api;

export default class VnrLoadingPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show = () => {
    this.setState({ isVisible: true });
  }

  hide = () => {
    this.setState({ isVisible: false });
  }

  componentDidMount() {
    api.show = this.show;
    api.hide = this.hide;
  }

  render() {

    const { container, modal } = styles;

    return (
      <View style={Platform.OS == 'ios' && { zIndex: 2, }} >
        {
          this.state.isVisible === true &&
          (
            <View style={modal}>
              <TouchableOpacity activeOpacity={1} style={[container]} onPress={() => null}>
                <ActivityIndicator size="large" color={'#33A2F8'} />
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    );
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  modal: {
    zIndex: 4,
    position: 'absolute',
    // paddingVertical: 0,
    // borderRadius: styleSheets.radius_5,
    //backgroundColor:Colors.black,
    height: height,
    width: width,
    alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: "center",
  },
})