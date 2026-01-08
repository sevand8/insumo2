import { View, Image, FlatList, Text } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "@/global.css";

const STORAGE_KEY = 'PROFILE_PHOTOS';

export default function UserScreen() {
  const [photos, setPhotos] = useState<string[]>([]);

  const loadPhotos = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    setPhotos(stored ? JSON.parse(stored) : []);
  };

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  return (
    <View className="flex-1 bg-white pt-10">
      <Text className="text-center text-xl font-bold mb-4">
        Mis fotos
      </Text>

      <FlatList
        data={photos}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            className="w-1/3 aspect-square"
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-20">
            No hay fotos aún
          </Text>
        }
      />
    </View>
  );
}
