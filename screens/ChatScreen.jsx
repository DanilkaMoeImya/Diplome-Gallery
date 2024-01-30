import React, { useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const textInputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.user.user);

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };

    try {
      // Add the message to the Firestore collection
      await addDoc(
        collection(doc(firestoreDB, "chats", room._id), "messages"),
        _doc
      );
      // Clear the input field after sending the message
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    }
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const updatedMessages = querySnap.docs.map((doc) => doc.data());
      setMessages(updatedMessages);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [room?._id]);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#688F4E",
          padding: 16,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          >
            <MaterialIcons name="chevron-left" size={40} color="#fbfbfb" />
          </TouchableOpacity>
          {/* Chat room info */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View style={{ marginTop: 11 }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
              </Text>
              <Text
                style={{ color: "#fbfbfb", fontSize: 12, fontWeight: "bold" }}
              ></Text>
            </View>
          </View>
          {/* Empty space for future additions */}
          <View />
        </View>
      </View>

      {/* Chat messages */}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#688F4E" />
        ) : (
          messages.map((msg, i) => (
            <View key={i}>
              {/* Display sender's name for received messages */}
              {msg.user.providerData.email !== user.providerData.email && (
                <Text
                  style={{ fontWeight: "bold", marginLeft: 8, color: "#555" }}
                >
                  {msg.user.fullName}
                </Text>
              )}
              {/* Display user's own messages on the right */}
              {msg.user.providerData.email === user.providerData.email ? (
                <View style={{ alignSelf: "flex-end", marginVertical: 8 }}>
                  <View
                    style={{
                      backgroundColor: "#688F4E",
                      padding: 10,
                      borderRadius: 20,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {msg.message}
                    </Text>
                  </View>
                  {msg?.timeStamp?.seconds && (
                    <Text style={{ alignSelf: "flex-end", marginTop: 4 }}>
                      {new Date(
                        parseInt(msg?.timeStamp?.seconds) * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false,
                        timeZone: "Asia/Yekaterinburg",
                      })}
                    </Text>
                  )}
                </View>
              ) : (
                /* Display received messages on the left */
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 8,
                  }}
                >
                  <Image
                    source={{ uri: msg?.user?.profilePic }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      marginRight: 8,
                    }}
                  />
                  <View>
                    <View
                      style={{
                        backgroundColor: "#e6e6e6",
                        padding: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: "black", fontWeight: "bold" }}>
                        {msg.message}
                      </Text>
                    </View>
                    {msg?.timeStamp?.seconds && (
                      <Text style={{ marginTop: 4 }}>
                        {new Date(
                          parseInt(msg?.timeStamp?.seconds) * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: false,
                          timeZone: "Asia/Yekaterinburg",
                        })}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Input field and send button */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <View
          style={{
            backgroundColor: "#ddd",
            borderRadius: 20,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 8,
            paddingHorizontal: 12,
          }}
        >
          <TextInput
            style={{ flex: 1, height: 40 }}
            placeholder="..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
        </View>
        <TouchableOpacity onPress={sendMessage}>
          <FontAwesome name="send" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
