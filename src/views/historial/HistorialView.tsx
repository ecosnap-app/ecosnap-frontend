import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Aviso, Cargando, EnConstruccion, Pantalla } from '../../components';
import { ETIQUETAS_CANECA } from '../../models';
import { useHistorial } from '../../viewmodels/useHistorial';
import { colores, espacio, tipografia } from '../../theme/tokens';

/** VIEW 08 — Historial (HU-15). */
export default function HistorialView() {
  const { items, cargando, error, siguientePagina } = useHistorial();

  if (cargando && items.length === 0) return <Cargando mensaje="Cargando tu historial" />;

  return (
    <Pantalla titulo="Historial" subtitulo={`${items.length} residuos clasificados`}>
      {error ? <Aviso mensaje={error} /> : null}
      <FlatList
        data={items}
        keyExtractor={(c) => c.id}
        onEndReached={siguientePagina}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          <EnConstruccion nota="Sprint 3: tres registros de ejemplo con paginación real. Sprint 5: se conecta a la tabla clasificaciones." />
        }
        renderItem={({ item }) => (
          <View style={e.fila}>
            <View style={{ flex: 1 }}>
              <Text style={e.titulo}>{item.tipoResiduo}</Text>
              <Text style={e.detalle}>{ETIQUETAS_CANECA[item.caneca]}</Text>
            </View>
            <Text style={e.puntos}>+{item.puntos}</Text>
          </View>
        )}
      />
    </Pantalla>
  );
}

const e = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea,
  },
  titulo: { fontSize: tipografia.cuerpo, fontWeight: '600', color: colores.tinta },
  detalle: { fontSize: 12.5, color: colores.tinta3 },
  puntos: { color: colores.acento, fontSize: tipografia.detalle },
});
