import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Aviso, Cargando, Pantalla } from '../../components';
import { useRanking } from '../../viewmodels/useRanking';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

/** VIEW 10 — Ranking (HU-17). */
export default function RankingView() {
  const { top, miPuesto, cargando, error } = useRanking();

  if (cargando) return <Cargando mensaje="Cargando el ranking" />;

  return (
    <Pantalla titulo="Ranking" subtitulo="Esta semana en el campus">
      {error ? <Aviso mensaje={error} /> : null}
      <ScrollView contentContainerStyle={{ gap: 2 }}>
        {top.length === 0 ? (
          <View style={e.vacio}>
            <Text style={e.vacioTitulo}>El ranking está vacío</Text>
            <Text style={e.vacioTexto}>
              Sé el primero: clasifica un residuo y aparecerás de una vez en la lista.
            </Text>
          </View>
        ) : null}
        {top.map((p) => (
          <View key={p.usuarioId} style={e.fila}>
            <Text style={e.posicion}>{p.posicion}</Text>
            <Text style={e.nombre}>{p.nombre}</Text>
            <Text style={e.puntos}>{p.ecoPuntos}</Text>
          </View>
        ))}
        {miPuesto ? (
          <>
            <Text style={e.seccion}>Tu posición</Text>
            <View style={[e.fila, e.filaMia]}>
              <Text style={e.posicion}>{miPuesto.posicion}</Text>
              <Text style={e.nombre}>{miPuesto.nombre}</Text>
              <Text style={e.puntos}>{miPuesto.ecoPuntos}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </Pantalla>
  );
}

const e = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.sm + 4,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea,
  },
  filaMia: {
    backgroundColor: colores.acentoSuave,
    borderWidth: 1,
    borderColor: colores.acento,
    borderRadius: radio.md,
    paddingHorizontal: 12,
  },
  posicion: { width: 22, color: colores.tinta3, fontSize: tipografia.detalle },
  nombre: { flex: 1, fontSize: tipografia.cuerpo, fontWeight: '600', color: colores.tinta },
  puntos: { color: colores.acento, fontSize: tipografia.detalle },
  seccion: { fontSize: tipografia.detalle, fontWeight: '600', color: colores.tinta2, marginTop: espacio.md },
  vacio: { paddingVertical: espacio.xl, gap: espacio.sm },
  vacioTitulo: { fontSize: tipografia.subtitulo, fontWeight: '600', color: colores.tinta },
  vacioTexto: { fontSize: tipografia.cuerpo, color: colores.tinta2, lineHeight: 22 },
});
