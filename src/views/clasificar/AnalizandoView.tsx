import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Cargando, Pantalla } from '../../components';
import { useClasificacion } from '../../viewmodels/useClasificacion';

/** VIEW 06 — Analizando (HU-08, HU-12). */
export default function AnalizandoView() {
  const router = useRouter();
  const { estado, clasificar } = useClasificacion();

  useEffect(() => {
    void clasificar('foto-de-demo.jpg');
  }, [clasificar]);

  useEffect(() => {
    if (estado === 'listo') router.replace('/resultado');
  }, [estado, router]);

  return (
    <Pantalla>
      <Cargando mensaje="Identificando el residuo…" />
    </Pantalla>
  );
}
