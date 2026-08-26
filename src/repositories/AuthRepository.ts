import type { Sesion } from '../models';
import { MODO_DEMO } from '../services/env';
import { supabase } from '../services/supabase';

/**
 * Contrato del repositorio de autenticación.
 *
 * La View y el ViewModel solo conocen esta interfaz. Si mañana el curso
 * exigiera cambiar Supabase por AWS Cognito, se escribe otra implementación
 * de esta misma interfaz y nada más del proyecto se entera.
 */
export interface AuthRepository {
  sesionActual(): Promise<Sesion | null>;
  entrar(email: string, contrasena: string): Promise<Sesion>;
  registrar(nombre: string, email: string, contrasena: string): Promise<Sesion>;
  salir(): Promise<void>;
  recuperarContrasena(email: string): Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Implementación de demo — Sprint 3                                   */
/* Permite demostrar la navegación sin tener la nube configurada.      */
/* ------------------------------------------------------------------ */

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

class AuthRepositoryDemo implements AuthRepository {
  private sesion: Sesion | null = null;

  async sesionActual(): Promise<Sesion | null> {
    await esperar(300);
    return this.sesion;
  }

  async entrar(email: string, contrasena: string): Promise<Sesion> {
    await esperar(600);
    if (!email.includes('@') || contrasena.length < 8) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    this.sesion = { usuarioId: 'demo-1', email, token: 'token-de-demo' };
    return this.sesion;
  }

  async registrar(_nombre: string, email: string, contrasena: string): Promise<Sesion> {
    await esperar(600);
    if (contrasena.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }
    this.sesion = { usuarioId: 'demo-1', email, token: 'token-de-demo' };
    return this.sesion;
  }

  async salir(): Promise<void> {
    await esperar(200);
    this.sesion = null;
  }

  async recuperarContrasena(_email: string): Promise<void> {
    await esperar(400);
  }
}

/* ------------------------------------------------------------------ */
/* Implementación real con Supabase — Sprint 4                         */
/* Ya está escrita: se activa sola cuando el .env tenga las llaves.    */
/* ------------------------------------------------------------------ */

class AuthRepositorySupabase implements AuthRepository {
  async sesionActual(): Promise<Sesion | null> {
    const { data } = await supabase!.auth.getSession();
    if (!data.session) return null;
    return {
      usuarioId: data.session.user.id,
      email: data.session.user.email ?? '',
      token: data.session.access_token,
    };
  }

  async entrar(email: string, contrasena: string): Promise<Sesion> {
    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password: contrasena,
    });
    if (error || !data.session) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    return {
      usuarioId: data.session.user.id,
      email: data.session.user.email ?? '',
      token: data.session.access_token,
    };
  }

  async registrar(nombre: string, email: string, contrasena: string): Promise<Sesion> {
    const { data, error } = await supabase!.auth.signUp({
      email,
      password: contrasena,
      options: { data: { nombre } },
    });
    if (error) {
      throw new Error(
        error.message.includes('already')
          ? 'Ese correo ya está registrado.'
          : 'No pudimos crear la cuenta. Intenta de nuevo.'
      );
    }
    if (!data.session) {
      throw new Error('Revisa tu correo para confirmar la cuenta.');
    }
    return {
      usuarioId: data.session.user.id,
      email: data.session.user.email ?? '',
      token: data.session.access_token,
    };
  }

  async salir(): Promise<void> {
    await supabase!.auth.signOut();
  }

  async recuperarContrasena(email: string): Promise<void> {
    await supabase!.auth.resetPasswordForEmail(email);
  }
}

/** El resto de la app importa solo esta constante. */
export const authRepository: AuthRepository = MODO_DEMO
  ? new AuthRepositoryDemo()
  : new AuthRepositorySupabase();
