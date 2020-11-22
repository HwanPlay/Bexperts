import React, { useState } from 'react'
import { StyleSheet, View, Image, Dimensions, TouchableWithoutFeedback, Alert, Platform } from 'react-native';
import DynamicItems from "./mainbottom/DynamicItems"
import axios from 'axios'

const deviceWidth = Dimensions.get('window').width
const xyCount = 6
const height = (deviceWidth - 20) / xyCount
const width = (deviceWidth - 20) / xyCount
const yStartPoint = 100

function MyForest(props) {
  const deviceWidth = Dimensions.get('window').width
  const width = (deviceWidth - 20) / xyCount
  const jwt = props.jwt
  function handleDataChange(e) {
    props.onDataChange(e)
  }
  function handleIsMoveChange(isMove, idx) {
    props.onIsMoveChange(isMove, idx)
  }
  const data = props.data
  return (
    data.map((xyInfo, idx) => {
      const url = DynamicItems[xyInfo.name]
      let height
      if (Platform.OS === 'web') {
        height = 40
      } else {
        const image = Image.resolveAssetSource(url)
        height = image.height * width / image.width
      }
      // 개발환경을 위한 분기 web인 경우 임시의 숫자 넣어놓음
      // 웹에서는 resolveAssetSource 오류
      // const image = Image.resolveAssetSource(url)
      // const height = image.height*width/image.width
      return (
        <TouchableWithoutFeedback key={`${xyInfo.x}${xyInfo.y}`}
          onPressIn={() => {
            Alert.alert(
              "어떤 작업을 하시겠습니까?",
              "",
              [
                { text: "취소" },
                {
                  text: "이동",
                  onPress: () => {
                    handleIsMoveChange(props.isMove, idx)
                  }
                },
                {
                  text: "내리기",
                  onPress: () => {
                    const newData = [...data]
                    const id = newData[idx]['id']
                    const name = newData[idx]['name']
                    const price = newData[idx]['price']
                    newData.splice(idx, 1)
                    let location
                    for (let i = 0; i < 20; i++) {
                      if (props.myItems[i]['name'] === '') {
                        location = props.myItems[i]['location']
                        break
                      }
                    }
                    if (location) {
                      props.myItems[location-1] = {
                        id : id,
                        location: location,
                        name: name,
                        price: price  //이거 데이터 가져와야함
                      }

                      axios
                        .put(`http://k3b305.p.ssafy.io:8005/account/myitem/${id}/`, { isinfarm: false, location: location }, {
                          'headers': {
                            'Authorization': `Bearer ${props.userToken}`
                          }
                        })
                        .then(() => { handleDataChange(newData) })
                        .catch(err => console.log(err))                      
                    } else {
                      Alert.alert('인벤토리가 가득 찼습니다.')
                    }
                  }
                },
              ],
              { cancelable: true }
            )
          }
          }
        >
          <Image
            style={{
              position: 'absolute',
              alignContent: 'center',
              resizeMode: 'contain',
              height: height,
              width: width,
              top: yStartPoint - height + width * 2 / 3 - 0.04 * width + xyInfo.x * width / 3 + xyInfo.y * width / 3 - (xyInfo.x + xyInfo.y) * width * 0.08,
              left: deviceWidth * 0.5 - width * 0.5 + xyInfo.x * width * 0.5 - xyInfo.y * width * 0.5,
              zIndex: xyInfo.x + xyInfo.y + 200
            }}
            source={url}
          />
        </TouchableWithoutFeedback>
      )
    })
  )
}

const Tile = (props) => {
  const [changeOpacity, setChangeOpacity] = useState(1);
  const onPressIn = () => { setChangeOpacity(0) }
  const onPressOut = () => { setChangeOpacity(1) }
  let url
  if (props.isSomething) {
    url = props.shape.road
  } else {
    url = props.shape.grass
  }
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        if (props.isMove) {
          if (!props.isSomething) {
            if (props.isChangeItemPlace) { // 올리는거면
              onPressIn()
              const id = props.myItems[props.changedIndex]['id']
              const name = props.myItems[props.changedIndex]['name']
              const newData = [...props.data]
              const tempLocation = props.myItems[props.changedIndex]['location']
              
              props.myItems[props.changedIndex] ={
                name: '',
                location: tempLocation
              }
              newData.push({
                name: name,
                x: props.x,
                y: props.y,
                id: id,
                price: props.myItems[props.changedIndex].price
              })
              const location = props.x + props.y * 6 + 1

              axios
                .put(`http://k3b305.p.ssafy.io:8005/account/myitem/${id}/`, { location: location, isinfarm: true }, {
                  'headers': {
                    'Authorization': `Bearer ${props.userToken}`
                  }
                })
                .then(() => {})
                .catch(err => console.log(err))

                props.setIsChangeItemPlace(false)
                props.onIsMoveChange(true, null)
                props.setChangedIndex(null)
                props.onDataChange(newData)
            } else {
              onPressIn()
              const newData = [...props.data]
              const name = newData[props.targetIdx]['name']
              const id = newData[props.targetIdx]['id']
              const price = newData[props.targetIdx]['price']
              newData[props.targetIdx] = {
                x: props.x,
                y: props.y,
                name: name,
                id: id,
                price: price
              }
              const location = props.x + props.y * 6 + 1
              axios
                .put(`http://k3b305.p.ssafy.io:8005/account/myitem/${id}/`, { location: location }, {
                  'headers': {
                    'Authorization': `Bearer ${props.userToken}`
                  }
                })
                .then(() => { })
                .catch(err => console.log(err))

              props.onIsMoveChange(true, null)
              props.onDataChange(newData)
            }
          }
        } else {
          onPressIn()
        }
      }}
      onPressOut={() => { onPressOut() }}
    >
      <Image
        style={{ resizeMode: 'contain', height: height, width: width, left: props.xMove, top: props.yMove, zIndex: props.z, opacity: changeOpacity }}
        source={url}
      />
    </TouchableWithoutFeedback>
  );
}

