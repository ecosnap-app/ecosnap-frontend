import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../../../src/theme/tokens';

/** Las 5 pestañas del flujo principal (HU-18). */
export default function LayoutPestanas() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.acento,
        tabBarInactiveTintColor: colores.tinta3,
        tabBarStyle: { borderTopColor: colores.linea },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="clasificar"
        options={{
          title: 'Clasificar',
          tabBarIcon: ({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color, size }) => <Ionicons name="podium-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
