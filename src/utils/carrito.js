export const MAX_CANTIDAD = 99;

// Solo persistimos IDs y cantidades. El precio siempre proviene del catálogo.
export function normalizarCarrito(valor, catalogo) {
  if (!Array.isArray(valor)) return [];
  const cantidades = new Map();
  for (const item of valor) {
    if (!item || !catalogo.some((p) => p.id === item.id) || !Number.isInteger(item.cantidad) || item.cantidad < 1) continue;
    cantidades.set(item.id, Math.min(MAX_CANTIDAD, (cantidades.get(item.id) || 0) + item.cantidad));
  }
  return Array.from(cantidades, ([id, cantidad]) => ({ id, cantidad }));
}
export function cambiarCantidad(items, id, diferencia, catalogo) {
  if (!catalogo.some((p) => p.id === id) || !Number.isInteger(diferencia)) return items;
  const actual = items.find((item) => item.id === id)?.cantidad || 0;
  const cantidad = Math.min(MAX_CANTIDAD, actual + diferencia);
  if (cantidad <= 0) return items.filter((item) => item.id !== id);
  return actual ? items.map((item) => item.id === id ? { id, cantidad } : item) : [...items, { id, cantidad }];
}
export function resumirCarrito(items, catalogo) {
  const lineas = normalizarCarrito(items, catalogo).map((item) => {
    const producto = catalogo.find((p) => p.id === item.id);
    return { ...item, producto, subtotal: producto.precio * item.cantidad };
  });
  return { lineas, cantidad: lineas.reduce((suma, item) => suma + item.cantidad, 0), total: lineas.reduce((suma, item) => suma + item.subtotal, 0) };
}
