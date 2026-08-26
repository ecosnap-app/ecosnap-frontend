import type { PuestoRanking, Usuario } from '../models';
import { MODO_DEMO } from '../services/env';
import { exigirSupabase } from '../services/supabase';

/**
 * Repositorio de perfil, puntos y ranking (HU-06, HU-13, HU-14, HU-16, HU-17).
 */
export interface UsuarioRepository {
  perfil(usuarioId: string): Promise<Usuario>;
  ranking(): Promise<PuestoRanking[]>;
  miPosicion(usuarioId: string): Promise<PuestoRanking>;
  conteoPorCaneca(usuarioId: string): Promise<Record<string, number>>;
}

const TOP = 20;

class UsuarioRepositorySupabase implements UsuarioRepository {
  async perfil(usuarioId: string): Promise<Usuario> {
    const supabase = exigirSupabase();
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', usuarioId)
      .single();

    if (error || !data) throw new Error('No pudimos cargar tu perfil.');

    return {
      id: data.id as string,
      nombre: (data.nombre as string) ?? 'Estudiante',
      carrera: (data.carrera as string) ?? null,
      fotoUrl: (data.foto_url as string) ?? null,
      ecoPuntos: (data.eco_puntos as number) ?? 0,
      rachaActual: (data.racha_actual as number) ?? 0,
      rachaMejor: (data.racha_mejor as number) ?? 0,
      ultimaClasificacion: (data.ultima_clasificacion as string) ?? null,
      creadoEn: data.creado_en as string,
    };
  }

  /** HU-17: los 20 con más eco-puntos. */
  async ranking(): Promise<PuestoRanking[]> {
    const supabase = exigirSupabase();
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, foto_url, eco_puntos')
      .order('eco_puntos', { ascending: false })
      .limit(TOP);

    if (error) throw new Error('No pudimos cargar el ranking.');

    return (data ?? []).map((f, i) => ({
      posicion: i + 1,
      usuarioId: f.id as string,
      nombre: (f.nombre as string) ?? 'Estudiante',
      fotoUrl: (f.foto_url as string) ?? null,
      ecoPuntos: (f.eco_puntos as number) ?? 0,
    }));
  }

  /**
   * HU-17: la posición del usuario aunque no esté en el top.
   * Se calcula contando cuántos tienen más puntos que él.
   */
  async miPosicion(usuarioId: string): Promise<PuestoRanking> {
    const supabase = exigirSupabase();
    const yo = await this.perfil(usuarioId);

    const { count } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true })
      .gt('eco_puntos', yo.ecoPuntos);

    return {
      posicion: (count ?? 0) + 1,
      usuarioId,
      nombre: yo.nombre,
      fotoUrl: yo.fotoUrl,
      ecoPuntos: yo.ecoPuntos,
    };
  }

  /** HU-16: cuántos residuos por caneca, para la pantalla de impacto. */
  async conteoPorCaneca(usuarioId: string): Promise<Record<string, number>> {
    const supabase = exigirSupabase();
    const { data, error } = await supabase
      .from('clasificaciones')
      .select('caneca')
      .eq('usuario_id', usuarioId);

    if (error) throw new Error('No pudimos calcular tus estadísticas.');

    const conteo: Record<string, number> = { blanca: 0, negra: 0, verde: 0, especial: 0 };
    (data ?? []).forEach((f) => {
      const c = f.caneca as string;
      conteo[c] = (conteo[c] ?? 0) + 1;
    });
    return conteo;
  }
}

/* ------------------------------------------------------------------ */
/* Demo — usuario nuevo, sin datos inventados                          */
/* ------------------------------------------------------------------ */

class UsuarioRepositoryDemo implements UsuarioRepository {
  async perfil(usuarioId: string): Promise<Usuario> {
    await new Promise((r) => setTimeout(r, 250));
    return {
      id: usuarioId,
      nombre: 'Estudiante',
      carrera: 'Ingeniería de Sistemas',
      fotoUrl: null,
      ecoPuntos: 0,
      rachaActual: 0,
      rachaMejor: 0,
      ultimaClasificacion: null,
      creadoEn: new Date().toISOString(),
    };
  }

  async ranking(): Promise<PuestoRanking[]> {
    await new Promise((r) => setTimeout(r, 250));
    return [];
  }

  async miPosicion(usuarioId: string): Promise<PuestoRanking> {
    return { posicion: 1, usuarioId, nombre: 'Estudiante', fotoUrl: null, ecoPuntos: 0 };
  }

  async conteoPorCaneca(): Promise<Record<string, number>> {
    return { blanca: 0, negra: 0, verde: 0, especial: 0 };
  }
}

export const usuarioRepository: UsuarioRepository = MODO_DEMO
  ? new UsuarioRepositoryDemo()
  : new UsuarioRepositorySupabase();
