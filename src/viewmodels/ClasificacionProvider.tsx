import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ResultadoClasificacion } from '../models';
import { clasificacionRepository } from '../repositories/ClasificacionRepository';
import { useSesion } from './SesionProvider';

/**
 * VIEWMODEL del flujo de clasificación (HU-07 a HU-10, HU-12).
 *
 * Vive en un Context, no en un hook suelto, porque el flujo atraviesa tres
 * pantallas: Clasificar toma la foto, Analizando espera, y Resultado muestra
 * lo que respondió la IA. Si cada pantalla creara su propia instancia del
 * estado, el resultado se perdería al navegar.
 */
export type EstadoClasificacion = 'inactivo' | 'analizando' | 'listo' | 'error';

interface Contexto {
  estado: EstadoClasificacion;
  resultado: ResultadoClasificacion | null;
  error: string | null;
  fotoUri: string | null;
  guardando: boolean;
  clasificar(uri: string): Promise<void>;
  guardar(): Promise<boolean>;
  reiniciar(): void;
}

const ContextoClasificacion = createContext<Contexto | null>(null);

export function ClasificacionProvider({ children }: { children: React.ReactNode }) {
  const { sesion } = useSesion();
  const [estado, setEstado] = useState<EstadoClasificacion>('inactivo');
  const [resultado, setResultado] = useState<ResultadoClasificacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const clasificar = useCallback(
    async (uri: string) => {
      if (!sesion) return;
      setFotoUri(uri);
      setEstado('analizando');
      setError(null);
      setResultado(null);
      try {
        setResultado(await clasificacionRepository.clasificar(uri, sesion.token));
        setEstado('listo');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No pudimos analizar la foto.');
        setEstado('error');
      }
    },
    [sesion]
  );

  const guardar = useCallback(async () => {
    if (!sesion || !resultado || !fotoUri) return false;
    setGuardando(true);
    try {
      await clasificacionRepository.guardar(resultado, fotoUri, sesion.token);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos guardar la clasificación.');
      return false;
    } finally {
      setGuardando(false);
    }
  }, [sesion, resultado, fotoUri]);

  const reiniciar = useCallback(() => {
    setEstado('inactivo');
    setResultado(null);
    setError(null);
    setFotoUri(null);
  }, []);

  const valor = useMemo(
    () => ({ estado, resultado, error, fotoUri, guardando, clasificar, guardar, reiniciar }),
    [estado, resultado, error, fotoUri, guardando, clasificar, guardar, reiniciar]
  );

  return (
    <ContextoClasificacion.Provider value={valor}>{children}</ContextoClasificacion.Provider>
  );
}

export function useClasificacion(): Contexto {
  const ctx = useContext(ContextoClasificacion);
  if (!ctx) throw new Error('useClasificacion debe usarse dentro de <ClasificacionProvider>');
  return ctx;
}
