import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChJk3FSqABrpP2ZmWt3xSDDyAHhe-Lvgo",
  authDomain: "escobiochat.firebaseapp.com",
  projectId: "escobiochat",
  storageBucket: "escobiochat.appspot.com",
  messagingSenderId: "992840918778",
  appId: "1:992840918778:web:cf14b1a4f992b71f868b43",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

const generateUniqueID = () => Date.now().toString();

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({
    latitude: 61.24398,
    longitude: 73.42661,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const navigation = useNavigation();
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadMarkersFromFirestore();
  }, []);

  const saveMarkerToFirestore = async (marker) => {
    try {
      const markersCollection = collection(firestoreDB, "markers");

      if (marker.id) {
        const markerDocRef = doc(markersCollection, marker.id.toString());
        const markerDoc = await getDoc(markerDocRef);

        if (markerDoc.exists()) {
          await updateDoc(markerDocRef, { ...marker });
        } else {
          const newMarkerRef = await addDoc(markersCollection, { ...marker });
          marker.id = newMarkerRef.id;
        }
      } else {
        const newMarkerRef = await addDoc(markersCollection, { ...marker });
        marker.id = newMarkerRef.id;
      }

      // Update the state with the new or updated marker
      setMarkers((prevMarkers) => {
        const updatedMarkers = prevMarkers.map((prevMarker) =>
          prevMarker.id === marker.id ? marker : prevMarker
        );

        return marker.id ? updatedMarkers : [...prevMarkers, marker];
      });

      console.log("Marker saved to Firestore:", marker);
    } catch (error) {
      console.error("Error saving marker to Firestore:", error);
    }
  };

  const deleteMarkerFromFirestore = async (markerId) => {
    try {
      const markersCollection = collection(firestoreDB, "markers");
      const markerDocRef = doc(markersCollection, markerId.toString());

      await deleteDoc(markerDocRef);
      console.log("Marker deleted from Firestore:", markerId);
    } catch (error) {
      console.error("Error deleting marker from Firestore:", error);
    }
  };

  const loadMarkersFromFirestore = async () => {
    try {
      const markersCollection = collection(firestoreDB, "markers");
      const markersSnapshot = await getDocs(markersCollection);

      const loadedMarkers = markersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Markers loaded from Firestore:", loadedMarkers);

      // Update the state with all loaded markers
      setMarkers(loadedMarkers);
    } catch (error) {
      console.error("Error loading markers from Firestore:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedMarker(null);
    setModalVisible(false);
    setIsEditing(false);
    setEditedTitle("");
    setEditedDescription("");
  };

  const handleMapPress = (event) => {
    if (modalVisible && selectedMarker && !isEditing) {
      handleCloseModal();
    } else {
      if (selectedMarker && isEditing) {
        const updatedMarkers = markers.map((marker) =>
          marker.id === selectedMarker.id
            ? {
                ...marker,
                coordinate: {
                  latitude: event.nativeEvent.coordinate.latitude,
                  longitude: event.nativeEvent.coordinate.longitude,
                },
                title: editedTitle,
                description: editedDescription,
              }
            : marker
        );

        setMarkers(updatedMarkers);
        saveMarkerToFirestore(selectedMarker);
        setIsEditing(false);
        setModalVisible(false);
      } else {
        setCenter({
          latitude: event.nativeEvent.coordinate.latitude,
          longitude: event.nativeEvent.coordinate.longitude,
        });
        setIsEditing(false);
        setModalVisible(true);
      }
    }
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setEditedTitle(marker.title || "");
    setEditedDescription(marker.description || "");
  };

  const handleCalloutPress = (marker) => {
    setSelectedMarker(marker);
    setEditedTitle(marker.title || "");
    setEditedDescription(marker.description || "");
    setModalVisible(true);
    setIsEditing(true);
  };

  const handleEditPress = () => {
    if (selectedMarker) {
      setModalVisible(true);
      setIsEditing(true);
    }
  };

  const handleSavePress = async () => {
    try {
      if (selectedMarker && isEditing) {
        // Редактирование существующей метки
        const updatedMarker = {
          ...selectedMarker,
          coordinate: center,
          title: editedTitle,
          description: editedDescription,
        };

        await saveMarkerToFirestore(updatedMarker);

        setMarkers((prevMarkers) =>
          prevMarkers.map((marker) =>
            marker.id === selectedMarker.id ? updatedMarker : marker
          )
        );

        console.log("Marker updated in Firestore:", updatedMarker);
      } else {
        // Создание новой метки
        const newMarker = {
          coordinate: center,
          title: editedTitle,
          description: editedDescription,
        };

        const docRef = await addDoc(
          collection(firestoreDB, "markers"),
          newMarker
        );

        newMarker.id = docRef.id;

        setMarkers([...markers, newMarker]);
        console.log("New marker added to Firestore:", newMarker);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error in handleSavePress:", error);
    }
  };

  const handleDeletePress = async () => {
    if (selectedMarker) {
      try {
        await deleteMarkerFromFirestore(selectedMarker.id);

        const updatedMarkers = markers.filter(
          (marker) => marker.id !== selectedMarker.id
        );

        setMarkers(updatedMarkers);

        setSelectedMarker(null);
        setModalVisible(false);
        setIsEditing(false);
        setEditedTitle("");
        setEditedDescription("");

        console.log("Marker deleted from Firestore:", selectedMarker.id);
      } catch (error) {
        console.error("Error deleting marker from Firestore:", error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="chevron-left" size={50} color={"#fbfbfb"} />
            </View>
          </TouchableOpacity>
          <View style={{ alignItems: "flex-start" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
              Карта
            </Text>
          </View>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={{
            ...center,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => handleMarkerPress(marker)}
            >
              <Callout onPress={() => handleCalloutPress(marker)}>
                <View>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                    Метка {marker.id}
                  </Text>
                  <Text>Название: {marker.title}</Text>
                  <Text>Описание: {marker.description}</Text>
                  <TouchableOpacity onPress={handleEditPress}>
                    <Text style={{ color: "green" }}>Редактировать</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            {/* Back arrow icon */}
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.backButton}
            >
              <MaterialIcons name="chevron-left" size={40} color={"#fbfbfb"} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Введите данные:</Text>
            <TextInput
              style={styles.input}
              placeholder="Название"
              value={editedTitle}
              onChangeText={(text) => setEditedTitle(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Описание"
              value={editedDescription}
              onChangeText={(text) => setEditedDescription(text)}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSavePress} style={styles.button}>
                <Text style={styles.buttonText}>Сохранить</Text>
              </TouchableOpacity>
              {selectedMarker && (
                <TouchableOpacity
                  onPress={handleDeletePress}
                  style={[styles.button, { backgroundColor: "red" }]}
                >
                  <Text style={styles.buttonText}>Удалить</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleCloseModal}
                style={[styles.button, { backgroundColor: "gray" }]}
              >
                <Text style={styles.buttonText}>Назад</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 80,
    borderColor: "green",
    borderWidth: 2,
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "green",
    padding: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#688F4E",
  },
  iconContainer: {
    backgroundColor: "##688F4E", // Задний фон кружка
    borderRadius: 25, // Половина высоты иконки, чтобы сделать круглый контейнер
    padding: 5, // Отступы вокруг иконки
  },
};

export default Map;
