import React, { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { IconButton } from 'react-native-paper';
// import * as MediaLibrary from 'expo-media-library';


export default function CameraOn({ setIsCameraOn, setPhotoInfo }) {
  const camera = useRef();

  function clickCameraOn() {
    setIsCameraOn( prevStatus => !prevStatus )
  };
  const [hasPermission, setHasPermission] = useState(null);
  // const [hasPermission2, setHasPermission2] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const snap = async () => {
    if (camera) {
      const { uri } = await camera.current.takePictureAsync()
      // const asset = await MediaLibrary.createAssetAsync(uri);
      // console.log('abcd', uri)
      // console.log(asset)
      // 로컬 핸드폰에 저장로직만들어둠(혹시나해서)
      setPhotoInfo({uri: uri})
      clickCameraOn()
      // MediaLibrary.createAlbumAsync('Expo', asset)
      // .then(() => {
      //   Alert.alert('Album created!')
      // })
      // .catch(error => {
      //   Alert.alert('An Error Occurred!')
      // });
    }
  };




  useEffect(() => {
    (async () => {
      let { status } = await Permissions.askAsync(Permissions.CAMERA);
      // let { status2 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === 'granted');
      // setHasPermission2(status2 === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ height: "100%", paddingTop: 10 }}>
      <Camera style={{ flex: 1 }} type={type}
        ref={camera}      
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <IconButton
            icon='arrow-left-bold-box-outline'
            size={50}
            style={{
              flex: 0.33333,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => clickCameraOn()}
          ></IconButton>
          <IconButton
            icon='camera-retake-outline'
            size={50}
            style={{
              flex: 0.33333,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          ></IconButton>
          <IconButton
            icon='camera-outline'
            size={50}
            style={{
              flex: 0.33333,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => snap()}
          ></IconButton>
        </View>
      </Camera>
    </View>
  );
}
