# EcoSnap — aplicación móvil

Proyecto del curso **Mobile Cloud Computing (IS0249 - 210)**, Ingeniería de Sistemas.

**Equipo:** Brandon Linares, Sarihat y Adriana. · **Docente:** `endijromero`

La visión del proyecto, el problema y el stack están en el pitch de la organización.
Este repositorio contiene la aplicación móvil.

## Cómo correrlo

```bash
npm install
cp .env.example .env    # en el Sprint 3 puede quedar vacío
npm start
```

Escanea el QR con **Expo Go** (Android o iPhone). No hace falta Android Studio ni Xcode.

Sin credenciales en el `.env`, la app corre en **modo demo**: los repositorios
devuelven datos de ejemplo y toda la navegación se puede probar igual.

## Arquitectura: MVVM

```
app/                   Rutas de Expo Router. Cada archivo es una línea
                       que apunta a su vista. Aquí no hay lógica.
│
src/
├── views/             VIEW — dibuja y captura toques. No sabe de datos.
├── viewmodels/        VIEWMODEL — hooks con el estado de cada pantalla.
├── models/            MODEL (entidades) — Usuario, Clasificacion, Caneca.
├── repositories/      MODEL (acceso a datos) — única puerta hacia la nube.
├── services/          Clientes: Supabase (BaaS) y nuestro BFF.
├── components/        UI compartida (Boton, Campo, Pantalla).
└── theme/             Tokens de color, espacio y tipografía.
```

**La regla:** una vista nunca llama a un repositorio ni a la nube. Solo habla
con su ViewModel. Si alguna vista importa algo de `repositories/` o de
`services/`, está rompiendo el patrón.

La app habla con dos destinos en la nube. Con **Supabase** directamente, usando
su SDK: es un *Backend as a Service*, y le delegamos autenticación, base de
datos y almacenamiento de fotos. Y con nuestro propio **BFF**
([`ecosnap-backend`](../../../ecosnap-backend)), que es a donde va lo que no
puede vivir en el dispositivo: la clasificación con IA.

## Decisiones técnicas

Las razones detrás de cada elección, por si hace falta defenderlas.

**React Native con Expo, no Kotlin nativo.** El equipo trabaja en Mac y en
Windows, y probamos en iPhone y en Android con el mismo código. Con tres
desarrolladores y un semestre, un solo código base pesa más que el último 5% de
rendimiento que daría lo nativo.

**MVVM, no MVC ni VIPER.** React Native funciona por estado reactivo: uno cambia
el estado y la interfaz se redibuja sola. En MVC el controlador tendría que
ordenarle a la vista qué mostrar, que es pelear contra el framework. VIPER tiene
mejor testabilidad todavía, pero su complejidad solo se paga con equipos
grandes y muchos módulos en paralelo.

**Supabase, no Firebase.** Los dos son BaaS y cubren lo mismo. Supabase nos da
PostgreSQL, así que el modelo de datos es relacional con llaves foráneas,
transacciones y políticas de seguridad a nivel de fila. Además, como el acceso a
datos está encapsulado en los repositorios, cambiar de proveedor significaría
reescribir solo esa carpeta.

**Un BFF propio, no llamar a la IA desde la app.** El patrón *Backend for
Frontend* nos da tres cosas aquí: la llave de Gemini vive en el servidor y nunca
viaja dentro del APK, la respuesta llega ya recortada a lo que la pantalla
necesita (sin *over-fetching*), y podemos cambiar de modelo de IA sin publicar
una versión nueva de la app.

**REST, no GraphQL.** El BFF expone dos operaciones, muy distintas entre sí y
con respuestas pequeñas y fijas. GraphQL resuelve el *over-fetching* de APIs
generales con muchos clientes; aquí no hay over-fetching que resolver, y el
esquema y el runtime serían complejidad sin retorno.

**Render, no serverless.** Un servicio siempre activo evita el arranque en frío,
que en una petición de visión por computador ya lenta se notaría. Si el uso
creciera de forma irregular, la alternativa natural serían las Edge Functions de
Supabase.

## Pruebas

```bash
npm test
```

Las pruebas cubren los repositorios de autenticación y clasificación, que es
donde vive la lógica que puede romperse. Corren también en cada Pull Request:
si una prueba falla, GitHub bloquea el merge antes de que el error llegue a
`main`.

Este es uno de los beneficios de MVVM: como los ViewModels y los repositorios no
dependen de la interfaz, se pueden probar sin renderizar una sola pantalla.

## Estado por sprint

| Sprint | Qué se entregó |
|---|---|
| 1 | Product Backlog y pitch |
| 2 | Prototipo en Figma y diagrama de arquitectura |
| 3 | Este esqueleto: 12 pantallas conectadas y APK instalable |
| 4 | Autenticación real con Supabase |

## Pantallas

Bienvenida · Iniciar sesión · Crear cuenta · Inicio · Clasificar · Analizando ·
Resultado · Historial · Mi impacto · Ranking · Guía de reciclaje · Perfil

## Generar el APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Al terminar, EAS entrega un enlace de descarga del `.apk`.

## Convenciones de Git

- Una rama por historia de usuario: `feature/HU-02-login`
- Commits en imperativo y atómicos: `feat: pantalla de login (HU-02)`
- Todo entra a `main` por Pull Request, revisado por otro integrante.
