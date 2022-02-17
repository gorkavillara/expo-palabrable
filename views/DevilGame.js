import { useState, useEffect } from 'react';
import { Text, View, Image, Modal, FlatList, TouchableOpacity, Platform } from 'react-native';
import AsyncStorageStatic from '@react-native-async-storage/async-storage';
import Keyboard from '../components/Keyboard';
import tw from 'tailwind-react-native-classnames'
import { palabras } from '../utils/palabras';
import { dicc } from '../utils/dicc';
import { successGifs, failGifs } from "../utils/list";
import Toast from 'react-native-root-toast'
import WordFeedback from '../components/WordFeedback';
import WordExample from '../components/WordExample';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootSiblingParent } from 'react-native-root-siblings';

const emptyTries = [{ text: "", key: 0 }, { text: "", key: 1 }, { text: "", key: 2 }, { text: "", key: 3 }, { text: "", key: 4 }, { text: "", key: 5 }]

const DevilGame = ({ setRoute }) => {
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
    const [helpModalOpen, setHelpModalOpen] = useState(false)
    const [successGifUrl, setSuccessGifUrl] = useState("https://palabrable.gorkavillar.com/gifs/friends.gif")
    const [failGifUrl, setFailGifUrl] = useState("https://palabrable.gorkavillar.com/gifs/friendsrage.gif")

    useEffect(() => {
        const index = Math.floor(Math.random() * palabras.length);
        setSecretWordIndex(index);
        getGifUrl();
    }, [update]);

    useEffect(async () => {
        let helpVal = null;
        try {
            helpVal = await AsyncStorageStatic.getItem('help');
        } catch (e) {
            setHelpModalOpen(true);
        }
        if (helpVal !== null) return;
        if (helpVal === "true") return;
    }, [])

    useEffect(() => {
        const newSecretWord = palabras[secretWordIndex]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        setSecretWord(newSecretWord.toLowerCase());
    }, [secretWordIndex]);

    const closeHelp = async () => {
        try {
            await AsyncStorageStatic.setItem('help', 'false');
            setHelpModalOpen(false);
        } catch (e) { console.error(e) }
    }

    const openHelp = () => {
        setHelpModalOpen(true)
    }

    const sendWord = () => {
        const newTries = tries;
        if (!dicc.includes(newTries[tryNumber].text.toLowerCase())) {
            Platform.OS !== "web" && Toast.show('Esa palabra no existe, prueba con otra.', {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP
            });
            return;
        }
        if (newTries[tryNumber].text.toLowerCase() === secretWord.toLowerCase()) {
            setModalOpen(true)
            return setStatus("success")
        } else if (tryNumber === 5) {
            setModalOpen(true)
            return setStatus("fail")
        }
        setTryNumber(tryNumber + 1);
        const index = Math.floor(Math.random() * palabras.length);
        setSecretWordIndex(index);
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

    const getGifUrl = status => {
        if (status === "success") {
            const index = Math.floor(Math.random() * successGifs.length)
            return setSuccessGifUrl(successGifs[index])
        } else {
            const index = Math.floor(Math.random() * failGifs.length)
            return setFailGifUrl(failGifs[index])
        }
    }
    const getGifSource = status => {
        let uri;
        if (status === "success") {
            const index = Math.floor(Math.random() * successGifs.length)
            uri = successGifs[index]
        } else {
            const index = Math.floor(Math.random() * failGifs.length)
            uri = failGifs[index]
        }
        return { uri, width: 300, height: 300 }
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
            return <WordFeedback word={item.text} secretWord={secretWord} />
        } else if (item.key === tryNumber) {
            return (
                <View style={[tw`flex-row my-2`]}>
                    {[0, 1, 2, 3, 4].map((pos, j) => (
                        <View key={j} style={[tw`w-14 h-14 mx-2 flex-row justify-center items-center uppercase font-bold text-4xl border rounded`]}>
                            <Text style={[tw`uppercase text-3xl text-gray-800`]}>{item.text.substring(pos, pos + 1)}</Text>
                        </View>
                    )
                    )}
                </View>
            )
        } else {
            return (
                <View style={[tw`flex-row my-2`]}>
                    {[0, 1, 2, 3, 4].map((letra, j) => (
                        <View key={j} style={[tw`w-14 h-14 mx-2 flex-row justify-center items-center uppercase font-bold text-4xl border rounded opacity-25`]}>
                        </View>
                    ))}
                </View>
            )
        }
    }
    return (
        <RootSiblingParent>
            <View style={[tw`h-full flex-col justify-between items-center py-16`]}>
                <View style={[tw`flex-row justify-between w-full px-6 mb-4`]}>
                    <TouchableOpacity style={[tw`flex-row items-center`]} onPress={openHelp}>
                        <Icon name="ios-help-circle" size={40} color="#5200FF" />
                    </TouchableOpacity>
                    <View style={[tw`flex-row items-center`]}>
                        <View style={[tw`w-12 h-12 justify-center items-center`]}>
                            <Image source={require('../assets/icon_devil.png')} alt="logo" style={[tw`w-12 h-12`]} />
                        </View>
                        <View style={[tw`flex-col items-baseline ml-4`]}>
                            <Text style={[tw`text-center font-semibold text-2xl`]}>Diabólico</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[tw`flex-row items-center`]} onPress={() => setRoute('home')}>
                        <Icon name="md-home-sharp" size={32} color="#5200FF" />
                    </TouchableOpacity>
                </View>
                <View style={[tw`flex-col items-center justify-center max-w-2xl my-2`]}>
                    <FlatList
                        data={tries}
                        renderItem={TryRow}
                        keyExtractor={item => item.key}
                    />
                    <Keyboard type={type} reset={reset} status={status} tries={tries} successKeys={successKeys} misplacedKeys={misplacedKeys} failedKeys={failedKeys} secretWord={secretWord} />
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalOpen}
                    onRequestClose={() => {
                        setModalOpen(!modalOpen);
                    }}
                >
                    <View style={[tw`justify-center items-center h-full`]}>
                        {status === "success" && (
                            <View style={[tw`flex-col justify-center items-center`]}>
                                <Image source={getGifSource("success")} alt="¡Enhorabuena!" />
                                <Text style={[tw`text-lg font-semibold text-green-600 text-center py-4`]}>¡Enhorabuena! ¿Quieres volver a intentarlo?</Text>
                                <View style={[tw`flex-row`]}>
                                    <TouchableOpacity style={[tw`border border-red-500 rounded-lg py-2 px-4 mx-2`]} onPress={() => setModalOpen(false)}><Text style={[tw`text-red-500 text-lg`]}>No por ahora...</Text></TouchableOpacity>
                                    <TouchableOpacity style={[tw`bg-green-500 border border-green-500 rounded-lg py-2 px-4 mx-2`]} onPress={reset}><Text style={[tw`text-white text-lg`]}>¡Pues claro!</Text></TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {status === "fail" && <View style={[tw`flex-col justify-center items-center`]}>
                            <Image source={getGifSource("fail")} alt="¡Fallaste!" />
                            <Text style={[tw`text-lg font-semibold text-red-600 text-center py-4`]}>¡Noooo!¡Fallaste! ¿Quieres volver a intentarlo?</Text>
                            <Text style={[tw`text-lg text-gray-600 text-center py-4`]}>La respuesta correcta era... <Text style={[tw`uppercase font-bold`]} > {secretWord}</Text></Text>
                            <View style={[tw`flex-row`]}>
                                <TouchableOpacity style={[tw`border border-red-500 rounded-lg py-2 px-4 mx-2`]} onPress={() => setModalOpen(false)}><Text style={[tw`text-red-500 text-lg`]}>No por ahora...</Text></TouchableOpacity>
                                <TouchableOpacity style={
                                    [tw`bg-green-500 text-white border border-green-500 rounded-lg py-2 px-4 mx-2`]} onPress={reset}><Text style={[tw`text-white text-lg`]}>¡Pues claro!</Text></TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={helpModalOpen}
                    onRequestClose={closeHelp}>
                    <View style={[tw`bg-gray-800 bg-opacity-40 flex-row justify-center items-center h-full`]}>
                        <View style={[tw`bg-white w-5/6 rounded-lg p-6 flex-col items-center justify-between`]}>
                            <Text style={[tw`text-black text-2xl font-bold`]}>Cómo se juega</Text>
                            <View style={[tw`mt-4 w-full overflow-hidden`]}>
                                <View style={[tw`items-center`]}>
                                    <WordExample word={"nueva"} secretWord={"anida"} />
                                </View>
                                <View style={[tw`flex-row mt-2`]}>
                                    <View style={[tw`mt-2 w-3 h-3 bg-gray-400 rounded-full`]}></View>
                                    <Text style={[tw`ml-3 text-black text-lg`]}>Las letras U, E y V <Text style={[tw`font-bold`]}>NO</Text> se encuentran en la palabra secreta.</Text>
                                </View>
                                <View style={[tw`flex-row mt-2`]}>
                                    <View style={[tw`mt-2 w-3 h-3 bg-yellow-400 rounded-full`]}></View>
                                    <Text style={[tw`ml-3 text-black text-lg`]}>La letra N <Text style={[tw`font-bold`]}>SÍ</Text> se encuentra en la palabra secreta, pero <Text style={[tw`font-bold`]}>está en diferente lugar.</Text></Text>
                                </View>
                                <View style={[tw`flex-row mt-2`]}>
                                    <View style={[tw`mt-2 w-3 h-3 bg-green-400 rounded-full`]}></View>
                                    <Text style={[tw`ml-3 text-black text-lg`]}>La letra A <Text style={[tw`font-bold`]}>SÍ</Text> se encuentra en la palabra secreta, y además <Text style={[tw`font-bold`]}>está en el lugar correcto.</Text></Text>
                                </View>
                            </View>
                            <TouchableOpacity style={
                                [tw`mt-4 bg-green-500 text-white border border-green-500 rounded-lg py-2 px-4 mx-2`]} onPress={closeHelp}><Text style={[tw`text-white text-lg`]}>Comenzar</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </RootSiblingParent >
    )
};

export default DevilGame;
