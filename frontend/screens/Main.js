import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as Google from 'expo-google-app-auth';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

import * as env from '../env';
import Board from '../components/MainPageBoard'
import MainPageInventory from '../components/mainbottom/MainPageInventory'
import MissionModal from '../components/mission_modal/MissionModal';
import MyGold from '../components/MyGold';
import InventoryItems from '../components/mainbottom/InventoryItems'
import { set } from 'react-native-reanimated';

const bgimage = require('../assets/background.png')
const soundObject = new Audio.Sound();
let isSoundOn = false

export default function Main({ navigation }) {
  const xyCount = 6
  const [goldStatus, setGoldStatus] = useState(0)
  const [myItems, setMyItems] = useState(InventoryItems)
  // Axios Header에 들어갈 jwt -> userToken
  const [userToken, setUserToken] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [myMission, setMyMission] = useState('')

  async function getToken () {
      const jwt = await SecureStore.getItemAsync('token')
      setUserToken(jwt)
      console.log('userToken', jwt);
      const acst = await SecureStore.getItemAsync('access_token')
      setAccessToken(acst)
      console.log('accessToken',acst);

      // getMyMission List 로직
      await axios.get(`http://${env.IP_ADDRESS}/account/mymission/`, {
        headers: {
          Authorization: "Bearer " + jwt
        }
      })
      .then(res => {
        // console.log("성공!", res.data)
        setMyMission(res.data)
      })
      .catch(err => console.error(err))
      
      axios
      .get('http://k3b305.p.ssafy.io:8005/account/myitem/',
        {
          'headers': {
            'Authorization': `Bearer ${jwt}`
          }
        })
      .then(res => {
        const tempData = []
        res.data.forEach(element => {
          if (element.isinfarm) {
            let xys = element.location - 1
            let x = xys % 6
            let y = parseInt(xys / 6)
            tempData.push({
              id: element.id,
              x: x,
              y: y,
              name: element.item.name,
              price: element.item.sell_price
            })
          } else {
            myItems[element.location - 1] = {
              id: element.id,
              name: element.item.name,
              location: element.location,
              price: element.item.sell_price,
            }
          }
        })
        setMyItems(myItems)
        changeDate(tempData)
      })
      .catch(err => console.log(err))
    axios
      .get('http://k3b305.p.ssafy.io:8005/account/gold/',
        {
          'headers': {
            'Authorization': `Bearer ${jwt}`
          }
        })
      .then(res => setGoldStatus(res.data.gold))
      .catch(err => console.log(err))
    }
  // BGM 파트
  async function playSound() {
    await soundObject.loadAsync(require('../assets/bgm/bgm.mp3'));
    await soundObject.playAsync();
    await soundObject.setStatusAsync({ isLooping: true })
    isSoundOn = true
  }
  async function stopSound() {
    await soundObject.stopAsync(); // 음악 stop
    await soundObject.unloadAsync(); // 음악 unload(메모리에서)
    isSoundOn = false
  }

  const [isChangeItemPlace, setIsChangeItemPlace] = useState(false)
  const [itemInfo, setItemInfo] = useState(null)
  const [changedIndex, setChangedIndex] = useState(null)
  const [isMove, setIsMove] = useState(false)
  const [data, setData] = useState([])
  function changeDate(newData) {
    setData(newData)
    const newArray = [];
    for (let i = xyCount; i > 0; i--) {
      newArray.push(Array(xyCount).fill(null));
    }
    newData.forEach(element => {
      newArray[element.x][element.y] = element.name
    });
    setTiles(newArray)
  }
  const newArray = [];
  for (let i = xyCount; i > 0; i--) {
    newArray.push(Array(xyCount).fill(null));
  }
  data.forEach(element => {
    newArray[element.x][element.y] = element.name
  });
  const [tiles, setTiles] = useState(newArray)
  useEffect(() => {
    // 비로그인시 접속 가능(개발용, 배포시에 막아놓을 것)
    getToken()
    // console.log(jwt)
  }, [])
  // getToken()
  return (
    <View style={styles.container}>
      <ImageBackground source={bgimage} style={styles.bgimage}>
      {/* 로그인 페이지로 이동 버튼(임시) */}
      {/* <TouchableOpacity
        style={styles.devbutton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>LoginPage(for Dev)</Text>
      </TouchableOpacity> */}
      {/* 토큰 저장소 확인버튼(임시) */}
      {/* <TouchableOpacity
        style={{ position: 'absolute', top: 130, zIndex: 100 }}
        onPress={async () => {
          const jwt = await SecureStore.getItemAsync('token')
          console.log(jwt, '이게 스토어의 토큰');
          const acst = await SecureStore.getItemAsync('access_token')
          console.log(acst, '이게 스토어의 액세스 토큰');
          console.log(userToken, '이건 유저토큰')
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>저장값꺼내기</Text>
      </TouchableOpacity> */}
      {/* 로그아웃 버튼 */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await Google.logOutAsync({ accessToken, androidClientId: env.AND_KEY, androidStandaloneAppClientId: env.AND_KEY });
          await SecureStore.deleteItemAsync('token')
          await SecureStore.deleteItemAsync('access_token')
          navigation.navigate('Login')
        }}
        size={40}
      >
          <Image style={{resizeMode: "contain"}} source={require('../assets/icon/door.png')} />
      </TouchableOpacity>
      {/* 음악 ON OFF 버튼 */}
      <TouchableOpacity
        style={styles.musicButton}
        onPress={() => {
          isSoundOn ? stopSound() : playSound()
        }}
        size={40}
      >
        <Image style={{resizeMode: "contain"}} source={require('../assets/icon/music.png')} />        
      </TouchableOpacity>   
      <View style={styles.containerTop}>
        <View style={styles.infoContainer}>
          <MissionModal navigation={navigation} userToken={ userToken } myMission={ myMission } setMyMission={ setMyMission } myItems={ myItems } setMyItems={ setMyItems } />
        </View>
        <MyGold goldStatus={goldStatus} />
        <Board changedIndex={changedIndex} setChangedIndex={setChangedIndex} myItems={myItems} itemInfo={itemInfo} isMove={isMove} setIsMove={setIsMove} data={data} changeDate={changeDate} tiles={tiles} userToken={userToken} isChangeItemPlace={isChangeItemPlace} setIsChangeItemPlace={setIsChangeItemPlace} />
      </View>
      <MainPageInventory changedIndex={changedIndex} setChangedIndex={setChangedIndex} itemInfo={itemInfo} setItemInfo={setItemInfo} userToken={userToken} isChangeItemPlace={isChangeItemPlace} setIsChangeItemPlace={setIsChangeItemPlace} setIsMove={setIsMove} myItems={myItems} setMyItems={setMyItems} goldStatus={goldStatus} setGoldStatus={setGoldStatus} />
      </ImageBackground>
    </View>
  );
}

// <View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'column',
    height: '100%',
  },
  bgimage: {
    position: 'absolute',
    height: '100%',
    resizeMode: "cover",
  },
  devbutton: {
    position: 'absolute',
    top: 130,
    left: '70%',
    zIndex: 100,
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    top: 40,
    zIndex: 100
  },
  musicButton: {
    position: 'absolute',
    right: 55,
    top: 40,
    zIndex: 100
  },
  containerTop: {
    // flex: 1,
    // justifyContent: 'flex-start',
    height: "50%"
  },
  infoContainer: {
    position: "relative",
    // height: "10%",
    marginBottom: 20
  }
});
