import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Sesion } from '../models';
import { authRepository } from '../repositories/AuthRepository';

/**
 * VIEWMODEL de sesión — es el que gobierna toda la autenticación (HU-01 a HU-05).
 *
 * Vive en un Context porque varias pantallas necesitan saber si hay sesión.
 * Es lo único que hay que tocar en el Sprint 4, y de hecho ya está completo:
 * cuando el .env tenga las llaves de Supabase, `authRepository` cambia solo
 * de implementación y este archivo sigue igual.
 */
interface EstadoSesion {
  sesion: Sesion | null;
  cargando: boolean;
  error: string | null;
  entrar(email: string, contrasena: string): Promise<boolean>;
  registrar(nombre: string, email: string, contrasena: string): Promise<boolean>;
  salir(): Promise<void>;
  limpiarError(): void;
}

const ContextoSesion = createContext<EstadoSesion | null>(null);

export function SesionProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // HU-04: al abrir la app se revisa si ya había una sesión guardada.
  useEffect(() => {
    let vivo = true;
    authRepository
      .sesionActual()
      .then((s) => vivo && setSesion(s))
      .catch(() => vivo && setSesion(null))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const entrar = useCallback(async (email: string, contrasena: string) => {
    setCargando(true);
    setError(null);
    try {
      setSesion(await authRepository.entrar(email, contrasena));
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos iniciar sesión.');
      return false;
    } finally {
      setCargando(false);
    }
  }, []);

  const registrar = useCallback(async (nombre: string, email: string, contrasena: string) => {
    setCargando(true);
    setError(null);
    try {
      setSesion(await authRepository.registrar(nombre, email, contrasena));
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos crear la cuenta.');
      return false;
    } finally {
      setCargando(false);
    }
  }, []);

  const salir = useCallback(async () => {
    await authRepository.salir();
    setSesion(null);
  }, []);

  const limpiarError = useCallback(() => setError(null), []);

  const valor = useMemo(
    () => ({ sesion, cargando, error, entrar, registrar, salir, limpiarError }),
    [sesion, cargando, error, entrar, registrar, salir, limpiarError]
  );

  return <ContextoSesion.Provider value={valor}>{children}</ContextoSesion.Provider>;
}

export function useSesion(): EstadoSesion {
  const ctx = useContext(ContextoSesion);
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  return ctx;
}
