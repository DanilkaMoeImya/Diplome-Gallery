import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { Logo } from "../assets";
import { Mess } from "../assets";
import { Gallery } from "../assets";
import { Catalog } from "../assets";
import { Map } from "../assets";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  console.log("Logged user:", user);
  const navigation = useNavigation();
  return (
    <View className="flex-1">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-20">
          <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
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
        <View className="flex-row ">
          <View className="flex-1 items-center justify-center w-full h-full">
            <TouchableOpacity
              onPress={() => navigation.navigate("Message")}
              className="mb-6"
            >
              <Image source={Mess} className="w-24 h-24" resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Gallery")}>
              <Image
                source={Gallery}
                className="w-24 h-24"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-center justify-center w-full h-full">
            <TouchableOpacity
              onPress={() => navigation.navigate("Map")}
              className="mb-6"
            >
              <Image source={Map} className="w-24 h-24" resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Catalog")}>
              <Image
                source={Catalog}
                className="w-24 h-24"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
