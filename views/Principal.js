import { Text, View, Image, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames'

const Principal = ({ setRoute }) => {
    return (
        <View style={[tw`pt-16 pb-6 bg-gray-100`]}>
            <View style={[tw`h-full flex-col items-center justify-between`]}>
                <View style={[tw`flex-row items-center`]}>
                    <View style={[tw`w-12 h-12 justify-center items-center`]}>
                        <Image source={require('../assets/palabrable_64.png')} alt="logo" style={[tw`w-12 h-12`]} />
                    </View>
                    <View style={[tw`flex-col items-baseline ml-4`]}>
                        <Text style={[tw`text-center font-semibold text-2xl`]}>PALABRA-BLE</Text>
                        <Text style={[tw`text-sm font-semibold italic text-yellow-500`]}>A que no puedes jugar sólo una</Text>
                    </View>
                </View>
                <View style={[tw`flex-col items-center`]}>
                    <TouchableOpacity style={[tw`bg-white shadow-sm rounded-lg w-80 my-4 flex-row items-center p-2`]} onPress={() => setRoute("classic")}>
                        <Image source={require('../assets/icon_classic.png')} alt="classic" />
                        <Text style={[tw`py-4 px-8 text-center text-xl`]}>Clásico</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[tw`bg-white shadow-sm rounded-lg w-80 my-4 flex-row items-center p-2`]} onPress={() => setRoute("inverted")}>
                        <Image source={require('../assets/icon_inverted.png')} alt="inverted" />
                        <Text style={[tw`py-4 px-8 text-center text-xl`]}>Invertido</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[tw`bg-white shadow-sm rounded-lg w-80 my-4 flex-row items-center p-2`]} onPress={() => setRoute("devil")}>
                        <Image source={require('../assets/icon_devil.png')} alt="devil" />
                        <Text style={[tw`py-4 px-8 text-center text-xl`]}>Diabólico</Text>
                    </TouchableOpacity>
                </View>
                <View style={[tw`flex-col items-center`]}>
                    <Text style={[tw`text-center`]}>Juego creado por Gorka Villar</Text>
                </View>
            </View>
        </View>
    )
}

export default Principal