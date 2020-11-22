import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';

import * as Google from 'expo-google-app-auth';
import * as SecureStore from 'expo-secure-store'
import * as env from '../env';

const image = require('../assets/dailytown.png')

export default function LoginSample({ navigation }) {
  async function check () {
    const jwt = await SecureStore.getItemAsync('token')
    console.log('JWT : ', jwt)
    if (jwt !== null) {
      navigation.navigate('Main')
    } else {
      console.log('로그인하세요')
    }
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      check()
    });
    return unsubscribe;
}, [navigation])

  const onPress = async () => {
    const res = await Google.logInAsync(
      {androidClientId: env.AND_KEY, androidStandaloneAppClientId: env.AND_KEY}).catch(error => {console.log(error)});
    console.log(res);
    const secure_available = await SecureStore.isAvailableAsync()
    if (res.type === 'success') {
      let data = {
        username: res.user.name,
        first_name: res.user.givenName,
        last_name: res.user.familyName,
        email: res.user.email,
        password: res.user.id,
        provider: 'google'
      };
      // console.log(data);

      let userInfo = await fetch(`http://${env.IP_ADDRESS}/account/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;'
        },
        body: JSON.stringify(data),
      })
      .then(res => res.json())
      .then(json => {
        console.log(json)  // ok -> 최초 로그인 // duplicate email -> 이후 로그인
        // Login
        fetch(`http://${env.IP_ADDRESS}/account/login/`, {  
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(json => {
          console.log('JWT : ', json.token)
          if (secure_available === true) {
            SecureStore.setItemAsync('token', json.token)
            SecureStore.setItemAsync('access_token', res.accessToken)
            navigation.navigate('Main')
          } else {
            console.log('자동로그인이 지원되지않는 안드로이드 버젼입니다.')
          }
        })
        .catch(error => {
          // Login 에러
          console.log('Login 에러')
          console.log(error);
          window.gapi && window.gapi.auth2.getAuthInstance().signOut();
        }); 
      })
      .catch(error => {
        // Signup 에러
        console.log('Signup 에러')
        console.log(error);
        window.gapi && window.gapi.auth2.getAuthInstance().signOut();
      });  
  };
};

  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
      <Text style={styles.logo}>
        {/* 여기에 타이틀 추가 */}
        {/* {checkBtn} */}
      </Text>
      <TouchableOpacity onPress={onPress} style={styles.loginBtn}>
        <Text style={styles.loginText}>Google LOGIN</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={{ position: 'absolute', bottom: 50, backgroundColor: '#66e0ff', zIndex: 100 }}
        title="NextPage(for Dev)"
        onPress={() => navigation.navigate('Main')}
      ><Text style={styles.loginText}>Next Page(dev)</Text></TouchableOpacity> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    alignItems: 'center',
    justifyContent: "center"
  },
  logo: {
    fontWeight:"bold",
    fontSize: 60,
    color:"#fb5b5a",
    marginBottom:40
  },
  loginText:{
    fontSize: 15,
    fontWeight:"bold",
    color:"white"
  },
  loginBtn:{
    width:"80%",
    backgroundColor: "#66e0ff",
    borderRadius:25,
    height: 50,
    width: 250,
    alignItems:"center",
    justifyContent: "center",
    marginTop: 180,
    marginBottom: 10,
  }
});
