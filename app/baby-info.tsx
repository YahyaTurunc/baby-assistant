import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBaby } from './context/BabyContext';

export default function BabyInfoScreen() {
  const router = useRouter();
  const { updateBabyInfo } = useBaby();
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!babyName || !gender) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun');
      return;
    }

    updateBabyInfo({
      name: babyName,
      birthDate,
      gender,
      image: image || undefined
    });

    router.replace('/(tabs)/diary');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-baby-bg p-5">
      <ScrollView showsVerticalScrollIndicator={false} className="space-y-6">
        <TouchableOpacity 
          onPress={pickImage}
          className="items-center mb-6"
        >
          <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden">
            {image ? (
              <Image 
                source={{ uri: image }} 
                className="w-full h-full"
              />
            ) : (
              <Text className="text-gray-400">Fotoğraf Ekle</Text>
            )}
          </View>
        </TouchableOpacity>

        <View>
          <Text className="text-lg font-semibold text-gray-700 mb-2">Bebek Adı</Text>
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200"
            placeholder="Bebeğinizin adını girin"
            value={babyName}
            onChangeText={setBabyName}
          />
        </View>

        <View>
          <Text className="text-lg font-semibold text-gray-700 mb-2">Doğum Tarihi</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-white p-4 rounded-lg border border-gray-200"
          >
            <Text className="text-gray-700">
              {birthDate.toLocaleDateString('tr-TR')}
            </Text>
          </TouchableOpacity>

          {(showDatePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={onDateChange}
              maximumDate={new Date()}
              style={Platform.OS === 'ios' ? { width: '100%', height: 200 } : undefined}
            />
          )}
        </View>

        <View>
          <Text className="text-lg font-semibold text-gray-700 mb-2">Cinsiyet</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => setGender('male')}
              className={`flex-1 p-4 rounded-full border ${
                gender === 'male' 
                  ? 'bg-blue-400 border-blue-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-center font-semibold ${
                gender === 'male' ? 'text-white' : 'text-gray-700'
              }`}>
                Erkek
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGender('female')}
              className={`flex-1 p-4 rounded-full border ${
                gender === 'female' 
                  ? 'bg-pink-400 border-pink-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-center font-semibold ${
                gender === 'female' ? 'text-white' : 'text-gray-700'
              }`}>
                Kız
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-baby-green-dark p-4 rounded-full mt-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Kaydet
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 