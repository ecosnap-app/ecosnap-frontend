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

  it('un usuario nuevo empieza con el historial vacío (HU-15)', async () => {
    const items = await clasificacionRepository.historial('demo-1', 0);
    expect(items).toHaveLength(0);
  });

  it('lo que se guarda aparece de primero en el historial (HU-10, HU-15)', async () => {
    const r = await clasificacionRepository.clasificar('foto.jpg', 'token');
    await clasificacionRepository.guardar(r, 'foto.jpg', 'token');
    const items = await clasificacionRepository.historial('demo-1', 0);
    expect(items[0].tipoResiduo).toBe(r.tipoResiduo);
    expect(items[0].puntos).toBeGreaterThan(0);
  });

  it('los residuos peligrosos valen más puntos (HU-13)', async () => {
    const especial = {
      tipoResiduo: 'Pila AA',
      caneca: 'especial' as const,
      explicacion: 'Residuo peligroso.',
      instrucciones: ['Llévala al punto de recolección'],
      confianza: 0.9,
    };
    await clasificacionRepository.guardar(especial, 'foto.jpg', 'token');
    const items = await clasificacionRepository.historial('demo-1', 0);
    expect(items[0].puntos).toBe(15);
  });

  it('toda caneca tiene una etiqueta legible para la interfaz', () => {
    CANECAS_VALIDAS.forEach((c) => {
      expect(ETIQUETAS_CANECA[c]).toBeTruthy();
    });
  });
});
