import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BabyHeader from '../components/BabyHeader';
import { db } from '../firebaseConfig';

// Firestore HATASI için açıklama:
// Eğer "WebChannelConnection RPC 'Write' stream ..." hatası alıyorsanız:
// 1. Firebase config'inizin doğru olduğundan emin olun.
// 2. Firestore Database'iniz aktif ve kuralları yazmaya izin veriyor olmalı.
// 3. Geliştirme için Firestore kurallarınızı geçici olarak aşağıdaki gibi ayarlayabilirsiniz:
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /{document=**} {
//          allow read, write: if true;
//        }
//      }
//    }
// 4. İnternet bağlantınız olduğundan emin olun.

interface ChatHistory {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
}

export default function AIChatScreen() {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);
  const [newChatModal, setNewChatModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Chat geçmişini Firestore'dan çek
  const fetchChats = async () => {
    const q = query(collection(db, 'ai_chats'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data: ChatHistory[] = [];
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      data.push({
        id: docSnap.id,
        question: d.question,
        answer: d.answer,
        createdAt: d.createdAt,
      });
    });
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Modal açıldığında input sıfırlansın
  const openNewChatModal = () => {
    setQuestion('');
    setNewChatModal(true);
  };

  // Yeni chat başlat
  const handleNewChat = async () => {
    if (!question.trim()) return;
  
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY; // veya __DEV__ testi için sabit anahtar
    if (!apiKey) {
      Alert.alert('Hata', 'API anahtarı tanımlı değil.');
      return;
    }
  
    setLoading(true);
    abortControllerRef.current = new AbortController();
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: question }],
        }),
        signal: abortControllerRef.current.signal,
      });
  
      if (!response.ok) {
        let msg = `Yanıt alınamadı. (HTTP ${response.status})`;
  
        if (response.status === 401) msg = 'Geçersiz veya eksik OpenAI API anahtarı.';
        else if (response.status === 429) msg = 'Kota sınırı aşıldı. Lütfen faturalandırmayı kontrol edin.';
        else if (response.status >= 500) msg = 'OpenAI sunucu hatası. Lütfen daha sonra tekrar deneyin.';
  
        throw new Error(msg);
      }
  
      const data = await response.json();
  
      const answer = data?.choices?.[0]?.message?.content ?? 'Yanıt alınamadı.';
  
      await addDoc(collection(db, 'ai_chats'), {
        question,
        answer,
        createdAt: Date.now(),
      });
  
      setQuestion('');
      setNewChatModal(false);
      fetchChats();
    } catch (e: any) {
      setNewChatModal(false);
  
      if (e.name === 'AbortError') {
        Alert.alert('İptal edildi', 'İşlem kullanıcı tarafından iptal edildi.');
      } else {
        Alert.alert('Hata', e.message || 'Bilinmeyen bir hata oluştu.');
        console.error('OpenAI Hata:', e); // Geliştirici logu
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };
  

  // Chat sil
  const handleDelete = (id: string) => {
    Alert.alert('Sil', 'Bu sohbeti silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          await deleteDoc(doc(db, 'ai_chats', id));
          setSelectedChat(null);
          setModalVisible(false);
          fetchChats();
        }
      }
    ]);
  };

  // İptal butonu
  const handleCancel = () => {
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setNewChatModal(false);
  };

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-slate-900' : 'bg-baby-bg'}`}>
      <BabyHeader />
      <View className="flex-1 p-4">
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text className={`text-center mt-10 ${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Henüz sohbet yok</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { setSelectedChat(item); setModalVisible(true); }}
              className={`rounded-lg p-4 mb-3 flex-row items-center justify-between border ${colorScheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
            >
              <View className="flex-1">
                <Text className={`font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'}`} numberOfLines={1}>{item.question}</Text>
                <Text className={`text-xs mt-1 ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(item.createdAt).toLocaleString('tr-TR')}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} className="ml-2 p-2">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        {/* Yeni chat başlat butonu */}
        <TouchableOpacity
          onPress={openNewChatModal}
          className="absolute bottom-8 right-8 bg-baby-green-dark w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Chat detay modalı */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center ">
          <View className={`rounded-lg p-6 w-[90%] ${colorScheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <Text className={`font-bold text-lg mb-2 ${colorScheme === 'dark' ? 'text-white' : ''}`}>Soru</Text>
            <Text className={`mb-4 ${colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{selectedChat?.question}</Text>
            <Text className={`font-bold text-lg mb-2 ${colorScheme === 'dark' ? 'text-white' : ''}`}>Yanıt</Text>
            <Text className={`mb-4 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{selectedChat?.answer}</Text>
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-baby-green p-3 rounded-lg">
                <Text className="text-white font-semibold">Kapat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(selectedChat?.id!)} className="bg-red-500 p-3 rounded-lg">
                <Text className="text-white font-semibold">Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Yeni chat modalı */}
      <Modal visible={newChatModal} transparent animationType="slide" onRequestClose={handleCancel}>
        <View className="flex-1 justify-center items-center ">
          <View className={`rounded-lg p-6 w-[90%] ${colorScheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <Text className={`font-bold text-lg mb-2 ${colorScheme === 'dark' ? 'text-white' : ''}`}>Yeni Soru</Text>
            <TextInput
              className={`p-3 rounded-lg mb-4 ${colorScheme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-100 text-black'}`}
              placeholder="Sorunuzu yazın..."
              placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
              value={question}
              onChangeText={setQuestion}
              multiline
            />
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity onPress={handleCancel} className={`p-3 rounded-lg ${colorScheme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'}`}> 
                <Text className={`${colorScheme === 'dark' ? 'text-white' : 'text-gray-800'} font-semibold`}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNewChat} className="bg-baby-green-dark p-3 rounded-lg" disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Gönder</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
