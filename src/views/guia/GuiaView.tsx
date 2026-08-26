import { StyleSheet, Text, View } from 'react-native';
import { Pantalla } from '../../components';
import { colores, espacio, tipografia } from '../../theme/tokens';

const CANECAS = [
  { color: colores.canecaBlanca, nombre: 'Blanca', que: 'Plástico, vidrio, cartón y metal limpios' },
  { color: colores.canecaVerde, nombre: 'Verde', que: 'Restos de comida y residuos de jardín' },
  { color: colores.canecaNegra, nombre: 'Negra', que: 'Servilletas, papel higiénico, icopor sucio' },
  { color: colores.canecaEspecial, nombre: 'Punto especial', que: 'Pilas, medicamentos y electrónicos' },
];

/** VIEW 11 — Guía de reciclaje (HU-11). Debe funcionar sin conexión. */
export default function GuiaView() {
  return (
    <Pantalla titulo="Guía de reciclaje" subtitulo="Funciona sin internet">
      {CANECAS.map((c) => (
        <View key={c.nombre} style={e.fila}>
          <View style={[e.punto, { backgroundColor: c.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={e.nombre}>{c.nombre}</Text>
            <Text style={e.que}>{c.que}</Text>
          </View>
        </View>
      ))}
    </Pantalla>
  );
}

const e = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.sm + 4,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea,
  },
  punto: { width: 16, height: 16, borderRadius: 3, borderWidth: 1, borderColor: colores.linea },
  nombre: { fontSize: tipografia.cuerpo, fontWeight: '600', color: colores.tinta },
  que: { fontSize: 12.5, color: colores.tinta3 },
});
