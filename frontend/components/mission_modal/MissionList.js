import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { List, Button } from 'react-native-paper';

import CameraOn from '../cameramodal/CameraOn';
import ImageModal from '../cameramodal/CameraModal';
import DynamicItems from "../mainbottom/DynamicItems"


function CheckCamera(props) {
  const isCameraOn = props.isCameraOn
  if ( isCameraOn ) {
    return <CameraOn setIsCameraOn={ props.setIsCameraOn } setPhotoInfo={ props.setPhotoInfo } />
  }
  else {
    return <View />
  }
}

function CheckImage(props) {
  const photoInfo = props.photoInfo
  if ( photoInfo ) {
    return <ImageModal navigation={props.navigation} photoInfo={ photoInfo } setPhotoInfo={ props.setPhotoInfo } userToken={ props.userToken } missionInfo={ props.missionInfo } location={ props.location } myItems={props.myItems} setMyItems={props.setMyItems} myMission={props.myMission} setMyMission={props.setMyMission} />
  }
  else {
    return <View/>
  }
}

function Camera({ setIsCameraOn, setMissionInfo, missionInfo, location }) {
  const clickCameraOn = () => setIsCameraOn(prevStatus => !prevStatus);

  return (
    <Button
      icon="camera"
      mode="outlined"
      style={styles.cameraIcon}
      onPress={() => {
        if (!!location) {
          clickCameraOn();
          setMissionInfo(missionInfo)
        } else {
          Alert.alert('인벤토리가 가득 찼습니다. 보상을 받으려면 인벤토리를 비워주세요.')
        }
      }}
    >
      미션 수행
    </Button>
  );
}

export default function MissionList({ userToken, myMission, setMyMission,  myItems, setMyItems, navigation }) {

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photoInfo, setPhotoInfo] = useState(null);
  const [missionInfo, setMissionInfo] = useState(null);

  let location = 0
  for (let i = 0; i < 20; i++) {
    if (myItems[i]['name'] === "") {
      location = myItems[i]['location']
      break
    }
  }

  if (isCameraOn) {
    return(
      <CheckCamera isCameraOn={ isCameraOn } setIsCameraOn={ setIsCameraOn } setPhotoInfo={ setPhotoInfo } />
    );
  } else if (photoInfo) {
    return(
      <CheckImage navigation={navigation} photoInfo={ photoInfo } setPhotoInfo={ setPhotoInfo } userToken={ userToken } missionInfo={ missionInfo } location={ location } myItems={myItems} setMyItems={setMyItems} myMission={myMission} setMyMission={setMyMission} />
    )
  } else {
    return (
      <List.Section
        style={ styles.container }
      >
        <Text style={{margin: 9, marginLeft: 20, fontSize: 20, fontWeight:'bold'}}>오늘의 미션</Text>
        <ScrollView>
          {myMission.map( missionInfo => {
            if (!missionInfo.iscleared) {
              return (
                <List.Accordion
                  key={missionInfo.id}
                  title={missionInfo.mission.description}
                >
                  <Text style={ styles.rewardText } >보상</Text>
                  <Image style={ styles.rewardImg } source={ DynamicItems[missionInfo.item.name] } />
                  <Camera setIsCameraOn={ setIsCameraOn } setMissionInfo={ setMissionInfo } missionInfo={ missionInfo } location={ location }/>
                </List.Accordion>
              )
            } else {
              return (
                <List.Accordion
                  key={missionInfo.id}
                  title={missionInfo.mission.description}
                >
                  <Text style={ styles.rewardText } >보상</Text>
                  <Image style={ styles.rewardImg } source={ DynamicItems[missionInfo.item.name] } />
                  <Image style={ styles.clearImg } source={require('../../assets/clear.png')} />
                </List.Accordion>
              )
            }
          })}
        </ScrollView>
      </List.Section>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    margin: 20,
    paddingBottom: 50,
  },
  rewardImg: {
    width: 200,
    height: 200,
    left: "50%",
    marginLeft: -100,
    marginBottom: 15,
  },
  clearImg: {
    position: "absolute",
    width: 250,
    height: 250,
    left: "50%",
    marginLeft: -135,
    marginTop: 40
  },
  rewardText: {
    marginLeft: 30,
  },
  cameraIcon: {
    marginBottom: 15,
    marginLeft: 50,
    marginRight: 50,
  }
});