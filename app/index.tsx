import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "@/global.css";

import Card from '@/components/card';
import { landscapes, Landscape } from '@/components/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = 'CARD_PHOTOS';

export default function Home() {
  const [cards, setCards] = useState<Landscape[]>([]);
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const photos: string[] = stored ? JSON.parse(stored) : [];

    const photoCards: Landscape[] = photos.map((uri, i) => ({
      id: Date.now() + i,
      name: 'Foto',
      location: 'Cámara',
      image: uri,
    }));

    // 🔥 SOLO CARDS DE FOTOS (o agrega landscapes si quieres)
    setCards([...photoCards, ...landscapes]);
  };

  const handleSwipe = () => {
    setIndex(prev => prev + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const bgColor = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4],
    outputRange: [
      'rgba(239,68,68,0.3)',
      'rgba(243,244,246,1)',
      'rgba(34,197,94,0.3)',
    ],
    extrapolate: 'clamp',
  });

  if (index >= cards.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">
          No hay más fotos
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: bgColor }}
    >
      <Card
        landscape={cards[index]}
        onSwipe={handleSwipe}
        position={position}
        rotate={rotate}
        likeOpacity={likeOpacity}
        nopeOpacity={nopeOpacity}
      />

      {/* ✓ */}
      <Animated.View
        className="absolute bottom-32"
        style={{ opacity: likeOpacity }}
      >
        <View className="border-4 border-green-500 rounded-full p-4 bg-white">
          <Text className="text-green-500 text-4xl font-bold">✓</Text>
        </View>
      </Animated.View>

      {/* ✕ */}
      <Animated.View
        className="absolute bottom-32"
        style={{ opacity: nopeOpacity }}
      >
        <View className="border-4 border-red-500 rounded-full p-4 bg-white">
          <Text className="text-red-500 text-4xl font-bold">✕</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
