import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, type CameraType, type FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
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
  // #47: cámara trasera/frontal y flash, guardados en el estado de la vista
  const [lado, setLado] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');

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
      // Sin skipProcessing: el módulo nativo aplica la orientación EXIF y la
      // foto llega derecha a la IA aunque el celular esté de lado (#49).
      const foto = await camara.current.takePictureAsync({ quality: 0.6 });
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
        <CameraView ref={camara} style={StyleSheet.absoluteFill} facing={lado} flash={flash} />
        <View style={e.marco} pointerEvents="none" />
      </View>
      <View style={e.controles}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={flash === 'on' ? 'Apagar el flash' : 'Encender el flash'}
          onPress={() => setFlash((f) => (f === 'on' ? 'off' : 'on'))}
          style={e.control}
        >
          <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={24} color={colores.acento} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tomar la foto"
          onPress={tomarFoto}
          disabled={capturando}
          style={({ pressed }) => [e.disparador, (pressed || capturando) && { opacity: 0.6 }]}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cambiar de cámara"
          onPress={() => setLado((l) => (l === 'back' ? 'front' : 'back'))}
          style={e.control}
        >
          <Ionicons name="camera-reverse-outline" size={26} color={colores.acento} />
        </Pressable>
      </View>
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
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: espacio.md,
  },
  control: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.acentoSuave,
  },
  disparador: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: colores.acentoSuave,
  },
});
