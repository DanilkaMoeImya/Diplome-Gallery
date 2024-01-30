import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

const firebaseConfig = {
  apiKey: "AIzaSyChJk3FSqABrpP2ZmWt3xSDDyAHhe-Lvgo",
  authDomain: "escobiochat.firebaseapp.com",
  projectId: "escobiochat",
  storageBucket: "escobiochat.appspot.com",
  messagingSenderId: "992840918778",
  appId: "1:992840918778:web:cf14b1a4f992b71f868b43",
};

const Achievement = ({ navigation }) => {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [achievements, setAchievements] = useState([]);

  // Initialize Firebase and Firestore
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "achievements"),
      (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setAchievements(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    try {
      const achievementsRef = collection(db, "achievements");
      await addDoc(achievementsRef, {
        author: author,
        title: title,
        description: description,
        link: link,
      });
      setAuthor("");
      setTitle("");
      setDescription("");
      setLink("");
      console.log("Achievement added successfully!");
    } catch (error) {
      console.error("Error adding achievement: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "achievements", id));
      console.log("Achievement deleted successfully!");
    } catch (error) {
      console.error("Error deleting achievement: ", error);
    }
  };

  const handleCopyLink = (link) => {
    Clipboard.setString(link);
    console.log("Link copied to clipboard:", link);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="chevron-left" size={50} color={"#fbfbfb"} />
          </View>
        </TouchableOpacity>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000" }}>
            Достижения
          </Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Автор"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Название"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Ссылка"
        value={link}
        onChangeText={setLink}
      />
      <Button title="Добавить" onPress={handleSubmit} color="#008000" />

      <FlatList
        data={achievements}
        renderItem={({ item }) => (
          <View style={styles.achievementItem}>
            <Text>Автор: {item.author}</Text>
            <Text>Название: {item.title}</Text>
            <Text>Описание: {item.description}</Text>
            <Text>Ссылка: {item.link}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF0000" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Удалить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#DDDDDD" }]}
                onPress={() => handleCopyLink(item.link)}
              >
                <Text style={styles.buttonText}>Копировать ссылку</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: "#688F4E", // Задний фон кружка
    borderRadius: 25, // Половина высоты иконки, чтобы сделать круглый контейнер
    padding: 5, // Отступы вокруг иконки
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  achievementItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000", // Цвет текста кнопки Copy Link
  },
});

export default Achievement;
