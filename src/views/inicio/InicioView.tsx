import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Boton, Cargando, EnConstruccion, Pantalla } from '../../components';
import { ETIQUETAS_CANECA } from '../../models';
import { useInicio } from '../../viewmodels/useInicio';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

/** VIEW 04 — Inicio (HU-13, HU-14). */
export default function InicioView() {
  const router = useRouter();
  const { usuario, recientes, cargando } = useInicio();

  if (cargando) return <Cargando mensaje="Cargando tus datos" />;

  return (
    <Pantalla titulo={`Hola, ${usuario?.nombre.split(' ')[0] ?? ''}`} subtitulo="Jueves 20 de agosto">
      <ScrollView contentContainerStyle={{ gap: espacio.sm }}>
        <View style={e.tarjeta}>
          <Text style={e.etiqueta}>ECO-PUNTOS</Text>
          <Text style={e.numero}>{usuario?.ecoPuntos ?? 0}</Text>
          <View style={e.racha}>
            <Text style={e.rachaTexto}>{usuario?.rachaActual ?? 0} días seguidos</Text>
          </View>
        </View>

        <Boton variante="lima" onPress={() => router.push('/clasificar')}>
          Clasificar un residuo
        </Boton>

        <Text style={e.seccion}>Lo último que clasificaste</Text>
        {recientes.map((c) => (
          <View key={c.id} style={e.item}>
            <View style={{ flex: 1 }}>
              <Text style={e.itemTitulo}>{c.tipoResiduo}</Text>
              <Text style={e.itemDetalle}>{ETIQUETAS_CANECA[c.caneca]}</Text>
            </View>
            <Text style={e.puntos}>+{c.puntos}</Text>
          </View>
        ))}

        <Boton variante="suave" onPress={() => router.push('/impacto')}>
          Ver mi impacto
        </Boton>

        <EnConstruccion nota="Sprint 3: la pantalla ya recibe datos del ViewModel. En el Sprint 4 el usuario vendrá de Supabase en vez del repositorio de demo." />
      </ScrollView>
    </Pantalla>
  );
}

const e = StyleSheet.create({
  tarjeta: { backgroundColor: colores.acento, borderRadius: radio.lg, padding: espacio.md },
  etiqueta: { color: '#fff', opacity: 0.8, fontSize: 11.5, letterSpacing: 1 },
  numero: { color: '#fff', fontSize: 44, fontWeight: '700' },
  racha: {
    alignSelf: 'flex-start',
    marginTop: espacio.sm,
    backgroundColor: 'rgba(255,255,255,0.17)',
    borderRadius: radio.completo,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  rachaTexto: { color: '#fff', fontSize: tipografia.detalle, fontWeight: '600' },
  seccion: { fontSize: tipografia.detalle, fontWeight: '600', color: colores.tinta2, marginTop: espacio.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea,
  },
  itemTitulo: { fontSize: tipografia.cuerpo, fontWeight: '600', color: colores.tinta },
  itemDetalle: { fontSize: 12.5, color: colores.tinta3 },
  puntos: { color: colores.acento, fontSize: tipografia.detalle },
});
