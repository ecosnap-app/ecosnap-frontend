import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Aviso, Boton, Cargando, Pantalla } from '../../components';
import { ETIQUETAS_CANECA, type Caneca } from '../../models';
import { useClasificacion } from '../../viewmodels/ClasificacionProvider';
import { colores, espacio, radio, tipografia } from '../../theme/tokens';

/** Cada caneca se pinta con su color real del código nacional. */
const FONDO: Record<Caneca, { fondo: string; texto: string }> = {
  blanca: { fondo: colores.canecaBlanca, texto: '#23302A' },
  negra: { fondo: colores.canecaNegra, texto: '#F2F1EC' },
  verde: { fondo: colores.canecaVerde, texto: '#FFFFFF' },
  especial: { fondo: colores.canecaEspecial, texto: '#FFFFFF' },
};

/**
 * VIEW 07 — Resultado de la IA (HU-08, HU-09).
 * Todo lo que muestra viene del ViewModel: no hay datos escritos a mano.
 */
export default function ResultadoView() {
  const router = useRouter();
  const { resultado, error, guardando, guardar, reiniciar } = useClasificacion();

  // Si alguien llega aquí sin resultado (por ejemplo recargando), lo devolvemos
  useEffect(() => {
    if (!resultado) router.replace('/clasificar');
  }, [resultado, router]);

  if (!resultado) return <Cargando />;

  const paleta = FONDO[resultado.caneca];
  const certeza = Math.round(resultado.confianza * 100);

  async function onGuardar() {
    const ok = await guardar();
    if (ok) {
      reiniciar();
      router.replace('/inicio');
    }
  }

  return (
    <Pantalla titulo={resultado.tipoResiduo} subtitulo={`Identificado con ${certeza}% de certeza`}>
      <ScrollView contentContainerStyle={{ gap: espacio.sm }}>
        {error ? <Aviso mensaje={error} /> : null}

        <View style={[e.veredicto, { backgroundColor: paleta.fondo }]}>
          <Text style={[e.clave, { color: paleta.texto }]}>VA EN LA</Text>
          <Text style={[e.valor, { color: paleta.texto }]}>
            {ETIQUETAS_CANECA[resultado.caneca]}
          </Text>
          <Text style={[e.explicacion, { color: paleta.texto }]}>{resultado.explicacion}</Text>
        </View>

        {resultado.instrucciones.length > 0 ? (
          <>
            <Text style={e.seccion}>Antes de botarlo</Text>
            {resultado.instrucciones.map((paso, i) => (
              <Text key={paso} style={e.paso}>
                {i + 1}. {paso}
              </Text>
            ))}
          </>
        ) : null}
      </ScrollView>

      <Boton onPress={onGuardar} cargando={guardando}>
        Guardar y sumar puntos
      </Boton>
      <Boton
        variante="suave"
        onPress={() => {
          reiniciar();
          router.replace('/clasificar');
        }}
      >
        Clasificar otro
      </Boton>
    </Pantalla>
  );
}

const e = StyleSheet.create({
  veredicto: { borderRadius: radio.lg, padding: espacio.md, gap: espacio.xs },
  clave: { fontSize: 11, letterSpacing: 1.4, opacity: 0.75 },
  valor: { fontSize: 26, fontWeight: '700' },
  explicacion: { fontSize: 14, lineHeight: 21, opacity: 0.9 },
  seccion: {
    fontSize: tipografia.detalle,
    fontWeight: '600',
    color: colores.tinta2,
    marginTop: espacio.sm,
  },
  paso: { fontSize: 14, color: colores.tinta2, lineHeight: 24 },
});
