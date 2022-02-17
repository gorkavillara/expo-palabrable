import React from "react";
import { View, TouchableOpacity, Text } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'tailwind-react-native-classnames'

const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
    ["z", "x", "c", "v", "b", "n", "m", "back", "send"],
];

const Keyboard = ({
    type,
    tries,
    secretWord,
    reset,
    status,
}) => {
    return (
        <View style={[tw`flex flex-col items-center`]}>
            {keys.map((row, i) => (
                <View style={[tw`flex flex-row justify-evenly items-center my-1`]}
                    key={i}>
                    {row.map((key, j) => (
                        <React.Fragment key={j}>
                            {key === "back" && (
                                <TouchableOpacity
                                    style={[tw`bg-gray-300 w-9 h-10 mx-1 rounded-lg uppercase text-2xl flex justify-center items-center`]}
                                    onPress={() => type(key)}
                                >
                                    <View>
                                        <Icon name="backspace-outline" size={30} color="#333" />
                                    </View>
                                </TouchableOpacity>
                            )}
                            {key === "send" && (
                                <TouchableOpacity
                                    key={j}
                                    style={[tw`bg-blue-600 text-white mx-1 w-14 h-10 rounded-lg uppercase text-2xl flex justify-center items-center`]}
                                    onPress={() => (status === "" ? type(key) : reset())}
                                >
                                    <View>{status === "" ? <Icon name="send" size={30} color="#fff" /> : <Icon name="refresh" size={30} color="#fff" />}</View>
                                </TouchableOpacity>
                            )}
                            {key !== "back" && key !== "send" && (
                                <TouchableOpacity
                                    key={j}
                                    style={[tw`bg-gray-300 mr-1
                                        ${failedKeys.includes(key) && "bg-gray-800"}
                                        ${misplacedKeys.includes(key) && "bg-yellow-500"}
                                        ${successKeys.includes(key) && "bg-green-500"}
                                        w-8 h-10 rounded-lg uppercase text-xl flex justify-center items-center`]}
                                    onPress={() => type(key)}
                                >
                                    <Text style={[tw`uppercase text-xl text-gray-800 ${failedKeys.includes(key) && "text-white"} ${successKeys.includes(key) && "text-white"}`]}>{key}</Text>
                                </TouchableOpacity>
                            )}
                        </React.Fragment>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default Keyboard;
