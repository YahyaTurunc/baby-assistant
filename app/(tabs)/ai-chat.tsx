import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BabyHeader from '../components/BabyHeader';

export default function AIChatScreen() {
  return (
    <SafeAreaView className="flex-1 bg-baby-bg dark:bg-slate-900">
      <BabyHeader />
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">AI Asistan</Text>
      </View>
    </SafeAreaView>
  );
} 