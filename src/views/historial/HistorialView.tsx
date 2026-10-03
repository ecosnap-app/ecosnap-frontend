import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Aviso, Cargando, EmptyState, Pantalla } from '../../components';
import { ETIQUETAS_CANECA } from '../../models';
import { useHistorial } from '../../viewmodels/useHistorial';
import { colores, tipografia } from '../../theme/tokens';

/** VIEW 08 — Historial (HU-15). */
export default function HistorialView() {
  const { items, cargando, error, siguientePagina, refrescando, refrescar } = useHistorial();

  if (cargando && items.length === 0) return <Cargando mensaje="Cargando tu historial" />;

  return (
    <Pantalla titulo="Historial" subtitulo={`${items.length} residuos clasificados`}>
      {error ? <Aviso mensaje={error} /> : null}
      <FlatList
        data={items}
        keyExtractor={(c) => c.id}
        onEndReached={siguientePagina}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={refrescar}
            colors={[colores.acento]}
            tintColor={colores.acento}
          />
        }
        ListEmptyComponent={
          <EmptyState
            titulo="Tu historial está vacío"
            texto="Cada residuo que clasifiques queda guardado aquí con su caneca y sus puntos."
          />
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
