import { View, Text } from "react-native"
import tw from 'tailwind-react-native-classnames'
const WordExample = ({ word, secretWord }) => {
    return word ? (
        <View style={[tw`flex flex-row my-2`]}>
            {[0, 1, 2, 3, 4].map((pos, j) => (
                <View key={j} style={[tw`w-10 h-10 mx-1 flex flex-row justify-center items-center uppercase font-bold border rounded
        ${word.substring(pos, pos + 1) === secretWord.substring(pos, pos + 1) ? "bg-green-400 border-green-400" :
                        word.substring(pos, pos + 1) !== secretWord.substring(pos, pos + 1) && secretWord.toLowerCase().indexOf(word.substring(pos, pos + 1)) === -1 ? "bg-gray-400 border-gray-400" : word.substring(pos, pos + 1) === "" ? "bg-white border-white" : "bg-yellow-400 border-yellow-400"}
        `]}>
                    <Text style={[tw`uppercase text-2xl text-gray-800 ${word.substring(pos, pos + 1) === secretWord.substring(pos, pos + 1) && "text-white"} ${word.substring(pos, pos + 1) !== secretWord.substring(pos, pos + 1) && secretWord.toLowerCase().indexOf(word.substring(pos, pos + 1)) === -1 && "text-white"}
        `]}>{word.substring(pos, pos + 1)}</Text>
                </View>
            ))}
        </View>) : null
}

export default WordExample;
