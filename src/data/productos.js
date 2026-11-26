// Catálogo estructurado local, permitido por el enunciado del taller.
// Marcas, referencias y precios son ilustrativos, no ofertas comerciales reales.
export const productos = [
  {
    id: 'tec-01', nombre: 'Audífonos inalámbricos',
    categoria: 'Tecnología', descripcion: 'Diseño ergonómico y estuche de carga compacto.',
    precio: 189900, imagen: require('../../assets/products/audifonos.png'), etiqueta: 'Destacado'
  },
  {
    id: 'tec-02', nombre: 'Teléfono inteligente',
    categoria: 'Tecnología', descripcion: 'Pantalla amplia y rendimiento para tu día a día.',
    precio: 1299900, imagen: require('../../assets/products/telefono.png')
  },
  {
    id: 'tec-03', nombre: 'Teclado mecánico',
    categoria: 'Tecnología', descripcion: 'Escritura cómoda y teclas de respuesta precisa.',
    precio: 259900, imagen: require('../../assets/products/teclado.png')
  },
  {
    id: 'tec-04', nombre: 'Reloj inteligente',
    categoria: 'Tecnología', descripcion: 'Notificaciones y funciones de actividad física.',
    precio: 349900, imagen: require('../../assets/products/reloj.png')
  },
  {
    id: 'hog-01', nombre: 'Cafetera compacta',
    categoria: 'Hogar', descripcion: 'Práctica para preparar café en pocos minutos.',
    precio: 229900, imagen: require('../../assets/products/cafetera.png')
  },
  {
    id: 'hog-02', nombre: 'Licuadora de vaso',
    categoria: 'Hogar', descripcion: 'Ideal para mezclas, jugos y recetas cotidianas.',
    precio: 169900, imagen: require('../../assets/products/licuadora.png')
  },
  {
    id: 'hog-03', nombre: 'Freidora de aire',
    categoria: 'Hogar', descripcion: 'Preparaciones prácticas con control de temperatura.',
    precio: 389900, imagen: require('../../assets/products/freidora.png'), etiqueta: 'Popular'
  },
  {
    id: 'hog-04', nombre: 'Aspiradora vertical',
    categoria: 'Hogar', descripcion: 'Formato ligero para la limpieza del hogar.',
    precio: 479900, imagen: require('../../assets/products/aspiradora.png')
  }
];

export const formatoPrecio = (cantidad) => '$ ' + Number(cantidad).toLocaleString('es-CO') + ' COP';
