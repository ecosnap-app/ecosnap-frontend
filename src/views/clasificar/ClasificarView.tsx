import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Boton, EnConstruccion, Pantalla } from '../../components';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

/** VIEW 05 — Cámara (HU-07). En el Sprint 5 se reemplaza por expo-camera. */
export default function ClasificarView() {
  const router = useRouter();
  return (
    <Pantalla titulo="Clasificar" subtitulo="Centra el residuo en el marco">
      <View style={e.visor}>
        <View style={e.marco} />
        <Text style={e.pista}>Aquí irá la vista de la cámara</Text>
      </View>
      <Boton variante="lima" onPress={() => router.push('/analizando')}>
        Tomar la foto
      </Boton>
      <EnConstruccion nota="Sprint 3: el botón navega a la pantalla de análisis. Sprint 5: se integra expo-camera y la foto real se envía al backend." />
    </Pantalla>
  );
}

const e = StyleSheet.create({
  visor: {
    flex: 1,
    backgroundColor: '#1B2822',
    borderRadius: radio.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.md,
  },
  marco: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colores.lima,
    borderStyle: 'dashed',
    borderRadius: radio.lg,
  },
  pista: { color: '#D7E4D9', fontSize: tipografia.detalle },
});
