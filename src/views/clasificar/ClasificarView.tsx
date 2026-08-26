import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Boton, Cargando, Pantalla } from '../../components';
import { useClasificacion } from '../../viewmodels/ClasificacionProvider';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

/**
 * VIEW 05 — Cámara (HU-07).
 *
 * Tres estados posibles: pidiendo permiso, permiso denegado, y cámara lista.
 * La vista no sabe qué pasa con la foto: se la entrega al ViewModel y navega.
 */
export default function ClasificarView() {
  const router = useRouter();
  const { clasificar } = useClasificacion();
  const [permiso, pedirPermiso] = useCameraPermissions();
  const camara = useRef<CameraView>(null);
  const [capturando, setCapturando] = useState(false);

  // Todavía no sabemos si hay permiso
  if (!permiso) return <Cargando />;

  // HU-07: si el permiso está denegado, explicamos para qué lo necesitamos
  if (!permiso.granted) {
    return (
      <Pantalla titulo="Necesitamos la cámara" subtitulo="Es como EcoSnap identifica el residuo">
        <View style={e.centro}>
          <Text style={e.explicacion}>
            Para saber en qué caneca va un residuo tenemos que verlo. La foto se
            envía a la nube solo para clasificarla y queda guardada en tu historial.
          </Text>
        </View>
        <Boton onPress={pedirPermiso}>Permitir el uso de la cámara</Boton>
        <Boton variante="suave" onPress={() => router.back()}>
          Ahora no
        </Boton>
      </Pantalla>
    );
  }

  async function tomarFoto() {
    if (!camara.current || capturando) return;
    setCapturando(true);
    try {
      const foto = await camara.current.takePictureAsync({ quality: 0.6, skipProcessing: true });
      if (!foto?.uri) throw new Error('sin foto');
      router.push('/analizando');
      void clasificar(foto.uri);
    } catch {
      setCapturando(false);
    }
  }

  return (
    <Pantalla titulo="Clasificar" subtitulo="Centra el residuo en el marco">
      <View style={e.visor}>
        <CameraView ref={camara} style={StyleSheet.absoluteFill} facing="back" />
        <View style={e.marco} pointerEvents="none" />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tomar la foto"
        onPress={tomarFoto}
        disabled={capturando}
        style={({ pressed }) => [e.disparador, (pressed || capturando) && { opacity: 0.6 }]}
      />
    </Pantalla>
  );
}

const e = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center' },
  explicacion: { fontSize: tipografia.cuerpo, color: colores.tinta2, lineHeight: 23 },
  visor: {
    flex: 1,
    backgroundColor: '#1B2822',
    borderRadius: radio.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marco: {
    width: 210,
    height: 210,
    borderWidth: 2,
    borderColor: colores.lima,
    borderStyle: 'dashed',
    borderRadius: radio.lg,
  },
  disparador: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: colores.acentoSuave,
    marginTop: espacio.md,
  },
});
