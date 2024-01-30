import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { PlantsFon, Logo } from "../assets";
import { UserInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { getDoc, doc } from "@firebase/firestore";
import { SET_USER } from "../context/actions/userAction";
import { useDispatch } from "react-redux";

const LgoinScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const dispatch = useDispatch();
  const handleLogin = async () => {
    if (getEmailValidationStatus && email !== "") {
      try {
        const userCred = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        if (userCred) {
          console.log("User Id:", userCred?.user.uid);
          const userDocRef = doc(firestoreDB, "users", userCred?.user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            console.log("User Data:", docSnap.data());
            dispatch(SET_USER(docSnap.data()));
          }
        }
      } catch (err) {
        console.log("Error:", err.message);
        if (err.message.includes("wrong-password")) {
          setAlert(true);
          setAlertMessage("Неверный пароль");
        } else if (err.message.includes("user-not-found")) {
          setAlert(true);
          setAlertMessage("Пользователь не найден");
        } else {
          setAlert(true);
          setAlertMessage("Неверная почта");
        }

        setTimeout(() => {
          setAlert(false);
        }, 2000);
      }
    }
  };

  // ...

  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={PlantsFon}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />
      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 spay-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />
        <Text className="py-4  text-xl font-semibold">Добро пожаловать!</Text>
        <View className="w-full flex items-center justify-center">
          {/*alert */}
          {alert && (
            <Text className="text-base text-red-600">{alertMessage}</Text>
          )}

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
            onPress={handleLogin}
            style={styles["bg-primary"]}
            className="w-full px-4 py-1 rounded-xl my-6 flex items-center justify-center"
          >
            <Text
              className="py-2 text-black text-xl font-semibold"
              style={{ color: "white" }}
            >
              Войти
            </Text>
          </TouchableOpacity>
          <View className="w-full py-2 flex-row items-center justify-center space-x-2">
            <Text className="text-base text-color-gray">Нет аккаунта?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: "#688F4E" }}
              >
                Создать аккаунт!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  "bg-primary": {
    backgroundColor: "#688F4E",
  },
});

export default LgoinScreen;
