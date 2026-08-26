import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Boton, Cargando, Pantalla } from '../../components';
import { usePerfil } from '../../viewmodels/usePerfil';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

/** VIEW 12 — Perfil (HU-06, HU-03). */
export default function PerfilView() {
  const router = useRouter();
  const { usuario, cargando, cerrarSesion } = usePerfil();

  if (cargando) return <Cargando />;

  async function onSalir() {
    await cerrarSesion();
    router.replace('/bienvenida');
  }

  return (
    <Pantalla titulo="Perfil">
      <Text style={e.nombre}>{usuario?.nombre}</Text>
      <Text style={e.carrera}>{usuario?.carrera}</Text>

      <View style={e.tarjeta}>
        <View style={{ flex: 1 }}>
          <Text style={e.clave}>Eco-puntos</Text>
          <Text style={e.valor}>{usuario?.ecoPuntos}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={e.clave}>Mejor racha</Text>
          <Text style={e.valor}>{usuario?.rachaMejor} días</Text>
        </View>
      </View>

      <Boton variante="suave" onPress={() => router.push('/guia')}>
        Guía de reciclaje
      </Boton>
      <View style={{ flex: 1 }} />
      <Boton variante="peligro" onPress={onSalir}>
        Cerrar sesión
      </Boton>
    </Pantalla>
  );
}

const e = StyleSheet.create({
  nombre: { fontSize: 20, fontWeight: '700', color: colores.tinta },
  carrera: { fontSize: tipografia.detalle, color: colores.tinta3 },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: colores.fondoSuave,
    borderRadius: radio.lg,
    padding: espacio.md,
    marginVertical: espacio.sm,
  },
  clave: { fontSize: 12.5, color: colores.tinta3 },
  valor: { fontSize: tipografia.subtitulo, fontWeight: '700', color: colores.tinta },
});
