import images from '@/constants/images';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    //   const handleLogin = async () => {
    //     const result = await login();
    //     if (result) {
    //       refetch();
    //     } else {
    //       Alert.alert("Error", "Login failed");
    //     }
    //   }
    return (
        <SafeAreaView className='bg-white h-full'>
            <StatusBar barStyle={'dark-content'} />
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <Image source={images.loginimage} className='w-full h-[400px]' resizeMode='contain' />
                <View className='px-10'>
                    <Text className='text-base text-center uppercase  text-black-200'>Bebek asİstanına hoş geldİnİz</Text>

                    <Text className='text-3xl font-nunito text-black-300 mt-2 text-center'>Annelerin ve Babaların Dijital Yardımcısı {'\n'}

                    </Text>
                    {/* <TouchableOpacity className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5'>
                        <View className='flex flex-row items-center justify-center'>
                            <Image
                                source={icons.google}
                                className='w-5 h-5'
                                resizeMode='contain'
                            />
                            <Text className='text-lg font-rubik-medium text-black-300 ml-2'>Google ile devam et</Text>
                        </View>
                    </TouchableOpacity> */}
                    <Text className='text-xl font-nunito text-black-300 mt-2 text-center'>Size özel bir yapay zeka desteği ile bebeğinizin gelişimini takip edin.</Text>

                    <TouchableOpacity 
                        onPress={() => router.push('/baby-info')}
                        className="mt-10"
                    >
                        <View className="flex-row items-center justify-center bg-gray-100 py-3 px-6 rounded-full">
                            <Text className="text-lg font-nunito text-gray-700 mr-1 ">Devam et</Text>
                            <View className='mt-[2px]'>

                            <Ionicons name="chevron-forward" size={20} color="#374151" className='' />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
