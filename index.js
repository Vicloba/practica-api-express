const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Arreglo en memoria (Base de datos simulada)
let productos = [
  { id: 1, nombre: 'Laptop', precio: 1200 },
  { id: 2, nombre: 'Mouse', precio: 25 },
  { id: 3, nombre: 'Teclado', precio: 45 }
];

// Ruta base (/)
app.get('/', (req, res) => {
  res.send('Servidor en línea y funcionando correctamente.');
});

// 1. GET /api/productos - Obtener todos los productos
app.get('/api/productos', (req, res) => {
  res.status(200).json(productos);
});

// 2. GET /api/productos/:id - Obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  res.status(200).json(producto);
});

// 3. POST /api/productos - Crear un nuevo producto
app.post('/api/productos', (req, res) => {
  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ mensaje: 'Nombre y precio son requeridos' });
  }

  const nuevoProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// 4. PUT /api/productos/:id - Actualizar un producto existente
app.put('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productoIndex = productos.findIndex(p => p.id === id);

  if (productoIndex === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado para actualizar' });
  }

  const { nombre, precio } = req.body;

  productos[productoIndex] = {
    ...productos[productoIndex],
    ...(nombre && { nombre }),
    ...(precio && { precio })
  };

  res.status(200).json(productos[productoIndex]);
});

// ELIMINAR un producto por ID
app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  const productoEliminado = productos.splice(index, 1);
  res.json({
    mensaje: `Producto con ID ${id} eliminado correctamente`,
    producto: productoEliminado[0]
  });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});