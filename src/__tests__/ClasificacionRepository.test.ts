import { clasificacionRepository } from '../repositories/ClasificacionRepository';
import { ETIQUETAS_CANECA, type Caneca } from '../models';

/** Pruebas del flujo de clasificación (HU-08, HU-09, HU-15). */
describe('ClasificacionRepository', () => {
  const CANECAS_VALIDAS: Caneca[] = ['blanca', 'negra', 'verde', 'especial'];

  it('la clasificación devuelve una caneca del código de colores colombiano', async () => {
    const r = await clasificacionRepository.clasificar('foto.jpg', 'token');
    expect(CANECAS_VALIDAS).toContain(r.caneca);
  });

  it('siempre incluye explicación e instrucciones de preparación (HU-09)', async () => {
    const r = await clasificacionRepository.clasificar('foto.jpg', 'token');
    expect(r.explicacion.length).toBeGreaterThan(0);
    expect(r.instrucciones.length).toBeGreaterThan(0);
  });

  it('la confianza está entre 0 y 1', async () => {
    const r = await clasificacionRepository.clasificar('foto.jpg', 'token');
    expect(r.confianza).toBeGreaterThanOrEqual(0);
    expect(r.confianza).toBeLessThanOrEqual(1);
  });

  it('el historial devuelve resultados en la primera página (HU-15)', async () => {
    const items = await clasificacionRepository.historial('demo-1', 0);
    expect(items.length).toBeGreaterThan(0);
  });

  it('el historial se agota: la segunda página viene vacía (HU-15)', async () => {
    const items = await clasificacionRepository.historial('demo-1', 1);
    expect(items).toHaveLength(0);
  });

  it('toda caneca tiene una etiqueta legible para la interfaz', () => {
    CANECAS_VALIDAS.forEach((c) => {
      expect(ETIQUETAS_CANECA[c]).toBeTruthy();
    });
  });
});
