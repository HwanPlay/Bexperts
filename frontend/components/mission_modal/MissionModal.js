import React, { useState } from "react";
import { Modal, StyleSheet, View, TouchableOpacity, Image, ImageBackground } from "react-native";
import { IconButton } from 'react-native-paper';

import MissionList from "./MissionList";

const bgimage = require('../../assets/modalbackground.png')
export default function MissionModal({ userToken, myMission, setMyMission, myItems, setMyItems, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ImageBackground source={bgimage} style={styles.bgimage}>
            <IconButton
              icon="close"
              style={styles.closeModal}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              size={30}
            ></IconButton>
            <MissionList navigation={navigation} userToken={ userToken } myMission={ myMission } setMyMission={ setMyMission } myItems={ myItems } setMyItems={ setMyItems }/>
            {/* <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight> */}
            </ImageBackground>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.showButton}
        onPress={() => {
          setModalVisible(true);
        }}
        size={40}
      >
        <Image style={{resizeMode: "contain",}} source={require('../../assets/icon/envelope.png')} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bgimage: {
    height: "100%"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 0,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: "83%",
    width: "90%"
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  showButton: {
    position: "absolute",
    top: 15,
    right: 105,
    zIndex: 1,
  },
  closeModal: {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 100,
  }
});