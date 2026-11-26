const normalizar = (texto) => texto.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function filtrarProductos(productos, busqueda, categoria, orden) {
  const resultado = productos.filter((p) => (categoria === 'Todos' || p.categoria === categoria) && normalizar(p.nombre).includes(normalizar(busqueda)));
  if (orden === 'asc') resultado.sort((a, b) => a.precio - b.precio);
  if (orden === 'desc') resultado.sort((a, b) => b.precio - a.precio);
  return resultado;
}
