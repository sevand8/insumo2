import React, { useRef } from 'react';
import {View,Text,Image,PanResponder,Animated,Dimensions} from 'react-native';
import { Landscape } from './images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface CardProps {
  landscape: Landscape;
  onSwipe: () => void;
  position: Animated.ValueXY;
  rotate: Animated.AnimatedInterpolation<string | number>;
  likeOpacity: Animated.AnimatedInterpolation<string | number>;
  nopeOpacity: Animated.AnimatedInterpolation<string | number>;
}

export default function Card({landscape,onSwipe,position,rotate,likeOpacity,nopeOpacity}: CardProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: false
          }).start(() => {
            onSwipe();
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: false
          }).start(() => {
            onSwipe();
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate }
    ]
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      className="w-11/12 h-4/5 bg-white rounded-3xl shadow-2xl"
      style={cardStyle}
    >
      <Image
        source={{ uri: landscape.image }}
        className="w-full h-full rounded-3xl"
        resizeMode="cover"
      />

      <View className="absolute bottom-0 left-0 right-0 bg-black/70 p-6 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold">
          {landscape.name}
        </Text>
        <Text className="text-white text-xl">
          {landscape.location}
        </Text>
      </View>
    </Animated.View>
  );
}
