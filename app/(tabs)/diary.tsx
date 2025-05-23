import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BabyHeader from '../components/BabyHeader';

interface DiaryEntry {
    id: string;
    date: string;
    content: string;
}

export default function DiaryScreen() {
    const colorScheme = useColorScheme();
    const [diaryText, setDiaryText] = useState('');
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSave = () => {
        if (diaryText.trim() === '') {
            Alert.alert('Uyarı', 'Lütfen bir şeyler yazın');
            return;
        }

        const newEntry: DiaryEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('tr-TR'),
            content: diaryText.trim()
        };

        setEntries([newEntry, ...entries]);
        setDiaryText('');
    };

    const handleEntryPress = (entry: DiaryEntry) => {
        setSelectedEntry(entry);
        setModalVisible(true);
    };

    const handleCopyText = async () => {
        if (selectedEntry) {
            await Clipboard.setStringAsync(selectedEntry.content);
            Alert.alert('Başarılı', 'Metin kopyalandı!');
        }
    };

    const handleDeleteEntry = (entryId: string) => {
        Alert.alert(
            'Bu günlük kaydını silmek istediğinizden emin misiniz?',
            '',
            [
                {
                    text: 'İptal',
                    style: 'cancel'
                },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        setEntries(entries.filter(entry => entry.id !== entryId));
                        if (selectedEntry?.id === entryId) {
                            setModalVisible(false);
                            setSelectedEntry(null);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-baby-bg dark:bg-slate-900">
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            <BabyHeader />
            <View className="px-5 flex-1">
                <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Bugün nasıldı?</Text>

                <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-200 min-h-[150px] text-base dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    placeholder="Bugün neler yaşadınız?"
                    multiline
                    textAlignVertical="top"
                    value={diaryText}
                    onChangeText={setDiaryText}
                />

                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-baby-green-dark p-4 rounded-full mt-4"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Kaydet
                    </Text>
                </TouchableOpacity>

                <ScrollView className="mt-6">
                    {entries.map((entry) => (
                        <TouchableOpacity
                            key={entry.id}
                            onPress={() => handleEntryPress(entry)}
                            className="bg-white p-4 rounded-lg mb-3 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1">
                                    <Text className="text-gray-500 dark:text-white text-sm mb-2">{entry.date}</Text>
                                    <Text className="text-gray-800 dark:text-white" numberOfLines={2}>
                                        {entry.content}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteEntry(entry.id)}
                                    className="ml-2 p-2 mt-1"
                                >
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center">
                        <View className="bg-baby-bg shadow-md m-5 rounded-lg p-5 w-[90%] dark:bg-slate-800">
                            <Text className="text-gray-500 dark:text-white text-sm mb-2">{selectedEntry?.date}</Text>
                            <Text className="text-gray-800 dark:text-white text-base mb-4">{selectedEntry?.content}</Text>

                            <View className="flex-row justify-end space-x-3">
                                <TouchableOpacity
                                    onPress={handleCopyText}
                                    className="bg-baby-green p-3 rounded-lg"
                                >
                                    <Text className="text-white font-semibold">Kopyala</Text>
                                </TouchableOpacity>

                                {selectedEntry && (
                                    <TouchableOpacity
                                        onPress={() => handleDeleteEntry(selectedEntry.id)}
                                        className="bg-red-500 p-3 rounded-lg"
                                    >
                                        <Text className="text-white font-semibold">Sil</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    className="bg-gray-200 p-3 rounded-lg"
                                >
                                    <Text className="text-gray-800  font-semibold">Kapat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
} 