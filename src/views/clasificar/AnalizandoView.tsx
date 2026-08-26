import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Aviso, Boton, Cargando, Pantalla } from '../../components';
import { useClasificacion } from '../../viewmodels/ClasificacionProvider';

/**
 * VIEW 06 — Analizando (HU-08, HU-12).
 *
 * Solo observa el estado del ViewModel. Cuando la IA responde, navega al
 * resultado; si falla, ofrece reintentar sin sacar al usuario del flujo.
 */
export default function AnalizandoView() {
  const router = useRouter();
  const { estado, error, fotoUri, clasificar, reiniciar } = useClasificacion();

  useEffect(() => {
    if (estado === 'listo') router.replace('/resultado');
  }, [estado, router]);

  if (estado === 'error') {
    return (
      <Pantalla titulo="No pudimos analizarla" subtitulo="Puede ser la conexión o la foto">
        <Aviso mensaje={error ?? 'Ocurrió un error inesperado.'} />
        <Boton onPress={() => fotoUri && clasificar(fotoUri)}>Reintentar</Boton>
        <Boton
          variante="suave"
          onPress={() => {
            reiniciar();
            router.replace('/clasificar');
          }}
        >
          Tomar otra foto
        </Boton>
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Cargando mensaje="Identificando el residuo…" />
    </Pantalla>
  );
}
