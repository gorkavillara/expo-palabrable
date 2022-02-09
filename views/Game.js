import { useState, useEffect } from 'react';
import { Text, View, Image, Modal, FlatList, TouchableOpacity } from 'react-native';
import Keyboard from '../components/Keyboard';
import tw from 'tailwind-react-native-classnames'
import { palabras } from '../utils/palabras';
import { successGifs, failGifs } from "../utils/list";

const emptyTries = [{ text: "", key: 0 }, { text: "", key: 1 }, { text: "", key: 2 }, { text: "", key: 3 }, { text: "", key: 4 }, { text: "", key: 5 }]

const Game = () => {
    const [successKeys, setSuccessKeys] = useState([]);
    const [misplacedKeys, setMisplacedKeys] = useState([]);
    const [failedKeys, setFailedKeys] = useState([]);
    const [secretWordIndex, setSecretWordIndex] = useState(0);
    const [secretWord, setSecretWord] = useState("");
    const [tries, setTries] = useState(emptyTries);
    const [tryNumber, setTryNumber] = useState(0);
    const [update, setUpdate] = useState(false);
    const [status, setStatus] = useState("");
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        const index = Math.floor(Math.random() * palabras.length);
        setSecretWordIndex(index);
    }, [update]);

    useEffect(() => {
        const newSecretWord = palabras[secretWordIndex]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        setSecretWord(newSecretWord.toLowerCase());
    }, [secretWordIndex]);

    const sendWord = () => {
        const newTries = tries;
        if (newTries[tryNumber].text.toLowerCase() === secretWord.toLowerCase()) {
            setStatus("success")
            setModalOpen(true)
        } else if (tryNumber === 5) {
            setStatus("fail")
            setModalOpen(true)
        }
        setTryNumber(tryNumber + 1);
        updateKeyboard();
    };

    const updateKeyboard = () => {
        const lastTry = tries[tries.filter(t => t.text !== "").length - 1];
        let newSuccessKeys = []
        let newMisplacedKeys = []
        let newFailedKeys = []
        const chars = [0, 1, 2, 3, 4]
        chars.forEach(i => {
            const char = lastTry.text.substring(i, i + 1);
            if (char.toLowerCase() === secretWord.substring(i, i + 1).toLowerCase()) {
                newSuccessKeys.push(char)
            } else if (secretWord.toLowerCase().indexOf(char.toLowerCase()) === -1) {
                newFailedKeys.push(char)
            } else {
                newMisplacedKeys.push(char)
            }
        })
        setSuccessKeys([...successKeys, ...newSuccessKeys])
        setMisplacedKeys([...misplacedKeys, ...newMisplacedKeys])
        setFailedKeys([...failedKeys, ...newFailedKeys])
    }

    const getGif = status => {
        if (status === "success") {
            const index = Math.floor(Math.random() * successGifs.length)
            return successGifs[index]
        } else {
            const index = Math.floor(Math.random() * failGifs.length)
            return failGifs[index]
        }
    }

    const reset = () => {
        setTryNumber(0);
        setTries(emptyTries);
        setUpdate(!update)
        setModalOpen(false)
        setStatus("")
        setSuccessKeys([])
        setMisplacedKeys([])
        setFailedKeys([])
    }

    const type = key => {
        if (key === "send") {
            return sendWord();
        }
        if (key === "back") {
            let newWord = tries[tryNumber].text.substring(0, tries[tryNumber].text.length - 1)
            let newTries = tries.map((tr, i) => i === tryNumber ? { text: newWord, key: i } : tr)
            return setTries([...newTries])
        }
        let newWord = `${tries[tryNumber].text}${key}`;
        let newTries = tries.map((tr, i) => i === tryNumber ? { text: newWord, key: i } : tr)
        return setTries([...newTries])
    }

    const TryRow = ({ item }) => {
        if (item.key < tryNumber) {
            return (
                <View style={[tw`flex flex-row my-2`]}>
                    {[0, 1, 2, 3, 4].map((pos, j) => (
                        <View key={j} style={[tw`w-14 h-14 mx-2 flex flex-row justify-center items-center uppercase font-bold text-4xl border
                        ${item.text.substring(pos, pos + 1) === secretWord.substring(pos, pos + 1) ? "bg-green-400" :
                                item.text.substring(pos, pos + 1) !== secretWord.substring(pos, pos + 1) && secretWord.toLowerCase().indexOf(item.text.substring(pos, pos + 1)) === -1 ? "bg-gray-400" : item.text.substring(pos, pos + 1) === "" ? "bg-white" : "bg-yellow-400"}
                        `]}>
                            <Text style={[tw`uppercase text-3xl text-gray-800 ${item.text.substring(pos, pos + 1) === secretWord.substring(pos, pos + 1) && "text-white"} ${item.text.substring(pos, pos + 1) !== secretWord.substring(pos, pos + 1) && secretWord.toLowerCase().indexOf(item.text.substring(pos, pos + 1)) === -1 && "text-white"}
                        `]}>{item.text.substring(pos, pos + 1)}</Text>
                        </View>
                    ))}
                </View>
            )
        } else if (item.key === tryNumber) {
            return (
                <View style={[tw`flex flex-row my-2`]}>
                    {[0, 1, 2, 3, 4].map((pos, j) => (
                        <View key={j} style={[tw`w-14 h-14 mx-2 flex flex-row justify-center items-center uppercase font-bold text-4xl border`]}>
                            <Text style={[tw`uppercase text-3xl text-gray-800`]}>{item.text.substring(pos, pos + 1)}</Text>
                        </View>
                    )
                    )}
                </View>
            )
        } else {
            return (
                <View style={[tw`flex flex-row my-2`]}>
                    {[0, 1, 2, 3, 4].map((letra, j) => (
                        <View key={j} style={[tw`w-14 h-14 mx-2 flex flex-row justify-center items-center uppercase font-bold text-4xl border opacity-25`]}>
                        </View>
                    ))}
                </View>
            )
        }
    }
    return (
        <View style={[tw`h-full flex flex-col justify-between items-center py-16`]}>
            <View style={[tw`flex flex-row items-center justify-center`]}>
                <View style={[tw`w-12 h-12 flex justify-center items-center pr-8`]}>
                    <Image source={require('../assets/palabrable_64.png')} alt="logo" style={[tw`w-12 h-12`]} />
                </View>
                <View style={[tw`flex flex-col items-baseline mb-4`]}>
                    <Text style={[tw`text-center font-semibold text-2xl`]}>PALABRA-BLE</Text>
                    <Text style={[tw`text-sm font-semibold italic text-yellow-500`]}>A que no puedes jugar sólo una</Text>
                </View>
            </View>
            <View style={[tw`flex flex-col items-center justify-center max-w-2xl my-2`]}>
                <FlatList
                    data={tries}
                    renderItem={TryRow}
                    keyExtractor={item => item.key}
                />
                <Keyboard type={type} reset={reset} status={status} tries={tries} successKeys={successKeys} misplacedKeys={misplacedKeys} failedKeys={failedKeys} />
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalOpen}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalOpen(!modalOpen);
                }}
            >
                <View style={[tw`flex justify-center items-center h-full`]}>
                    {status === "success" && (
                        <View style={[tw`flex flex-col justify-center items-center`]}>
                            <Image source={getGif("success")} alt="¡Enhorabuena!" />
                            <Text style={[tw`text-lg font-semibold text-green-600 text-center py-4`]}>¡Enhorabuena! ¿Quieres volver a intentarlo?</Text>
                            <View style={[tw`flex flex-row`]}>
                                <TouchableOpacity style={[tw`border border-red-500 rounded-lg py-2 px-4 mx-2`]} onPress={() => setModalOpen(false)}><Text style={[tw`text-red-500 text-lg`]}>No por ahora...</Text></TouchableOpacity>
                                <TouchableOpacity style={[tw`bg-green-500 border border-green-500 rounded-lg py-2 px-4 mx-2`]} onPress={reset}><Text style={[tw`text-white text-lg`]}>¡Pues claro!</Text></TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {status === "fail" && <View style={[tw`flex flex-col justify-center items-center`]}>
                        <Image source={getGif("fail")} alt="¡Fallaste!" />
                        <Text style={[tw`text-lg font-semibold text-red-600 text-center py-4`]}>¡Noooo!¡Fallaste! ¿Quieres volver a intentarlo?</Text>
                        <Text style={[tw`text-lg text-gray-600 text-center py-4`]}>La respuesta correcta era... <Text style={[tw`uppercase font-bold`]} > {secretWord}</Text></Text>
                        <View style={[tw`flex flex-row`]}>
                            <TouchableOpacity style={[tw`border border-red-500 rounded-lg py-2 px-4 mx-2`]} onPress={() => setModalOpen(false)}><Text style={[tw`text-red-500 text-lg`]}>No por ahora...</Text></TouchableOpacity>
                            <TouchableOpacity style={
                                [tw`bg-green-500 text-white border border-green-500 rounded-lg py-2 px-4 mx-2`]} onPress={reset}><Text style={[tw`text-white text-lg`]}>¡Pues claro!</Text></TouchableOpacity>
                        </View>
                    </View>}
                </View>
            </Modal>
        </View>
    )
};

export default Game;
