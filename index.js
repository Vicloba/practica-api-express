require('dotenv').config();
const express = require('express');
const app = express();

// Importar la conexión a la base de datos MySQL
const db = require('./database/db');

// Middleware para procesar JSON en el cuerpo de las peticiones
app.use(express.json());

// =================================================================
// RUTAS REFACTORIZADAS (PARTE III)
// =================================================================

// 1. GET - Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error en GET /api/productos:', error);
    res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
  }
});

// 2. GET por ID - Obtener un producto por su ID
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en GET /api/productos/:id:', error);
    res.status(500).json({ error: 'Error al consultar el producto' });
  }
});

// 3. POST - Insertar un nuevo producto
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;

    // Validar datos mínimos obligatorios
    if (!nombre || !precio) {
      return res.status(400).json({ mensaje: 'El nombre y el precio son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)',
      [nombre, precio, descripcion || null]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      precio,
      descripcion
    });
  } catch (error) {
    console.error('Error en POST /api/productos:', error);
    res.status(500).json({ error: 'Error al guardar el producto en la base de datos' });
  }
});

// 4. PUT - Actualizar un producto existente
app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;

    const [result] = await db.query(
      'UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?',
      [nombre, precio, descripcion || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado para actualizar' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente', id, nombre, precio, descripcion });
  } catch (error) {
    console.error('Error en PUT /api/productos/:id:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// 5. DELETE - Eliminar un producto por su ID
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado para eliminar' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE /api/productos/:id:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// =================================================================
// INICIO DEL SERVIDOR
// =================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});