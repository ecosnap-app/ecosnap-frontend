import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Aviso, Boton, Campo, Pantalla } from '../../components';
import { useSesion } from '../../viewmodels/SesionProvider';

/** VIEW 02 — Iniciar sesión (HU-02). */
export default function LoginView() {
  const router = useRouter();
  const { entrar, cargando, error } = useSesion();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  async function onEntrar() {
    const ok = await entrar(email.trim(), contrasena);
    if (ok) router.replace('/inicio');
  }

  return (
    <Pantalla titulo="Hola de nuevo" subtitulo="Tu racha te está esperando">
      {error ? <Aviso mensaje={error} /> : null}
      <Campo
        etiqueta="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="tucorreo@correo.edu.co"
      />
      <Campo
        etiqueta="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        placeholder="Mínimo 8 caracteres"
      />
      <View style={{ height: 8 }} />
      <Boton onPress={onEntrar} cargando={cargando}>
        Entrar
      </Boton>
      <Boton variante="suave" onPress={() => router.push('/registro')}>
        Crear cuenta
      </Boton>
    </Pantalla>
  );
}
