const { test, expect } = require('@playwright/test');
const id = '11111111-1111-4111-8111-111111111111';
const usuario = { id, aud: 'authenticated', role: 'authenticated', email: 'ana@example.com', created_at: '2026-01-10T12:00:00Z', app_metadata: {}, user_metadata: {} };
const sesion = { access_token: 'fixture-access-token', refresh_token: 'fixture-refresh-token', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now()/1000)+3600, user: usuario };
async function preparar(page, autenticado = false, opciones = {}) {
  let perfil = { id, nombre_completo: 'Ana Pérez', telefono: '3001234567', correo: usuario.email, rol: 'cliente', created_at: usuario.created_at };
  const cambios = [];
  const consultas = [];
  await page.route('https://*.supabase.co/**', async (route) => {
    const req = route.request(); const url = new URL(req.url());
    const responder = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (url.pathname.includes('/auth/v1/token')) return responder(sesion);
    if (url.pathname.includes('/auth/v1/signup')) return responder({ user: usuario, session: null });
    if (url.pathname.includes('/auth/v1/logout')) return responder({});
    if (url.pathname.includes('/auth/v1/user')) return responder(usuario);
    if (url.pathname.includes('/rest/v1/profiles')) {
      consultas.push(url.search);
      if (req.method() === 'PATCH') {
        cambios.push(req.postDataJSON());
        if (opciones.denegar) return responder({ code: '42501', message: 'permission denied' }, 403);
        perfil = { ...perfil, ...req.postDataJSON() };
      }
      return responder(url.searchParams.has('id') ? perfil : [perfil]);
    }
    return responder({});
  });
  await page.routeWebSocket(/supabase/, socket => socket.close());
  if (autenticado) await page.addInitScript((s) => {
    if (!sessionStorage.getItem('fixture-initialized')) {
      localStorage.setItem('sb-andina-test-auth-token', JSON.stringify(s));
      sessionStorage.setItem('fixture-initialized', 'true');
    }
  }, sesion);
  return { cambios, consultas };
}
test('catálogo: ocho imágenes, búsqueda, filtros, orden, menú y diseño adaptable', async ({ page }, info) => {
  await preparar(page); const errores = []; page.on('pageerror', e => errores.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: /^Agregar .* al carrito$/ })).toHaveCount(8);
  const titulo = await page.getByText('Descubre nuestros productos', { exact: true }).boundingBox();
  expect(titulo.x + titulo.width).toBeLessThanOrEqual(page.viewportSize().width);
  await page.screenshot({ path: `.expo/${info.project.name}-inicio.png` });
  await page.getByLabel('Buscar productos por nombre').fill('AUDIFONOS');
  await expect(page.getByRole('button', { name: /^Agregar .* al carrito$/ })).toHaveCount(1);
  await page.getByRole('button', { name: 'Hogar', exact: true }).click();
  await expect(page.getByText('No encontramos productos')).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar búsqueda y filtros' }).click();
  await page.getByRole('button', { name: 'Menor precio' }).click();
  await expect(page.getByRole('button', { name: /^Agregar .* al carrito$/ }).first()).toHaveAttribute('aria-label', 'Agregar Licuadora de vaso al carrito');
  await page.getByRole('button', { name: 'Mayor precio' }).click();
  await expect(page.getByRole('button', { name: /^Agregar .* al carrito$/ }).first()).toHaveAttribute('aria-label', 'Agregar Teléfono inteligente al carrito');
  await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
  await expect(page.getByText('Visitante', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar menú', exact: true }).click();
  await expect(page.getByText('Visitante', { exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Ir al catálogo de Andina Tech y Hogar' }).click();
  await page.screenshot({ path: `.expo/${info.project.name}-catalogo.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (info.project.name === 'movil') {
    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByText('© 2026 · Versión 1.0.0', { exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByText('Equipo académico · UNIAJC', { exact: true })).toBeVisible();
  await page.screenshot({ path: `.expo/${info.project.name}-footer.png` });
  expect(errores).toEqual([]);
});
test('carrito: cantidades, totales COP, recarga, eliminar y vaciar', async ({ page }) => {
  await preparar(page); await page.goto('/');
  await page.getByRole('button', { name: 'Agregar Audífonos inalámbricos al carrito' }).click();
  await page.getByRole('button', { name: 'Agregar Audífonos inalámbricos al carrito' }).click();
  await page.getByRole('button', { name: 'Agregar Cafetera compacta al carrito' }).click();
  await page.getByRole('button', { name: 'Carrito (3)', exact: true }).click();
  await expect(page.getByText('$ 609.700 COP', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('$ 609.700 COP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Disminuir cantidad de Audífonos inalámbricos' }).click();
  await expect(page.getByText('$ 419.800 COP', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Disminuir cantidad de Audífonos inalámbricos' })).toBeDisabled();
  await page.getByRole('button', { name: 'Aumentar cantidad de Audífonos inalámbricos' }).click();
  await expect(page.getByText('$ 609.700 COP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Eliminar Cafetera compacta' }).click();
  await expect(page.getByText('$ 379.800 COP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Vaciar carrito', exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByText('$ 379.800 COP', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Vaciar carrito', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, vaciar carrito' }).click();
  await expect(page.getByText('Tu carrito está vacío')).toBeVisible();
  await page.reload(); await expect(page.getByText('Tu carrito está vacío')).toBeVisible();
});
test('rutas privadas bloqueadas y acceso/registro existentes', async ({ page }) => {
  const { consultas } = await preparar(page);
  for (const ruta of ['/perfil', '/usuarios']) {
    await page.goto(ruta); await expect(page).toHaveURL(/login/); await expect(page.getByText('Bienvenido de nuevo')).toBeVisible();
  }
  expect(consultas).toEqual([]);
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).last().click();
  await expect(page.getByText('Escribe un correo electrónico válido.')).toBeVisible();
  await page.getByLabel('Correo electrónico', { exact: true }).fill('ana@example.com');
  await page.getByLabel('Contraseña', { exact: true }).fill('contraseña-fixture');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).last().click();
  await expect(page.getByRole('button', { name: 'Editar perfil' })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await page.goto('/registro');
  await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Pérez');
  await page.getByLabel('Correo electrónico', { exact: true }).fill('ana@example.com');
  await page.getByLabel('Teléfono', { exact: true }).fill('3001234567');
  await page.getByLabel('Contraseña', { exact: true }).fill('contraseña-fixture');
  await page.getByLabel('Confirmar contraseña', { exact: true }).fill('contraseña-fixture');
  await page.getByRole('button', { name: 'Registrarme', exact: true }).click();
  await expect(page.getByText(/Registro recibido/)).toBeVisible();
});
test('perfil: consulta propia, cancelar, validar, guardar solo campos permitidos y directorio', async ({ page }, info) => {
  const { cambios, consultas } = await preparar(page, true);
  await page.goto('/perfil'); await expect(page.getByText('Ana Pérez', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Editar perfil' }).click();
  await page.getByLabel('Nombre completo', { exact: true }).fill('Cambio cancelado');
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByText('Ana Pérez', { exact: true })).toBeVisible(); expect(cambios).toEqual([]);
  await page.getByRole('button', { name: 'Editar perfil' }).click();
  await page.getByLabel('Nombre completo', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByText(/nombre debe tener/)).toBeVisible();
  await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Actualizada');
  await page.getByLabel('Teléfono', { exact: true }).fill('3109876543');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByText('Tu perfil se actualizó correctamente.')).toBeVisible();
  expect(cambios).toEqual([{ nombre_completo: 'Ana Actualizada', telefono: '3109876543' }]);
  expect(consultas.every(query => query.includes(`id=eq.${id}`))).toBe(true);
  await page.reload(); await expect(page.getByText('Ana Actualizada', { exact: true })).toBeVisible();
  await page.screenshot({ path: `.expo/${info.project.name}-perfil.png`, fullPage: true });
  await page.getByRole('button', { name: 'Usuarios registrados', exact: true }).click();
  await expect(page.getByText('Ana Actualizada', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('perfil: error de permisos no muestra éxito ni pierde el formulario', async ({ page }) => {
  await preparar(page, true, { denegar: true }); await page.goto('/perfil');
  await page.getByRole('button', { name: 'Editar perfil' }).click();
  await page.getByLabel('Nombre completo', { exact: true }).fill('Ana Actualizada');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByText(/No tienes permiso para guardar/)).toBeVisible();
  await expect(page.getByLabel('Nombre completo', { exact: true })).toHaveValue('Ana Actualizada');
  await expect(page.getByText('Tu perfil se actualizó correctamente.')).toHaveCount(0);
});
test('carrito: almacenamiento corrupto y fallo de escritura son recuperables', async ({ page }) => {
  await preparar(page); await page.addInitScript(() => { localStorage.setItem('andina:carrito:v1', '{corrupto'); });
  await page.goto('/carrito'); await expect(page.getByText(/No se pudo recuperar el carrito/)).toBeVisible();
  await page.evaluate(() => { const original = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { if (key === 'andina:carrito:v1') throw new Error('storage blocked'); return original.call(this, key, value); }; });
  await page.getByRole('button', { name: 'Explorar catálogo' }).click();
  await page.getByRole('button', { name: 'Agregar Audífonos inalámbricos al carrito' }).click();
  await expect(page.getByText(/El carrito cambió, pero no pudo guardarse/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Carrito (1)', exact: true })).toBeVisible();
});

test('carrito: datos persistidos se validan y nunca reemplazan precios locales', async ({ page }) => {
  await preparar(page);
  await page.addInitScript(() => localStorage.setItem('andina:carrito:v1', JSON.stringify([
    { id: 'tec-01', cantidad: 1000, precio: 1 }, { id: 'producto-ajeno', cantidad: 2 }, { id: 'hog-01', cantidad: -1 }
  ])));
  await page.goto('/carrito');
  await expect(page.getByRole('button', { name: 'Carrito (99)', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Aumentar cantidad de Audífonos inalámbricos' })).toBeDisabled();
  await expect(page.getByText('$ 18.800.100 COP', { exact: true })).toBeVisible();
});
test('cerrar sesión bloquea perfil tras recarga y conserva carrito público', async ({ page }) => {
  await preparar(page, true); await page.goto('/');
  await page.getByRole('button', { name: 'Agregar Cafetera compacta al carrito' }).click();
  await page.getByRole('button', { name: 'Mi perfil', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Editar perfil' })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await page.goto('/perfil'); await expect(page).toHaveURL(/login/);
  await page.getByRole('button', { name: 'Carrito (1)', exact: true }).click();
  await expect(page.getByText('$ 229.900 COP', { exact: true })).toBeVisible();
});
