import { Tabs } from "expo-router";
import { House, Camera, User } from 'lucide-react-native';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#ffd33d',
      headerStyle: {
        backgroundColor: '#25292e',
      },
      headerShadowVisible: false,
      headerTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: '#25292e',
      },
    }}>
       <Tabs.Screen 
          name="index" 
          options={{
            title:"Home",
            tabBarIcon: ({color, size}) => (
              <House color={"white"} />
            )
        }}/>
            <Tabs.Screen 
          name="camera" 
          options={{
            title:"Camera",
            tabBarIcon: ({color, size}) => (
              <Camera color={"white"} />
            )
        }}/>
            <Tabs.Screen 
          name="user" 
          options={{
            title:"User",
            tabBarIcon: ({color, size}) => (
              <User color={"white"} />
            )
        }}/>
  </Tabs>
  )
}
