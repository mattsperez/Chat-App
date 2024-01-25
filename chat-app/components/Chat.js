import { StyleSheet, View, KeyboardAvoidingView, Platform} from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, query, addDoc, onSnapshot, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Chat = ({ route, navigation, db, isConnected }) => {

    const { name } = route.params;
    const { background } = route.params;
    const { userID } = route.params;
    const [messages, setMessages] = useState([]);


    const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem('messages')) || '[]';
        setMessages(JSON.parse(cachedMessages));
    };

    let unsubMessages;

    const onSend = (newMessages) => { addDoc(collection(db, "messages"), newMessages[0]) }

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

            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
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

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
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
