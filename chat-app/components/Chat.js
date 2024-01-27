import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, query, addDoc, onSnapshot, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

const Chat = ({ route, navigation, db, isConnected, storage }) => {

    const { name } = route.params;
    const { background } = route.params;
    const { userID } = route.params;
    const [messages, setMessages] = useState([]);

    const renderBubble = (props) => {
        return <Bubble{...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#2a9d8f",
                },
                left: {
                    backgroundColor: "#fff"
                }
            }}
        />
    }

    const renderCustomActions = (props) => {
        return <CustomActions userID={userID} storage={storage} {...props} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // prevents the text bar to render when offline
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected === true) {
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (documentSnapshot) => {
                let newMessages = [];
                documentSnapshot.forEach(doc => {
                    newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) })
                });

                cachedMessages(newMessages);
                setMessages(newMessages);
            });
        } else loadCachedMessages();


        return () => {
            if (unsubMessages) unsubMessages()
        }
    }, []);

    const cachedMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem("messages")) || "[]";
        setMessages(JSON.parse(cachedMessages));
    };

    let unsubMessages;

    const onSend = (newMessages) => { addDoc(collection(db, "messages"), newMessages[0]) }

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                renderInputToolbar={renderInputToolbar}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default Chat;
