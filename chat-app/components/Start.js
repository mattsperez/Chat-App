import { useState } from 'react';
import React from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [background, setBackground] = useState('');
    const Background = require('../assets/Background-Image.png')


    return (
        <ImageBackground source={Background} style={styles.image}>
            {/* app title: */}
            <Text style={styles.title}>Chat App</Text>

            {/* container for input, color choice and button */}
            <View style={styles.inputBox}>
                {/* name input */}
                <TextInput
                    placeholder="Your Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.textInput}
                ></TextInput>

                <View>
                    <Text style={styles.chooseBackgroundText}>Choose Background Color:</Text>

                    {/* container for colors: */}
                    <View style={styles.colorButtonBox}>
                        {/* color 1 */}

                        <TouchableOpacity
                            style={[styles.colorButton, styles.colorInput1]}
                            onPress={() => {
                                setBackground(styles.colorInput1.backgroundColor);
                            }}
                        ></TouchableOpacity>

                        {/* color 2 */}
                        <TouchableOpacity
                            style={[styles.colorButton, styles.colorInput2]}
                            onPress={() => {
                                setBackground(styles.colorInput2.backgroundColor);
                            }}
                        ></TouchableOpacity>

                        {/* color 3 */}
                        <TouchableOpacity
                            style={[styles.colorButton, styles.colorInput3]}
                            onPress={() => {
                                setBackground(styles.colorInput3.backgroundColor);
                            }}
                        ></TouchableOpacity>

                        {/* color 4 */}
                        <TouchableOpacity
                            style={[styles.colorButton, styles.colorInput4]}
                            onPress={() => {
                                setBackground(styles.colorInput4.backgroundColor);
                            }}
                        ></TouchableOpacity>
                    </View>
                </View>
                {/* button to start chatting, links to chat.js */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("Chat", {
                            name: name,
                            color: background,
                        });
                    }}
                >
                    <Text style={styles.buttonText}>Start Chatting</Text>
                </TouchableOpacity>
                {/* {console.log(username)} */}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 45,
        fontWeight: "600",
        color: "white",
        alignSelf: "center",
        marginBottom: 250,
    },
    inputBox: {
        flex: 1,
        height: "44%",
        width: "85%",
        backgroundColor: "white",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-evenly",
        borderRadius: 15,
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
    },
    chooseBackgroundText: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        margin: 10,
        textAlign: "center",
        justifyContent: "center",
        marginLeft: 20,
    },
    colorButtonBox: {
        display: "flex",
        flexDirection: "row",
        width: "80%",
        justifyContent: "space-between",
        alignItems: "center",
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 50/2,
    },
    colorInput1: {
        backgroundColor: "#090C08",
    },
    colorInput2: {
        backgroundColor: "#474056",
    },
    colorInput3: {
        backgroundColor: "#8A95A5",
    },
    colorInput4: {
        backgroundColor: "#B9C6AE",
    },
    button: {
        backgroundColor: "#757083",
        width: "88%",
        alignItems: "center",
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 15,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default Start;