import { StyleSheet, Text, View } from 'react-native';
import { EnConstruccion, Pantalla } from '../../components';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

const BARRAS = [
  { caneca: 'Blanca', valor: 21, ancho: '58%', color: colores.acento },
  { caneca: 'Negra', valor: 8, ancho: '22%', color: colores.canecaNegra },
  { caneca: 'Verde', valor: 5, ancho: '14%', color: colores.canecaVerde },
  { caneca: 'Especial', valor: 2, ancho: '6%', color: colores.canecaEspecial },
];

/** VIEW 09 — Mi impacto (HU-16). */
export default function ImpactoView() {
  return (
    <Pantalla titulo="Mi impacto" subtitulo="Últimos 7 días">
      <Text style={e.seccion}>Por caneca</Text>
      {BARRAS.map((b) => (
        <View key={b.caneca} style={e.fila}>
          <Text style={e.clave}>{b.caneca}</Text>
          <View style={e.riel}>
            <View style={[e.relleno, { width: b.ancho as `${number}%`, backgroundColor: b.color }]} />
          </View>
          <Text style={e.valor}>{b.valor}</Text>
        </View>
      ))}
      <EnConstruccion nota="Sprint 3: datos de ejemplo. Sprint 5: se calcula con un GROUP BY sobre la tabla clasificaciones." />
    </Pantalla>
  );
}

const e = StyleSheet.create({
  seccion: { fontSize: tipografia.detalle, fontWeight: '600', color: colores.tinta2 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.sm + 3 },
  clave: { width: 70, fontSize: tipografia.detalle, color: colores.tinta2 },
  riel: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colores.fondoSuave, overflow: 'hidden' },
  relleno: { height: '100%', borderRadius: 5 },
  valor: { width: 26, textAlign: 'right', fontSize: tipografia.detalle, color: colores.tinta2 },
});
