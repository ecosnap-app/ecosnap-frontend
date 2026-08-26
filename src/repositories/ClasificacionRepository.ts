import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import type { Caneca, Clasificacion, ResultadoClasificacion } from '../models';
import { MODO_DEMO } from '../services/env';
import { pedirApi } from '../services/apiClient';
import { exigirSupabase } from '../services/supabase';

/**
 * Repositorio de clasificaciones (HU-08, HU-09, HU-10, HU-15).
 *
 * Es la única puerta entre la app y la nube para este módulo. Ni la vista ni
 * el ViewModel saben si por debajo hay datos de ejemplo o PostgreSQL.
 */
export interface ClasificacionRepository {
  clasificar(fotoUri: string, token: string): Promise<ResultadoClasificacion>;
  guardar(resultado: ResultadoClasificacion, fotoUri: string, token: string): Promise<void>;
  historial(usuarioId: string, pagina: number): Promise<Clasificacion[]>;
}

const POR_PAGINA = 20;

/** Lee una foto del dispositivo y la devuelve en base64. */
async function leerBase64(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
}

/* ------------------------------------------------------------------ */
/* Implementación real — habla con el BFF y con Supabase               */
/* ------------------------------------------------------------------ */

class ClasificacionRepositorySupabase implements ClasificacionRepository {
  /** Manda la foto al BFF, que consulta a Gemini y devuelve el veredicto. */
  async clasificar(fotoUri: string, token: string): Promise<ResultadoClasificacion> {
    const imagenBase64 = await leerBase64(fotoUri);
    return pedirApi<ResultadoClasificacion>('/api/classify', {
      method: 'POST',
      token,
      body: JSON.stringify({ imagenBase64 }),
    });
  }

  /**
   * Sube la foto a Storage y registra la clasificación.
   *
   * El insert, la suma de eco-puntos y el recálculo de la racha ocurren
   * dentro de una sola transacción de PostgreSQL (la función
   * registrar_clasificacion), así que nunca queda una clasificación
   * guardada sin sus puntos.
   */
  async guardar(
    resultado: ResultadoClasificacion,
    fotoUri: string,
    _token: string
  ): Promise<void> {
    const supabase = exigirSupabase();
    const { data: sesion } = await supabase.auth.getUser();
    const usuarioId = sesion.user?.id;
    if (!usuarioId) throw new Error('Tu sesión expiró. Vuelve a entrar.');

    let fotoUrl = '';
    try {
      const base64 = await leerBase64(fotoUri);
      const ruta = `${usuarioId}/${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from('residuos')
        .upload(ruta, decode(base64), { contentType: 'image/jpeg', upsert: false });
      if (!error) {
        fotoUrl = supabase.storage.from('residuos').getPublicUrl(ruta).data.publicUrl;
      }
    } catch {
      // Si la foto no se puede subir, igual guardamos la clasificación:
      // perder la miniatura duele menos que perder los puntos del usuario.
    }

    const { error } = await supabase.rpc('registrar_clasificacion', {
      p_usuario: usuarioId,
      p_foto: fotoUrl,
      p_tipo: resultado.tipoResiduo,
      p_caneca: resultado.caneca,
      p_explicacion: resultado.explicacion,
      p_instrucciones: resultado.instrucciones,
      p_puntos: resultado.caneca === 'especial' ? 15 : 10,
    });
    if (error) throw new Error('No pudimos guardar la clasificación.');
  }

  /** HU-15: historial paginado, del más reciente al más antiguo. */
  async historial(usuarioId: string, pagina: number): Promise<Clasificacion[]> {
    const supabase = exigirSupabase();
    const desde = pagina * POR_PAGINA;

    const { data, error } = await supabase
      .from('clasificaciones')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('creado_en', { ascending: false })
      .range(desde, desde + POR_PAGINA - 1);

    if (error) throw new Error('No pudimos cargar tu historial.');

    return (data ?? []).map((f) => ({
      id: f.id as string,
      usuarioId: f.usuario_id as string,
      fotoUrl: (f.foto_url as string) ?? '',
      tipoResiduo: f.tipo_residuo as string,
      caneca: f.caneca as Caneca,
      explicacion: (f.explicacion as string) ?? '',
      instrucciones: (f.instrucciones as string[]) ?? [],
      puntos: f.puntos as number,
      creadoEn: f.creado_en as string,
    }));
  }
}

/* ------------------------------------------------------------------ */
/* Implementación de demo — solo cuando falta configurar el .env       */
/* ------------------------------------------------------------------ */

class ClasificacionRepositoryDemo implements ClasificacionRepository {
  private guardadas: Clasificacion[] = [];

  async clasificar(_fotoUri: string, _token: string): Promise<ResultadoClasificacion> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      tipoResiduo: 'Botella PET',
      caneca: 'blanca',
      explicacion: 'El plástico PET limpio es aprovechable y sí se recicla en Colombia.',
      instrucciones: [
        'Enjuágala con un poco de agua',
        'Aplástala para que ocupe menos',
        'Deja la tapa puesta, también se recicla',
      ],
      confianza: 0.94,
    };
  }

  async guardar(resultado: ResultadoClasificacion, fotoUri: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 400));
    this.guardadas.unshift({
      id: String(this.guardadas.length + 1),
      usuarioId: 'demo-1',
      fotoUrl: fotoUri,
      tipoResiduo: resultado.tipoResiduo,
      caneca: resultado.caneca,
      explicacion: resultado.explicacion,
      instrucciones: resultado.instrucciones,
      puntos: resultado.caneca === 'especial' ? 15 : 10,
      creadoEn: new Date().toISOString(),
    });
  }

  async historial(_usuarioId: string, pagina: number): Promise<Clasificacion[]> {
    await new Promise((r) => setTimeout(r, 300));
    return pagina === 0 ? this.guardadas : [];
  }
}

export const clasificacionRepository: ClasificacionRepository = MODO_DEMO
  ? new ClasificacionRepositoryDemo()
  : new ClasificacionRepositorySupabase();
