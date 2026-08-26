import { authRepository } from '../repositories/AuthRepository';

/**
 * Pruebas del repositorio de autenticación (HU-01, HU-02, HU-03).
 * Corren contra la implementación de demo, que es la activa mientras
 * el .env no tenga las credenciales de Supabase.
 */
describe('AuthRepository', () => {
  afterEach(async () => {
    await authRepository.salir();
  });

  it('no hay sesión antes de iniciar sesión', async () => {
    expect(await authRepository.sesionActual()).toBeNull();
  });

  it('inicia sesión con credenciales válidas y devuelve un token', async () => {
    const sesion = await authRepository.entrar('brandon@correo.edu.co', 'clave12345');
    expect(sesion.email).toBe('brandon@correo.edu.co');
    expect(sesion.token).toBeTruthy();
    expect(sesion.usuarioId).toBeTruthy();
  });

  it('rechaza una contraseña de menos de 8 caracteres', async () => {
    await expect(authRepository.entrar('brandon@correo.edu.co', 'corta')).rejects.toThrow();
  });

  it('rechaza un correo sin arroba', async () => {
    await expect(authRepository.entrar('correo-malo', 'clave12345')).rejects.toThrow();
  });

  it('la sesión persiste después de entrar (HU-04)', async () => {
    await authRepository.entrar('brandon@correo.edu.co', 'clave12345');
    const guardada = await authRepository.sesionActual();
    expect(guardada).not.toBeNull();
    expect(guardada?.email).toBe('brandon@correo.edu.co');
  });

  it('cerrar sesión borra la sesión guardada (HU-03)', async () => {
    await authRepository.entrar('brandon@correo.edu.co', 'clave12345');
    await authRepository.salir();
    expect(await authRepository.sesionActual()).toBeNull();
  });

  it('el registro deja al usuario autenticado (HU-01)', async () => {
    const sesion = await authRepository.registrar(
      'Brandon Linares',
      'nuevo@correo.edu.co',
      'clave12345'
    );
    expect(sesion.email).toBe('nuevo@correo.edu.co');
  });
});
