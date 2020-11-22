import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function MyGold({ goldStatus }) {
  return (
    <View style={{position: 'absolute', top: 45, left: 10}}>
      <TouchableOpacity
        style={{ width: '100%'}}
      >
        <Text style={{ color: 'gray', fontSize: 25, fontWeight:'bold' }}>
          <Image style={{resizeMode: "contain",}} source={require('../assets/icon/coin.png')} />
          { goldStatus } G
        </Text>
      </TouchableOpacity>
    </View>
  );
}
