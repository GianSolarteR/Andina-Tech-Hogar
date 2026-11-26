# Andina Tech & Hogar

Aplicación académica de Programación de Dispositivos Móviles I (UNIAJC), con Expo SDK 58, React Native, JavaScript, Expo Router y Supabase. Conserva los ocho productos y sus imágenes locales, la autenticación, el directorio privado y la identidad azul marino/dorado.

## Desarrollo

```sh
npm ci
npm start
npm run web
```

Crear `.env` a partir de `.env.example` y completar exclusivamente la URL y la clave **publishable** del proyecto Supabase. Reiniciar Expo cuando cambien. Nunca usar `service_role`, claves secretas ni contraseñas de base de datos en el frontend. `.env` está ignorado por Git. Sin configuración, catálogo y carrito funcionan; los formularios informan que el acceso no está disponible.

## Funcionalidades incorporadas

- **Mi perfil:** consulta el perfil asociado a Supabase Auth, muestra nombre, teléfono, correo, rol y fecha; permite editar únicamente nombre/teléfono, validar, cancelar, guardar y reintentar ante errores. Correo y rol son de solo lectura.
- **Carrito público:** agregar sin sesión, cantidades de 1 a 99, eliminar artículos, confirmar vaciado, subtotales y total en COP. AsyncStorage conserva IDs y cantidades al recargar. Ignora productos desconocidos y cantidades inválidas, y toma precios del catálogo actual. La hidratación precede a las modificaciones y las escrituras se serializan. Se informa si falla la recuperación o el guardado. El carrito pertenece al dispositivo/navegador y se conserva al cerrar sesión; no es un carrito sincronizado por cuenta ni entre pestañas.
- **Catálogo:** búsqueda por nombre tolerante a tildes/mayúsculas, categorías combinables, orden ascendente/descendente, estados vacíos y contador de unidades.
- **Navegación:** rutas `/`, `/carrito`, `/login`, `/registro`, `/perfil`, `/usuarios`; rutas privadas con espera de sesión y redirección, menú desplazable en pantallas bajas, barra horizontal en móvil y botón hamburguesa. Se conserva la composición original en `App.js` y los servicios existentes; Expo Router reemplaza exclusivamente el estado local de navegación para cumplir `AGENTS.md` y permitir URLs y recargas directas.
- **Accesibilidad y presentación:** etiquetas, mensajes anunciados, botones con estados de foco/pulsación/deshabilitado, áreas táctiles y escalado proporcional de imágenes. En teléfonos estrechos el catálogo usa una columna.
- **Créditos:** configurables en `src/config/creditos.js`; se usa «Equipo académico · UNIAJC» hasta recibir los nombres reales. Se mantiene `© 2026 · Versión 1.0.0`.

No se implementan cobros, pedidos ni pasarela de pago. Los importes son ilustrativos.

## Migración manual de Supabase (pendiente)

La migración **no se ejecutó contra la base de datos remota**.

1. Abrir el proyecto correcto en Supabase Dashboard → SQL Editor → New query. Preferir primero un proyecto de pruebas con dos cuentas de prueba.
2. Copiar y ejecutar completo `supabase/migrations/202611250001_perfil_propio.sql`.
3. Ejecutar `supabase/verificar_permisos.sql` para inspeccionar RLS, políticas y permisos de cada columna.
4. Con una cuenta de prueba, abrir Mi perfil, modificar nombre/teléfono y recargar: deben persistir. Cancelar una edición no debe escribir.
5. Probar desde un cliente autenticado con la clave publishable: un UPDATE sobre otro ID debe afectar **cero filas**; intentar actualizar `id`, `correo`, `rol` o `created_at` debe fallar por permisos. Sin sesión no deben poder leerse ni editarse perfiles. No hacer estas pruebas con `service_role` o el rol administrador del SQL Editor, porque omiten RLS.
6. Confirmar que el directorio sigue mostrando a los usuarios autenticados los perfiles registrados. Repetir las pruebas antes del merge a producción.

La migración es transaccional y repetible; no modifica usuarios ni filas, ni reemplaza el trigger o la política SELECT existentes. Revoca UPDATE de tabla y de columnas antes de conceder únicamente `nombre_completo` y `telefono`. Una política permisiva habilita la edición propia y otra restrictiva mantiene `auth.uid() = id` incluso si se agrega otra política permisiva. No volver a ejecutar `schema.sql` en una base existente: está destinado a proyectos nuevos y revocaría los permisos agregados. Para un proyecto nuevo, ejecutar primero `schema.sql` y luego la migración.

**Privacidad del directorio:** por requisito académico, cualquier cuenta autenticada puede consultar nombre, correo, teléfono y rol de las otras cuentas. No hay acceso a contraseñas. Este comportamiento no es apropiado como directorio abierto a todos los clientes de una tienda real; requeriría revisar roles y consentimiento antes de ese uso.

## Archivos y responsabilidades

