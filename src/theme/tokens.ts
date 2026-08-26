/**
 * Tokens de diseño de EcoSnap.
 * Los valores salen del prototipo de Figma (Sprint 2).
 */
export const colores = {
  acento: '#0F5D45',
  acentoSuave: '#DCEFE4',
  lima: '#C8E85C',
  limaTinta: '#3D4A10',

  canecaBlanca: '#E7E4DA',
  canecaNegra: '#33332F',
  canecaVerde: '#4F9A54',
  canecaEspecial: '#C96A34',

  peligro: '#B23A2E',

  fondo: '#FFFFFF',
  fondoSuave: '#F1F3EE',
  tinta: '#141815',
  tinta2: '#4A544D',
  tinta3: '#7C877F',
  linea: '#DDE2DA',
} as const;

export const espacio = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radio = {
  sm: 8,
  md: 12,
  lg: 18,
  completo: 999,
} as const;

export const tipografia = {
  titulo: 24,
  subtitulo: 18,
  cuerpo: 15,
  detalle: 13,
} as const;