const Landscape = (props) => {
  const tiles = props.tiles
  let yPoint = yStartPoint
  let xPoint = 0
  const imageUrl = {
    road: require('../assets/tileImage/road.png'),
    grass: require('../assets/tileImage/grass.png')
  }
  return (
    <View>
      {tiles.map((row, y) => {
        let xMove = -width * 0.5 + xPoint
        let yMove = width * 0.5 / 4 * 6 + yPoint
        xPoint -= width * 0.5
        yPoint -= (xyCount - 1) * height + height * 2 / 3 + height * 0.08
        return row.map((tile, x) => {
          const z = x + 100;
          xMove += width * 0.5
          yMove -= height * 0.5 / 4 * 6
          // x, y로 좌표값 가능 (0,0) ~ (5, 5)
          // 오른쪽 아래로 대각선이 x 축 0에서 시작
          // 왼쪽 아래로 대각선이 y 축 0에서 시작
          if (props.isMove && tiles[x][y] !== null) {
            return <Tile key={`${x}${y}`} userToken={props.userToken} changedIndex={props.changedIndex} setChangedIndex={props.setChangedIndex} myItems={props.myItems} itemInfo={props.itemInfo} isChangeItemPlace={props.isChangeItemPlace} setIsChangeItemPlace={props.setIsChangeItemPlace} isMove={props.isMove} x={x} y={y} xMove={xMove} yMove={yMove} z={z} shape={imageUrl} isSomething={true} />
          }
          return <Tile key={`${x}${y}`} userToken={props.userToken} changedIndex={props.changedIndex} setChangedIndex={props.setChangedIndex} myItems={props.myItems} itemInfo={props.itemInfo} isChangeItemPlace={props.isChangeItemPlace} setIsChangeItemPlace={props.setIsChangeItemPlace} isMove={props.isMove} x={x} y={y} xMove={xMove} yMove={yMove} z={z} shape={imageUrl} isSomething={false} data={props.data} targetIdx={props.targetIdx} onIsMoveChange={props.onIsMoveChange} onDataChange={props.onDataChange} />
        });
      })}
    </View>
  )
}

export default function Board(props) {
  const [targetIdx, setTargetIdx] = useState(null)  // 삭제 or 수정할 때 필요한 인덱스
  const data = props.data
  const changeDate = props.changeDate
  const tiles = props.tiles
  const isMove = props.isMove
  const setIsMove = props.setIsMove
  function changeIsMove(isMove, idx) {
    setIsMove(!isMove)
    setTargetIdx(idx)
  }
  if (isMove) {
    return (
      <View style={styles.container}>
        <Landscape changedIndex={props.changedIndex} userToken={props.userToken} setChangedIndex={props.setChangedIndex} myItems={props.myItems} itemInfo={props.itemInfo} isChangeItemPlace={props.isChangeItemPlace} setIsChangeItemPlace={props.setIsChangeItemPlace} isMove={isMove} jwt={props.jwt} tiles={tiles} data={data} targetIdx={targetIdx} onIsMoveChange={changeIsMove} onDataChange={changeDate} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MyForest userToken={props.userToken} onDataChange={changeDate} data={data} jwt={props.jwt} myItems={props.myItems} onIsMoveChange={changeIsMove} />
      <Landscape changedIndex={props.changedIndex} userToken={props.userToken} setChangedIndex={props.setChangedIndex} myItems={props.myItems} itemInfo={props.itemInfo} isChangeItemPlace={props.isChangeItemPlace} setIsChangeItemPlace={props.setIsChangeItemPlace} isMove={isMove} tiles={tiles} jwt={props.jwt} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
