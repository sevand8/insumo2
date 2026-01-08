import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {Button,StyleSheet,Text,TouchableOpacity,View,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'PROFILE_PHOTOS';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos permiso para usar la cámara
        </Text>
        <Button onPress={requestPermission} title="Permitir cámara" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // 📸 TOMAR FOTO → USER
  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const photos: string[] = stored ? JSON.parse(stored) : [];

      photos.unshift(photo.uri);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(photos)
      );

      console.log('Foto guardada en user:', photo.uri);
    } catch (error) {
      console.error('Error al tomar foto:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePhoto}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: { padding: 10 },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: '#ccc',
  },
})
