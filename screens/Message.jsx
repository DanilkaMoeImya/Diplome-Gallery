import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Logo } from "../assets";
import { Mess } from "../assets";
import { Gallery } from "../assets";
import { Catalog } from "../assets";
import { Map } from "../assets";
import { useNavigation } from "@react-navigation/native";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getDoc, doc, deleteDoc } from "@firebase/firestore";
const Message = () => {
  const user = useSelector((state) => state.user.user);
  console.log("Logged user:", user);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [chats, setChats] = useState(null);
  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );
    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);
  return (
    <View className="flex-1">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 pt-20">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={40} color={"#688F4E"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            className="w-12 h-12 rounded-full border border-green-200 flex items-center justify-center"
          >
            <Image
              source={{ uri: user?.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        {/*scrolling area*/}
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/*messages title */}
            <View className="w-full flex-row items-center justify-between px-2">
              <Text
                className="text-base font-extrabold pb-2"
                style={{ color: "gray" }}
              >
                Чаты
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddToChatScreen")}
              >
                <Ionicons name="chatbox" size={28} color={"#555"} />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#688F4E"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
const MessageCard = ({ room }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation();

  const handleDeletePress = async () => {
    try {
      setIsDeleting(true);

      const result = await Alert.alert(
        "Предупреждение",
        `Вы уверены, что хотите удалить чат "${room.chatName}"?`,
        [
          {
            text: "Назад",
            onPress: () => setIsDeleting(false),
            style: "cancel",
          },
          {
            text: "Удалить",
            onPress: async () => {
              // Perform deletion
              await deleteChat(room._id);
              setIsDeleting(false);
            },
          },
        ],
        { cancelable: false }
      );

      if (result) {
        // Handle the result if needed
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      setIsDeleting(false);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const chatRef = doc(collection(firestoreDB, "chats"), chatId);
      await deleteDoc(chatRef);
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
      }}
    >
      {/* Images */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          borderWidth: 2,
          borderColor: "#688F4E",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>

      {/* Content */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
          borderBlockColor: "#688F4E",
        }}
      >
        <Text
          style={{
            color: "#333",
            fontSize: 16,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {room.chatName}
        </Text>
      </View>

      {/* Delete Icon */}
      <TouchableOpacity onPress={handleDeletePress}>
        <FontAwesome5 name="trash" size={24} color="#FF0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Message;
