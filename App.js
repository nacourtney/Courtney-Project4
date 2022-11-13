import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

import RNPickerSelect from "react-native-picker-select";

const key = "@MyApp:key";

const playlist = [
  {
    title: "People Watching",
    artist: "Keller Williams",
    album: "Keller Williams Live at The Westcott Theater on 2012-09-22",
    uri: "https://ia800308.us.archive.org/7/items/kwilliams2012-09-22.at853.flac16/kwilliams2012-09-22at853.t16.mp3",
  },
  {
    title: "Hunted By A Freak",
    artist: "Mogwai",
    album: "Mogwai Live at Ancienne Belgique on 2017-10-20",
    uri: "https://ia601509.us.archive.org/17/items/mogwai2017-10-20.brussels.fm/Mogwai2017-10-20Brussels-07.mp3",
  },
  {
    title: "Nervous Tic Motion of the Head to the Left",
    artist: "Andrew Bird",
    album: "Andrew Bird Live at Rio Theater on 2011-01-28",
    uri: "https://ia800503.us.archive.org/8/items/andrewbird2011-01-28.early.dr7.flac16/andrewbird2011-01-28.early.t07.mp3",
  },
];
export default class App extends Component {
  state = {
    text: "",
    storedValueFirstPicker: "",
    storedValueSecondPicker: "",
    storedValueThirdPicker: "",

    isPlaying: false,
    playbackInstance: null,
    volume: 1.0,
    currentTrackIndex: 0,
    isBuffering: false,
    songIndex: 0,
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

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: (Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX = 1),
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: (Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX = 1),
    });
    this.loadAudio();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying
      ? await playbackInstance.pauseAsync()
      : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying,
    });
  };

  handlePreviousTrack = async () => {
    let { playbackInstance, currentTrackIndex } = this.state;
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      currentTrackIndex === 0
        ? (currentTrackIndex = playlist.length - 1)
        : (currentTrackIndex -= 1);
      this.setState({
        currentTrackIndex,
      });
      this.loadAudio();
    }
  };

  handleNextTrack = async () => {
    let { playbackInstance, currentTrackIndex } = this.state;
    if (playbackInstance) {
      await playbackInstance.unloadAsync();
      currentTrackIndex < playlist.length - 1
        ? (currentTrackIndex += 1)
        : (currentTrackIndex = 0);
      this.setState({
        currentTrackIndex,
      });
      this.loadAudio();
    }
  };

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering,
    });
  };

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const source = {
      uri: playlist[this.state.currentTrackIndex].uri,
    };
    const status = {
      shouldPlay: this.state.isPlaying,
      volume: this.state.volume,
    };
    playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    await playbackInstance.loadAsync(source, status, false);
    this.setState({
      playbackInstance,
    });
  }

  renderSongInfo() {
    const { playbackInstance, currentTrackIndex } = this.state;
    return playbackInstance ? (
      <View style={styles.trackInfo}>
        <Text style={[styles.trackInfoText, styles.largeText]}>
          {playlist[currentTrackIndex].title}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {playlist[currentTrackIndex].artist}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {playlist[currentTrackIndex].album}
        </Text>
      </View>
    ) : null;
  }

  setSongIndex(currentTrack) {
    this.state.songIndex = currentTrack;
  }

  render() {
    const {
      storedValueFirstPicker,
      storedValueSecondPicker,
      storedValueThirdPicker,
      currentTrackIndex,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.audioContainer}>
          <Text style={[styles.largeText, styles.buffer]}>
            {this.state.isBuffering && this.state.isPlaying
              ? "Buffering..."
              : null}
          </Text>
          {this.renderSongInfo()}
          <SafeAreaView style={styles.controls}>
            <TouchableOpacity
              style={styles.control}
              onPress={this.handlePreviousTrack}
            >
              <Feather name="skip-back" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.control}
              onPress={this.handlePlayPause}
            >
              {this.state.isPlaying ? (
                <Feather name="pause" size={32} color="#fff" />
              ) : (
                <Feather name="play" size={32} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.control}
              onPress={() => {
                this.handleNextTrack();
                this.setSongIndex(currentTrackIndex);
              }}
            >
              <Feather name="skip-forward" size={32} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>

        <Text style={styles.preview}>
          {"People Watching Rating: " + storedValueFirstPicker + "\n"}
          {"Hunted By A Freak Rating: " + storedValueSecondPicker + "\n"}
          {"Nervous Tic Rating: " + storedValueThirdPicker + "\n"}
        </Text>

        <View>
          <RNPickerSelect
            style={pickerStyle}
            placeholder={{
              label: "Choose Rating",
              value: null,
            }}
            onValueChange={(value) => {
              if (this.state.songIndex === 0) {
                this.state.storedValueFirstPicker = value;
              }
              if (this.state.songIndex === 1) {
                this.state.storedValueSecondPicker = value;
              }
              if (this.state.songIndex === 2) {
                this.state.storedValueThirdPicker = value;
              }
            }}
            items={[
              { label: "One Star", value: "1 Star" },
              { label: "Two Stars", value: "2 Stars" },
              { label: "Three Stars", value: "3 Stars" },
              { label: "Four Stars", value: "4 Stars" },
              { label: "Five Stars", value: "5 Stars" },
            ]}
          />
          <Text></Text>

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
    backgroundColor: "white",
  },
  audioContainer: {
    flex: 0.5,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: "deeppink",
    backgroundColor: "#191A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  trackInfo: {
    padding: 40,
    backgroundColor: "#191A1A",
  },
  buffer: {
    color: "#fff",
  },
  trackInfoText: {
    textAlign: "center",
    flexWrap: "wrap",
    color: "#fff",
  },
  largeText: {
    fontSize: 22,
  },
  smallText: {
    fontSize: 16,
  },
  control: {
    margin: 20,
  },
  controls: {
    flexDirection: "row",
    borderColor: "blue",
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
    backgroundColor: "blue",
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
