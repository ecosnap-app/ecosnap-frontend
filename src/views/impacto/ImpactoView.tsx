import { StyleSheet, Text, View } from 'react-native';
import { Aviso, Cargando, Pantalla } from '../../components';
import { useImpacto } from '../../viewmodels/useImpacto';
import { colores, espacio, tipografia } from '../../theme/tokens';

const CANECAS = [
  { clave: 'blanca', nombre: 'Blanca', color: colores.acento },
  { clave: 'negra', nombre: 'Negra', color: colores.canecaNegra },
  { clave: 'verde', nombre: 'Verde', color: colores.canecaVerde },
  { clave: 'especial', nombre: 'Especial', color: colores.canecaEspecial },
];

/** VIEW 09 — Mi impacto (HU-16). Los números salen del ViewModel. */
export default function ImpactoView() {
  const { conteo, total, cargando, error } = useImpacto();

  if (cargando) return <Cargando mensaje="Calculando tu impacto" />;

  return (
    <Pantalla titulo="Mi impacto" subtitulo={`${total} residuos clasificados en total`}>
      {error ? <Aviso mensaje={error} /> : null}

      {total === 0 ? (
        <View style={e.vacio}>
          <Text style={e.vacioTitulo}>Todavía no has clasificado nada</Text>
          <Text style={e.vacioTexto}>
            Cuando fotografíes tu primer residuo, aquí vas a ver cómo se reparte
            lo que reciclas entre las cuatro canecas.
          </Text>
        </View>
      ) : (
        <>
          <Text style={e.seccion}>Por caneca</Text>
          {CANECAS.map((c) => {
            const valor = conteo[c.clave] ?? 0;
            const ancho = total > 0 ? Math.round((valor / total) * 100) : 0;
            return (
              <View key={c.clave} style={e.fila}>
                <Text style={e.clave}>{c.nombre}</Text>
                <View style={e.riel}>
                  <View style={[e.relleno, { width: `${ancho}%`, backgroundColor: c.color }]} />
                </View>
                <Text style={e.valor}>{valor}</Text>
              </View>
            );
          })}
        </>
      )}
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
  vacio: { flex: 1, justifyContent: 'center', gap: espacio.sm },
  vacioTitulo: { fontSize: tipografia.subtitulo, fontWeight: '600', color: colores.tinta },
  vacioTexto: { fontSize: tipografia.cuerpo, color: colores.tinta2, lineHeight: 22 },
});
