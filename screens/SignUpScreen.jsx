import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { PlantsFon, Logo } from "../assets";
import { UserInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../utils/supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StatusBar } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatarMenu(false);
  };
  const handleSignUp = async () => {
    if (getEmailValidationStatus && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            profilePic: avatar,
            providerData: userCred.user.providerData[0],
          };

          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => {
              navigation.navigate("LgoinScreen");
            }
          );
        }
      );
    }
  };

  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={PlantsFon}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />
      {isAvatarMenu && (
        <>
          <View
            className="absolute inset-0 z-10"
            style={{ width: screenWidth, height: screenHeight }}
          >
            <ScrollView style={{ flex: 1 }}>
              <BlurView
                className="flex-row flex-wrap items-center justify-evenly"
                tint="light"
                intensity={40}
                style={{ width: screenWidth, height: screenHeight }}
              >
                {avatars?.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={item._id}
                    className="w-20 m-3 h-20 p-1 rounded-full border-2 relative"
                  >
                    <Image
                      source={{ uri: item?.image.asset.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}

      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 spay-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />
        <Text className="py-2  text-xl font-semibold">
          Присоединяйтесь к нам!
        </Text>
        {/*avatar */}
        <View className="w-full py-3 flex items-center justify-center relative -my-4">
          <TouchableOpacity
            onPress={() => setIsAvatarMenu(true)}
            className="w-16 h-16 rounded-full border-2 relative"
          >
            <Image
              source={{ uri: avatar }}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                borderRadius: 50,
              }}
            />
            <View className="w-5 h-5 rounded-full absolute top-0 right-0 flex items-center justify-center">
              <MaterialIcons name="edit" size={20} color={"black"} />
            </View>
          </TouchableOpacity>
        </View>
        <View className="w-full py-2 flex items-center justify-center">
          {/*Full name */}

          <UserInput
            placeholder="Full Name"
            isPass={false}
            setStatValue={setName}
          />
          {/*email */}
          <UserInput
            placeholder="Email"
            isPass={false}
            setStatValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />
          {/*password */}
          <UserInput
            placeholder="Password"
            isPass={true}
            setStatValue={setPassword}
          />
          {/*login button */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={styles["bg-green"]}
            className="w-full px-4  rounded-xl my-3 flex items-center justify-center"
          >
            <Text
              className="py-2 text-black text-xl font-semibold"
              style={{ color: "white" }}
            >
              Создать аккаунт
            </Text>
          </TouchableOpacity>
          <View className="w-full  flex-row items-center justify-center ">
            <Text className="text-base text-color-gray">Есть аккаунт?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LgoinScreen")}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: "#688F4E" }}
              >
                Войти!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  "bg-green": {
    backgroundColor: "#688F4E",
  },
});
export default SignUpScreen;
