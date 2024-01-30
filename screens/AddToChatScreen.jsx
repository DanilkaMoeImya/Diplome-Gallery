import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const AddToChatScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [addChat, setAddChat] = useState("");
  const createNewChat = async () => {
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      user: user,
      chatName: addChat,
    };
    if (addChat !== "") {
      setDoc(doc(firestoreDB, "chats", id), _doc)
        .then(() => {
          setAddChat("");
          navigation.replace("Message");
        })
        .catch((err) => {
          alert("Error:", err);
        });
    }
  };
  return (
    <View className="flex-1">
      <View
        className="w-full px-4 py-6 flex-[0.2]"
        style={{ backgroundColor: "#688F4E" }}
      >
        <View className="flex-row items-center justify-between w-full px-4 py-6">
          {/*go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={40} color={"#fbfbfb"} />
          </TouchableOpacity>
          {/*middle*/}
          {/*last*/}
          <View>
            <Image
              source={{ uri: user?.profilePic }}
              className="w-12 h-12"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
      {/*bottom  */}
      <View className="w-full px-4 py-6 bg-white rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <View className="w-full px-4 py-y">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/*icons */}
            <Ionicons name="chatbubbles" size={24} color={"#777"} />
            {/*textinput */}
            <TextInput
              className="flex-1 text-lg -mt-2 h-12 w-full"
              style={{ color: "gray" }}
              placeholder="Создать чат"
              placeholderTextColor={"#999"}
              value={addChat}
              onChangeText={(text) => setAddChat(text)}
            />
            {/*icon */}
            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="send" size={24} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChatScreen;
