import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

const APP_URL = 'https://kata671.github.io/iminpain/'; // podmień na swoją domenę, jeśli chcesz

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <WebView
        source={{ uri: APP_URL }}
        style={{ flex: 1 }}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}