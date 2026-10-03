import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Aviso, Boton, Campo, Pantalla } from '../../components';
import { useSesion } from '../../viewmodels/SesionProvider';

/** VIEW 03 — Crear cuenta (HU-01). */
export default function RegistroView() {
  const router = useRouter();
  const { registrar, cargando, error } = useSesion();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  async function onRegistrar() {
    // #30: no se llama al registro si las dos contraseñas no son iguales
    if (contrasena !== confirmacion) {
      setErrorLocal('Las contraseñas no coinciden.');
      return;
    }
    setErrorLocal(null);
    const ok = await registrar(nombre.trim(), email.trim(), contrasena);
    if (ok) router.replace('/inicio');
  }

  return (
    <Pantalla titulo="Crear cuenta" subtitulo="Tus puntos quedan guardados en la nube">
      {errorLocal || error ? <Aviso mensaje={errorLocal ?? error ?? ''} /> : null}
      <Campo etiqueta="Nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
      <Campo
        etiqueta="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />
      <Campo
        etiqueta="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        ayuda="Mínimo 8 caracteres."
      />
      <Campo
        etiqueta="Confirmar contraseña"
        value={confirmacion}
        onChangeText={setConfirmacion}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
      />
      <View style={{ height: 8 }} />
      <Boton onPress={onRegistrar} cargando={cargando}>
        Crear cuenta
      </Boton>
      <Boton variante="suave" onPress={() => router.push('/login')}>
        Ya tengo cuenta
      </Boton>
    </Pantalla>
  );
}
