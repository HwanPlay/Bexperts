import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, Alert, ScrollView } from 'react-native';
import StoreItemModal from './StoreItemModal'
import DynamicItems from './DynamicItems'
import axios from "axios";


function ClickStoreItem(props) {
  const itemInfo = props.itemInfo
  const setMyItems = props.setMyItems
  if (itemInfo) {
    return <StoreItemModal
      userToken={props.userToken}
      setIsMove={props.setIsMove}
      items={props.items}
      itemInfo={itemInfo}
      itemForSell={props.itemForSell}
      setMyItems={setMyItems}
      setItemInfo={props.setItemInfo}
      goldStatus={props.goldStatus}
      setGoldStatus={props.setGoldStatus}
      isInventory={props.isInventory}
      setIsChangeItemPlace={props.setIsChangeItemPlace}
      setChangedIndex={props.setChangedIndex}
    />
  }
  else {
    return <View />
  }
}

function ShowItem(props) {
  const setItemInfo = props.setItemInfo
  const item = props.item
  const items = props.items
  const isInventory = props.isInventory
  const setMyItems = props.setMyItems
  const index = props.index
  const userToken = props.userToken
  function changeItemPlace(changedIndex) {
    const tempItem = items[index]
    items[index] = items[changedIndex]
    items[index].location = index + 1
    tempItem.location = changedIndex + 1
    items[changedIndex] = tempItem
    setMyItems(items)
    if (!!items[changedIndex]['id']) {
      axios
        .put('http://k3b305.p.ssafy.io:8005/account/myitem/exchange/', { item_id1: items[index]['id'], item_id2: items[changedIndex]['id'] }, {
          'headers': {
            'Authorization': `Bearer ${userToken}`
          }
        })
        .then(() => {})
        .catch(err => console.log(err))      
    } else {
      axios
        .put(`http://k3b305.p.ssafy.io:8005/account/myitem/${items[index]['id']}/`, {location: items[index]['location']}, {
          'headers': {
            'Authorization': `Bearer ${userToken}`
          }
        })
        .then(()=>{})
        .catch(err => console.log(err))
    }
    props.setChangedIndex(null)
    props.setIsChangeItemPlace(false)
    props.setIsMove(false)
  }

  // 동적할당을 위한 노가다가 필요하다.
  // 없으면 안뜬다.
  if (!item) {
    return  <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Image
        style={isInventory ? styles.tinyLogo : styles.storeTinyLogo}
        resizeMode="contain"
        source={require(`../../assets/splash.png`)}
      />
      {!isInventory ? <Text style={{}}>마지막입니다.</Text> : <Text></Text>}      
    {/* 여기는 아이템 이미지가 들어갈 영역입니다. splash 대신 위에 들어갈 object에서 뽑아야합니다 */}
    {/* 아래처럼 하면 안됩니다. react는 되는데 native는 동적할당이 불가능합니다 */}
    {/* <Image style={styles.tinyLogo} source={require(`../../assets/` + item.image)} /> */}
    {/* <Image style={styles.tinyLogo} source={require(`../../assets/` + ( item.image ? item.image : 'splash.png' ))} /> */}
  </View>
  }

  const image = DynamicItems[item['name']]
  const itemPrice = item.price
  return <TouchableHighlight
    onPress={() => {
      props.isChangeItemPlace ? changeItemPlace(props.changedIndex) : image ? setItemInfo([item, index]) : Alert.alert('비어있는 인벤토리입니다.')
    }}
  >
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      {/* 여기는 아이템 이미지가 들어갈 영역입니다. splash 대신 위에 들어갈 object에서 뽑아야합니다 */}
      <Image
        style={isInventory ? styles.tinyLogo : styles.storeTinyLogo}
        resizeMode="contain"
        source={image}
      />
      {!isInventory ? <Text style={{}}> <Image style={{resizeMode: "contain"}} source={require('../../assets/icon/coin2.png')}/>{itemPrice} </Text> : <Text></Text>}      
      {/* 아래처럼 하면 안됩니다. react는 되는데 native는 동적할당이 불가능합니다 */}
      {/* <Image style={styles.tinyLogo} source={require(`../../assets/` + item.image)} /> */}
      {/* <Image style={styles.tinyLogo} source={require(`../../assets/` + ( item.image ? item.image : 'splash.png' ))} /> */}
    </View>
  </TouchableHighlight>
}