| Archivos | Responsabilidad |
| --- | --- |
| `App.js`, `index.js`, `app.json`, `src/app/**`, `src/components/AppShell.js` | Entrada, providers, rutas públicas/privadas y composición existente |
| `src/hooks/useAuth.js`, `src/config/navegacion.js`, `NavBar.js`, `MenuHamburguesa.js` | Sesión compartida y opciones según autenticación |
| `src/screens/PerfilScreen.js`, `src/services/perfilesService.js`, `src/utils/validaciones.js` | Perfil real, actualización limitada y validación compartida con registro |
| `src/hooks/useCarrito.js`, `src/utils/carrito.js`, `src/screens/CarritoScreen.js`, `src/components/CarritoItem.js` | Estado, almacenamiento, cálculos y presentación del carrito |
| `src/components/Catalogo.js`, `ProductoCard.js`, `src/utils/catalogo.js`, `src/data/productos.js` | Búsqueda, categorías, orden, compra y formato COP |
| `src/components/Boton.js`, `EstadoCarga.js`, `Alerta.js`, `CampoFormulario.js` | Controles reutilizables y accesibles |
| `src/components/Footer.js`, `src/config/creditos.js` | Créditos configurables y pie adaptable |
| `src/screens/UsuariosScreen.js`, `src/services/usuariosService.js` | Validación de usuario antes de consulta y protección al desmontar pantalla |
| `supabase/migrations/**`, `supabase/verificar_permisos.sql` | Migración y consultas de verificación manual |
| `tests/**`, `playwright.config.cjs`, `eslint.config.js`, `tsconfig.json`, `src/assets.d.ts` | Pruebas, lint y comprobación de JavaScript con TypeScript |
| `package.json`, `package-lock.json`, `.env.example`, `.gitignore` | Dependencias reproducibles y configuración local segura |

Los nombres sueltos de componentes en la tabla pertenecen a `src/components/`. `vercel.json` y el esquema SQL original se conservan.

## Dependencias

Instaladas con `npx expo install` para resolver versiones compatibles:

- `expo-router ~58.0.32`, `react-native-screens ~4.30.1`, `expo-linking ~58.0.17`, `expo-constants ~58.0.16`: navegación y sus dependencias oficiales. Safe Area, Status Bar y AsyncStorage 2.2.0 ya existían.
- Desarrollo: TypeScript, tipos de React, ESLint y `eslint-config-expo` para los controles obligatorios; `@playwright/test` para pruebas reproducibles en navegador. No se agregó una librería visual.

## Pruebas

```sh
npm test
npm run lint
npm run typecheck
npx expo install --check
npx expo-doctor
npm run build:web
npm run test:e2e
```

`test:e2e` exporta una copia aislada en `.expo/test-dist`, desactiva `.env` y usa una URL y clave ficticias. Playwright intercepta Auth, REST y WebSocket de Supabase: **las pruebas de perfil/autenticación no demuestran que la migración esté aplicada ni validan RLS en PostgreSQL real**. Usa Edge instalado por defecto. Para otro entorno, instalar Chromium de Playwright y definir `PLAYWRIGHT_CHANNEL=chromium` antes de ejecutar. Los resultados y capturas se guardan en `.expo/`, fuera de Git.

Resultado de la validación del 25 de noviembre de 2026:

- 6 pruebas de lógica: cálculos, sanitización de almacenamiento, límites, búsqueda/orden y validaciones de perfil/registro/acceso.
- 16 pruebas de navegador: ocho escenarios en escritorio (1366 px) y móvil (360 px, además de comprobación de ancho a 320 px). Incluyen recargas, vaciado, errores de almacenamiento, autenticación simulada, restricciones de rutas, edición/cancelación/errores del perfil, directorio y cierre de sesión conservando carrito.
- Lint y `tsc --noEmit` con `checkJs: true` para los archivos de aplicación.
- Expo Doctor: 20/20; dependencias compatibles con SDK 58.
- Instalación limpia con `npm ci --no-audit --no-fund` completada.
- Exportación web con salida `dist`; bundles Hermes de Android e iOS exportados correctamente en `.expo/native-check` (sin compilar binarios ni ejecutar dispositivos).

Correcciones detectadas durante la validación: sustitución de `StyleSheet.absoluteFillObject` retirado por `absoluteFill`; tipos de props del formulario y declaraciones de imágenes PNG; ajuste del título del catálogo para evitar recorte en móviles y alineación de la barra en escritorio; mensajes de error de cierre de sesión visibles también en web; evitar consultas del directorio sin usuario validado. Se documentaron dos supresiones puntuales del analizador de React para cargas de red que actualizan estado después de `await`.

`npm audit --omit=dev` reportó tres alertas moderadas en la cadena `expo → @expo/fingerprint → minimatch 10.2.6` (GHSA-g3hv-75wg-m249). La propuesta automática `npm audit fix --force` baja Expo a SDK 52, por lo que no se aplicó. Revisar una actualización oficial compatible del SDK; no se alteró el major de Expo para ocultar la alerta.

Pendientes manuales: aplicar y validar la migración con dos cuentas, comprobar Auth real (incluida confirmación de correo), probar en dispositivos Android/iOS reales y completar nombres del equipo. La simulación móvil en navegador no equivale a ejecutar la aplicación nativa.

## Publicación mediante Vercel

1. Revisar el PR de `feature/perfil-carrito-mejoras` hacia `main`. El push de la rama puede generar una **Preview** según la integración existente.
2. Comprobar en Vercel las variables `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` del entorno elegido. Usar un Supabase de pruebas en Preview si se requiere aislamiento de datos.
3. Aplicar la migración manual y completar las pruebas de permisos/edición antes de aprobar el merge.
4. Después de la aprobación del propietario, fusionar el PR a `main`. La integración existente podrá desplegar producción. **No se realizó merge ni despliegue explícito de producción en este trabajo.**
5. Se conserva `vercel.json`: comando `npx expo export --platform web`, carpeta `dist`, rewrites para SPA. Verificar acceso directo y recarga de `/carrito`, `/perfil` y `/usuarios` en Preview antes de fusionar.

Referencias consultadas: [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/), [instalación de Expo Router](https://docs.expo.dev/router/installation/), [AsyncStorage para SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/), [permisos por columna en Supabase](https://supabase.com/docs/guides/database/postgres/column-level-security).
