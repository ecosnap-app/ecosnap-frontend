import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Boton, EnConstruccion, Pantalla } from '../../components';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

/** VIEW 07 — Resultado de la IA (HU-08, HU-09). */
export default function ResultadoView() {
  const router = useRouter();
  return (
    <Pantalla titulo="Botella PET" subtitulo="Identificada con 94% de certeza">
      <View style={e.veredicto}>
        <Text style={e.clave}>VA EN LA</Text>
        <Text style={e.valor}>Caneca blanca</Text>
        <Text style={e.explicacion}>
          El plástico PET limpio es aprovechable y sí se recicla en Colombia.
        </Text>
      </View>
      <Text style={e.seccion}>Antes de botarla</Text>
      <Text style={e.paso}>1. Enjuágala con un poco de agua</Text>
      <Text style={e.paso}>2. Aplástala para que ocupe menos</Text>
      <Text style={e.paso}>3. Deja la tapa puesta, también se recicla</Text>
      <View style={{ flex: 1 }} />
      <Boton onPress={() => router.replace('/inicio')}>Guardar y sumar 10 puntos</Boton>
      <Boton variante="suave" onPress={() => router.replace('/clasificar')}>
        Clasificar otro
      </Boton>
      <EnConstruccion nota="Sprint 3: datos fijos. Sprint 5: vendrán del ViewModel useClasificacion, que los pide al backend." />
    </Pantalla>
  );
}

const e = StyleSheet.create({
  veredicto: { backgroundColor: colores.canecaBlanca, borderRadius: radio.lg, padding: espacio.md },
  clave: { fontSize: 11, letterSpacing: 1.4, color: colores.tinta2 },
  valor: { fontSize: 27, fontWeight: '700', color: colores.tinta },
  explicacion: { fontSize: 14, color: colores.tinta2, marginTop: espacio.xs },
  seccion: { fontSize: tipografia.detalle, fontWeight: '600', color: colores.tinta2, marginTop: espacio.sm },
  paso: { fontSize: 14, color: colores.tinta2, lineHeight: 24 },
});
