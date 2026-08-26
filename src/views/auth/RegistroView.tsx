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

  async function onRegistrar() {
    const ok = await registrar(nombre.trim(), email.trim(), contrasena);
    if (ok) router.replace('/inicio');
  }

  return (
    <Pantalla titulo="Crear cuenta" subtitulo="Tus puntos quedan guardados en la nube">
      {error ? <Aviso mensaje={error} /> : null}
      <Campo etiqueta="Nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
      <Campo
        etiqueta="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Campo
        etiqueta="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        ayuda="Mínimo 8 caracteres."
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
