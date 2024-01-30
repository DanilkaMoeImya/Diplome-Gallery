import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const renderItem = ({ item }) => {
    const onPress = () => {
      if (item.title === "Домой") {
        navigation.navigate("HomeScreen");
      }
      if (item.title === "Достижения") {
        navigation.navigate("Achievement");
      }
      if (item.title === "Выйти") {
        navigation.navigate("LgoinScreen");
      }
    };
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Ionicons name={item.icon} size={50} color="black" />
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  // Данные для FlatList
  const data = [
    { title: "Домой", icon: "home-outline" },
    { title: "Достижения", icon: "newspaper-outline" },
    { title: "Выйти", icon: "log-out-outline" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <View style={styles.avatarContainer}>
        {user?.profilePic && (
          <Image source={{ uri: user.profilePic }} style={styles.avatar} />
        )}
      </View>
      <View style={styles.name}>
        <Text>Имя: {user.fullName}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatlist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#688F4E",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 90,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 200,
  },
  flatlist: {
    marginTop: 300, // Регулируйте отступ в зависимости от ваших нужд
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    marginLeft: 10,
  },
});

export default Profile;
