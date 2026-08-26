import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Boton, Pantalla } from '../../components';
import { colores, espacio, tipografia } from '../../theme/tokens';

/** VIEW 01 — Bienvenida. Solo dibuja y navega. */
export default function BienvenidaView() {
  const router = useRouter();
  return (
    <Pantalla>
      <View style={e.centro}>
        <Text style={e.marca}>EcoSnap</Text>
        <Text style={e.lema}>
          Fotografía el residuo y sabrás en qué caneca va, en segundos.
        </Text>
      </View>
      <View style={e.acciones}>
        <Boton variante="lima" onPress={() => router.push('/registro')}>
          Crear mi cuenta
        </Boton>
        <Boton variante="suave" onPress={() => router.push('/login')}>
          Ya tengo cuenta
        </Boton>
      </View>
    </Pantalla>
  );
}

const e = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacio.sm },
  marca: { fontSize: 40, fontWeight: '700', color: colores.acento },
  lema: {
    fontSize: tipografia.cuerpo,
    color: colores.tinta2,
    textAlign: 'center',
    maxWidth: 260,
  },
  acciones: { gap: espacio.sm },
});
