import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useLayoutEffect } from "react";
import { Logo } from "../assets";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "@firebase/firestore";
import { SET_USER } from "../context/actions/userAction";
import { useDispatch } from "react-redux";

const SplashScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);

  const dispatch = useDispatch();

  const checkLoggedUser = async () => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(firestoreDB, "users", userCred.uid))
          .then((docSnap) => {
            console.log("User data:", docSnap.data());
            dispatch(SET_USER(docSnap.data()));
          })
          .then(() => {
            setTimeout(() => {
              navigation.replace("HomeScreen");
            }, 2000);
          });
      } else {
        navigation.replace("LgoinScreen"); // Corrected the navigation name
      }
    });
  };

  return (
    <View className="flex-1 items-center justify-center space-y-24">
      <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
      <ActivityIndicator size="large" color="#688F4E" />
    </View>
  );
};

export default SplashScreen;