function ItemGrid(props) {
  // number1 = row number2 col
  const number1 = props.number1
  const number2 = props.number2
  const isInventory = props.isInventory
  const items = props.items
  const setItemInfo = props.setItemInfo
  const index = number1 * 4 + number2
  // store 인 경우.
  // col이 4개라고 가정
  if (!isInventory && items[number1 * 2 + number2]) {
    return <ShowItem
      userToken={props.userToken}    
      item={items[number1 * 2 + number2]}
      items={items}
      isInventory={isInventory}
      setItemInfo={setItemInfo}
      setGoldStatus={props.setGoldStatus}
      setMyItems={props.setMyItems}
      index={index}
      isChangeItemPlace={false}
    />
  }
  else {
    return <ShowItem
      userToken={props.userToken}
      item={items[number1 * 4 + number2]}
      items={items}
      isInventory={isInventory}
      setItemInfo={setItemInfo}
      setGoldStatus={props.setGoldStatus}
      setMyItems={props.setMyItems}
      setIsMove={props.setIsMove}
      index={index}
      isChangeItemPlace={props.isChangeItemPlace}
      setIsChangeItemPlace={props.setIsChangeItemPlace}
      changedIndex={props.changedIndex}
      setChangedIndex={props.setChangedIndex}
    />
  }
}

function ItemGridRow({userToken, setIsMove, number1, items, setMyItems, isInventory, setItemInfo, setGoldStatus, isChangeItemPlace, setIsChangeItemPlace, changedIndex, setChangedIndex }) {

  let column
  if (isInventory) {
    column = [0, 1, 2, 3]
  }
  else {
    column = [0, 1]

  }
  return column.map((number2) =>
    <View key={number2.toString()} style={styles.testGridCell}>
      <ItemGrid
        userToken={userToken}
        setIsMove={setIsMove}
        number1={number1}
        number2={number2}
        items={items}
        setMyItems={setMyItems}
        isInventory={isInventory}
        setItemInfo={setItemInfo}
        setGoldStatus={setGoldStatus}
        isChangeItemPlace={isChangeItemPlace}
        setIsChangeItemPlace={setIsChangeItemPlace}
        changedIndex={changedIndex}
        setChangedIndex={setChangedIndex}
      />
    </View>
  )

}

export default function MainInvenGrid({userToken, changedIndex, setChangedIndex, itemInfo, setItemInfo, isChangeItemPlace, setIsChangeItemPlace, setIsMove, items, setMyItems, isInventory, goldStatus, setGoldStatus, itemForSell }) {
  // const [itemInfo, setItemInfo] = useState(null)
  // const [isChangeItemPlace, setIsChangeItemPlace] = useState(false)
  // const [changedIndex, setChangedIndex] = useState(null)
  let column
  if (isInventory) {
    column = [0, 1, 2, 3, 4]
  }
  else {
    // console.log(items.length)
    // console.log(parseInt(items.length/4))
    let count = parseInt(items.length/2)
    if (items.length % 2 !==0) {
      count++
    }
    temp = []
    for (let i = 0; i < count; i++) {
      temp.push(i)
    }
    column = temp
  }
  return (
    <View style={styles.testGrid}>
      <ScrollView contentContainerStyle={styles.testGridContainer}>
        {/* 여기도 스토어 아이템의 경우 더 늘려야할 듯 합니다. */}
        {column.map((number1) =>
          <View key={number1.toString()} style={styles.testGridRow}>
            <ItemGridRow
              userToken={userToken}
              setIsMove={setIsMove}
              number1={number1}
              items={items}
              setMyItems={setMyItems}
              isInventory={isInventory}
              setItemInfo={setItemInfo}
              setGoldStatus={setGoldStatus}
              isChangeItemPlace={isChangeItemPlace}
              setIsChangeItemPlace={setIsChangeItemPlace}
              changedIndex={changedIndex}
              setChangedIndex={setChangedIndex}
            />
          </View>
        )}
      </ScrollView>
      <ClickStoreItem
        userToken={userToken}
        setIsMove={setIsMove}
        items={items}
        itemInfo={itemInfo}
        itemForSell={itemForSell}
        isInventory={isInventory}
        setMyItems={setMyItems}
        setItemInfo={setItemInfo}
        goldStatus={goldStatus}
        setGoldStatus={setGoldStatus}
        setIsChangeItemPlace={setIsChangeItemPlace}
        setChangedIndex={setChangedIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 65,
    height: 65,
  },
  storeTinyLogo: {
    width: 100,
    height: 65,
  },

  testGrid: {
    flex: 0.8,
    color: '#776e65',
    position: 'relative',
    backgroundColor: '#bbada0',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: 'gray'
    // width: '100%',
    // height: '50%',
  },
  testGridContainer: {
    color: '#776e65',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    paddingBottom: 12,
  },
  testGridRow: {
    color: '#776e65',
    paddingTop: 12,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly'
  },
  testGridCell: {
    // width: 56.25,
    // height: 56.25,
    // marginRight: 15,
    borderRadius: 3,
    backgroundColor: 'rgba(238, 228, 218, 0.35)',
  }

})

