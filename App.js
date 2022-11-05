import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RNPickerSelect from "react-native-picker-select";

const key = "@MyApp:key";

export default class App extends Component {
  state = {
    text: "",
    storedValueFirstPicker: "",
    storedValueSecondPicker: "",
    storedValueThirdPicker: "",
  };

  componentWillMount() {
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      this.setState({ storedValue });
    } catch (error) {
      Alert.alert("Error", "There was an error while loading the data");
    }
  };

  onSave = async () => {
    const { text } = this.state;

    try {
      await AsyncStorage.setItem(key, text);
      Alert.alert("Saved", "Successfully saved on device");
    } catch (error) {
      Alert.alert("Error", "There was an error while saving the data");
    }
  };

  onChange = (text) => {
    this.setState({ text });
  };

  setValue = (value, number) => {
    if (number === 1) {
      this.state.storedValueFirstPicker === value;
    }
    if (number === 2) {
      this.state.storedValueSecondPicker === value;
    } else {
      this.state.storedValueThirdPicker === value;
    }
  };

  render() {
    const {
      storedValueFirstPicker,
      storedValueSecondPicker,
      storedValueThirdPicker,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.preview}>
          {"First Value: " + storedValueFirstPicker + "\n"}
          {"Second Value: " + storedValueSecondPicker + "\n"}
          {"Third Value: " + storedValueThirdPicker + "\n"}
        </Text>
        <View>
          <RNPickerSelect
            style={pickerStyle}
            placeholder={{
              label: "First Picker",
              value: null,
            }}
            onValueChange={(value) =>
              (this.state.storedValueFirstPicker = value)
            }
            items={[
              { label: "One Star", value: "1 Star" },
              { label: "Two Stars", value: "2 Stars" },
              { label: "Three Stars", value: "3 Stars" },
              { label: "Four Stars", value: "4 Stars" },
              { label: "Five Stars", value: "5 Stars" },
            ]}
          />
          <Text></Text>
          <RNPickerSelect
            style={pickerStyle}
            placeholder={{
              label: "Second Picker",
              value: null,
            }}
            onValueChange={(value) =>
              (this.state.storedValueSecondPicker = value)
            }
            items={[
              { label: "One Star", value: "1 Star" },
              { label: "Two Stars", value: "2 Stars" },
              { label: "Three Stars", value: "3 Stars" },
              { label: "Four Stars", value: "4 Stars" },
              { label: "Five Stars", value: "5 Stars" },
            ]}
          />
          <Text></Text>
          <RNPickerSelect
            style={pickerStyle}
            placeholder={{
              label: "Third Picker",
              value: null,
            }}
            onValueChange={(value) =>
              (this.state.storedValueThirdPicker = value)
            }
            items={[
              { label: "One Star", value: "1 Star" },
              { label: "Two Stars", value: "2 Stars" },
              { label: "Three Stars", value: "3 Stars" },
              { label: "Four Stars", value: "4 Stars" },
              { label: "Five Stars", value: "5 Stars" },
            ]}
          />

          <TouchableOpacity onPress={this.onSave} style={styles.button}>
            <Text>Save locally</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLoad} style={styles.button}>
            <Text>Load data</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  preview: {
    backgroundColor: "#bdc3c7",
    width: 300,
    height: 80,
    padding: 10,
    borderRadius: 5,
    color: "#333",
    marginBottom: 50,
  },
  input: {
    backgroundColor: "#ecf0f1",
    borderRadius: 3,
    width: 300,
    height: 40,
    padding: 5,
  },
  button: {
    backgroundColor: "#f39c12",
    padding: 10,
    borderRadius: 3,
    marginTop: 10,
  },
  picker: {
    flex: 1,
    fontSize: 30,
    margin: 1,
    padding: 20,
  },
});

const pickerStyle = {
  inputIOS: {
    color: "white",
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    backgroundColor: "dodgerblue",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  inputAndroid: {
    color: "white",
  },
  placeholderColor: "white",
  underline: { borderTopWidth: 0 },
  icon: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 5,
    borderTopColor: "#00000099",
    borderRightWidth: 5,
    borderRightColor: "transparent",
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
    width: 0,
    height: 0,
    top: 20,
    right: 15,
  },
};
