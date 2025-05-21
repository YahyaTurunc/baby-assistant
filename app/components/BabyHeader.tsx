import React from 'react';
import { Image, Text, View } from 'react-native';
import { useBaby } from '../context/BabyContext';

export default function BabyHeader() {
  const { babyInfo } = useBaby();

  return (
    <View className="bg-baby-bg">
      <View className="flex-row items-center px-4 mb-5">
        <View className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
          {babyInfo.image ? (
            <Image 
              source={{ uri: babyInfo.image }} 
              className="w-full h-full"
            />
          ) : (
            <View className="w-full h-full bg-baby-green items-center justify-center">
              <Text className="text-white text-lg font-bold">
                {babyInfo.name ? babyInfo.name[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-lg font-semibold text-gray-800">
          {babyInfo.name || 'Bebek'}
        </Text>
      </View>
    </View>
  );
} 