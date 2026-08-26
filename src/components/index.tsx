import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colores, espacio, radio, tipografia } from '../theme/tokens';

/** Contenedor base de todas las pantallas. */
export function Pantalla({
  titulo,
  subtitulo,
  children,
}: {
  titulo?: string;
  subtitulo?: string;
  children?: React.ReactNode;
}) {
  return (
    <SafeAreaView style={e.pantalla} edges={['top', 'bottom']}>
      {titulo ? (
        <View style={e.encabezado}>
          <Text style={e.titulo}>{titulo}</Text>
          {subtitulo ? <Text style={e.subtitulo}>{subtitulo}</Text> : null}
        </View>
      ) : null}
      <View style={e.cuerpo}>{children}</View>
    </SafeAreaView>
  );
}

export function Boton({
  children,
  onPress,
  variante = 'principal',
  cargando = false,
  deshabilitado = false,
}: {
  children: string;
  onPress?: () => void;
  variante?: 'principal' | 'lima' | 'suave' | 'peligro';
  cargando?: boolean;
  deshabilitado?: boolean;
}) {
  const inactivo = deshabilitado || cargando;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactivo}
      onPress={onPress}
      style={({ pressed }) => [
        e.boton,
        variante === 'lima' && e.botonLima,
        variante === 'suave' && e.botonSuave,
        variante === 'peligro' && e.botonPeligro,
        (pressed || inactivo) && e.botonApagado,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={variante === 'principal' ? '#fff' : colores.acento} />
      ) : (
        <Text
          style={[
            e.botonTexto,
            variante === 'lima' && { color: colores.limaTinta },
            variante === 'suave' && { color: colores.acento },
            variante === 'peligro' && { color: colores.peligro },
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

export function Campo({
  etiqueta,
  ayuda,
  ...props
}: TextInputProps & { etiqueta: string; ayuda?: string }) {
  return (
    <View style={e.campo}>
      <Text style={e.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={e.input}
        placeholderTextColor={colores.tinta3}
        autoCapitalize="none"
        {...props}
      />
      {ayuda ? <Text style={e.ayuda}>{ayuda}</Text> : null}
    </View>
  );
}

export function Aviso({ mensaje, tipo = 'error' }: { mensaje: string; tipo?: 'error' | 'info' }) {
  return (
    <View style={[e.aviso, tipo === 'info' && e.avisoInfo]}>
      <Text style={[e.avisoTexto, tipo === 'info' && { color: colores.acento }]}>{mensaje}</Text>
    </View>
  );
}

export function Cargando({ mensaje }: { mensaje?: string }) {
  return (
    <View style={e.centrado}>
      <ActivityIndicator size="large" color={colores.acento} />
      {mensaje ? <Text style={e.cargandoTexto}>{mensaje}</Text> : null}
    </View>
  );
}

/** Marca visual de que la pantalla está en construcción (Sprint 3). */
export function EnConstruccion({ nota }: { nota: string }) {
  return (
    <View style={e.construccion}>
      <Text style={e.construccionTexto}>{nota}</Text>
    </View>
  );
}

const e = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  encabezado: { paddingHorizontal: espacio.md, paddingTop: espacio.sm, paddingBottom: espacio.xs },
  titulo: { fontSize: tipografia.titulo, fontWeight: '700', color: colores.tinta },
  subtitulo: { fontSize: tipografia.detalle, color: colores.tinta3, marginTop: 2 },
  cuerpo: { flex: 1, padding: espacio.md, gap: espacio.sm },

  boton: {
    backgroundColor: colores.acento,
    borderRadius: radio.md,
    paddingVertical: 15,
    paddingHorizontal: espacio.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  botonLima: { backgroundColor: colores.lima },
  botonSuave: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colores.linea },
  botonPeligro: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colores.peligro },
  botonApagado: { opacity: 0.6 },
  botonTexto: { color: '#fff', fontSize: tipografia.cuerpo, fontWeight: '600' },

  campo: { gap: espacio.xs },
  etiqueta: { fontSize: 12.5, color: colores.tinta3, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: colores.linea,
    borderRadius: radio.md,
    backgroundColor: colores.fondoSuave,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 14,
    color: colores.tinta,
  },
  ayuda: { fontSize: 12.5, color: colores.tinta3 },

  aviso: {
    backgroundColor: '#FBE9E7',
    borderRadius: radio.md,
    padding: espacio.sm + 2,
  },
  avisoInfo: { backgroundColor: colores.acentoSuave },
  avisoTexto: { color: colores.peligro, fontSize: tipografia.detalle },

  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacio.sm },
  cargandoTexto: { color: colores.tinta3, fontSize: tipografia.detalle },

  construccion: {
    borderWidth: 1,
    borderColor: colores.linea,
    borderStyle: 'dashed',
    borderRadius: radio.md,
    padding: espacio.md,
  },
  construccionTexto: { color: colores.tinta3, fontSize: tipografia.detalle, lineHeight: 19 },
});
