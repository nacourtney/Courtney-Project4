import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const key = "@MyApp:key";

export default class App extends Component {
  state = {
    text: "",
    storedValue: "",
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

  render() {
    const { storedValue, text } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.preview}>{storedValue}</Text>
        <View>
          <Picker
            style={styles.picker}
            selectedValue={this.state.storedValue}
            onValueChange={this.onChangeText}
            onChangeText={this.onChange}
            value={text}
            placeHolder="Type Somthing Here..."
          >
            <Picker.Item label="1 Star" value="oneStar" />
            <Picker.Item label="2 Stars" value="twoStars" />
            <Picker.Item label="3 Stars" value="threeStars" />
            <Picker.Item label="4 Stars" value="fourStars" />
            <Picker.Item label="5 Stars" value="fiveStars" />
          </Picker>
          <Picker
            style={styles.picker}
            selectedValue={this.state.storedValue}
            onValueChange={this.onChangeText}
          >
            <Picker.Item label="1 Star" value="oneStar" />
            <Picker.Item label="2 Stars" value="twoStars" />
            <Picker.Item label="3 Stars" value="threeStars" />
            <Picker.Item label="4 Stars" value="fourStars" />
            <Picker.Item label="5 Stars" value="fiveStars" />
          </Picker>
          <Picker
            style={styles.picker}
            selectedValue={this.state.storedValue}
            onValueChange={this.onChangeText}
          >
            <Picker.Item label="1 Star" value="oneStar" />
            <Picker.Item label="2 Stars" value="twoStars" />
            <Picker.Item label="3 Stars" value="threeStars" />
            <Picker.Item label="4 Stars" value="fourStars" />
            <Picker.Item label="5 Stars" value="fiveStars" />
          </Picker>
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
    width: 200,
    margin: 1,
  },
});
