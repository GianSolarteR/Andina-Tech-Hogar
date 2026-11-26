import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizarCarrito, cambiarCantidad, resumirCarrito } from '../src/utils/carrito.js';
import { filtrarProductos } from '../src/utils/catalogo.js';
import { validarPerfil, validarLogin, validarRegistro } from '../src/utils/validaciones.js';
const catalogo = [{ id: 'a', precio: 189900, nombre: 'Audífonos', categoria: 'Tecnología' }, { id: 'b', precio: 229900, nombre: 'Cafetera', categoria: 'Hogar' }];
test('carrito: agregar, sumar, disminuir y quitar sin negativos', () => {
  let items = cambiarCantidad([], 'a', 1, catalogo);
  items = cambiarCantidad(items, 'a', 1, catalogo);
  items = cambiarCantidad(items, 'b', 1, catalogo);
  assert.equal(resumirCarrito(items, catalogo).total, 609700);
  assert.equal(resumirCarrito(items, catalogo).cantidad, 3);
  items = cambiarCantidad(items, 'a', -1, catalogo);
  assert.equal(resumirCarrito(items, catalogo).total, 419800);
  items = cambiarCantidad(items, 'a', -1, catalogo);
  assert.deepEqual(items, [{ id: 'b', cantidad: 1 }]);
  assert.equal(resumirCarrito([], catalogo).total, 0);
});
test('persistencia: descarta IDs desconocidos, cantidades inválidas y precios manipulados', () => {
  const items = normalizarCarrito(JSON.parse('[{"id":"a","cantidad":2,"precio":1},{"id":"desconocido","cantidad":1},{"id":"b","cantidad":-1},{"id":"b","cantidad":1.5},null]'), catalogo);
  assert.deepEqual(items, [{ id: 'a', cantidad: 2 }]);
  assert.equal(resumirCarrito(items, catalogo).total, 379800);
  assert.deepEqual(normalizarCarrito({}, catalogo), []);
});
test('cantidades duplicadas y límite de 99', () => {
  assert.deepEqual(normalizarCarrito([{ id: 'a', cantidad: 98 }, { id: 'a', cantidad: 2 }], catalogo), [{ id: 'a', cantidad: 99 }]);
  assert.deepEqual(cambiarCantidad([{ id: 'a', cantidad: 99 }], 'a', 1, catalogo), [{ id: 'a', cantidad: 99 }]);
  assert.deepEqual(cambiarCantidad([], 'inexistente', 1, catalogo), []);
});
test('búsqueda tolera tildes y mayúsculas, combina categoría y orden sin mutar catálogo', () => {
  assert.equal(filtrarProductos(catalogo, ' AUDIFONOS ', 'Todos', 'asc')[0].id, 'a');
  assert.deepEqual(filtrarProductos(catalogo, 'audifonos', 'Hogar', 'asc'), []);
  assert.deepEqual(filtrarProductos(catalogo, '', 'Todos', 'desc').map(p => p.id), ['b', 'a']);
  assert.equal(catalogo[0].id, 'a');
});
test('perfil valida nombre y teléfono sin aceptar campos vacíos', () => {
  assert.ok(validarPerfil({ nombre: ' ', telefono: '3001234567' }));
  assert.ok(validarPerfil({ nombre: 'Ana Pérez', telefono: 'abc3001234567' }));
  assert.ok(validarPerfil({ nombre: 'a'.repeat(91), telefono: '3001234567' }));
  assert.equal(validarPerfil({ nombre: ' Ana Pérez ', telefono: '+57 300 123 4567' }), '');
});
test('validaciones originales de registro y acceso', () => {
  assert.ok(validarLogin({ correo: 'incorrecto', contrasena: '12345678' }));
  assert.equal(validarLogin({ correo: 'ana@example.com', contrasena: '12345678' }), '');
  const datos = { nombre: 'Ana Pérez', telefono: '3001234567', correo: 'ana@example.com', contrasena: '12345678', confirmar: '12345678' };
  assert.equal(validarRegistro(datos), '');
  assert.ok(validarRegistro({ ...datos, confirmar: 'diferente' }));
});
