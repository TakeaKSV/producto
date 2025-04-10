import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";
import { productoCreatedEvent, productoUpdatedEvent } from "../services/rabbitServiceEvent.js";

export const crearProducto = async (req, res) => {
  try {
    // Verificar si la categoría existe
    const categoriaExiste = await Categoria.findByPk(req.body.categoriaId);
    if (!categoriaExiste) {
      return res.status(404).json({ error: "La categoría no existe" });
    }

    const producto = await Producto.create(req.body);
    
    // Publicar evento de producto creado
    await productoCreatedEvent({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoriaId: producto.categoriaId
    });
    
    res.status(201).json({ 
      message: "Producto creado con éxito",
      producto 
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Solo los administradores pueden realizar esta operación" });
    }
    const productos = await Producto.findAll({
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }],
      where: { activo: true }
    });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Solo los administradores pueden realizar esta operación" });
    }

    const producto = await Producto.findOne({
      where: { id: req.params.id, activo: true },
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }]
    });
    
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    // Si se actualiza la categoría, verificar que exista
    if (req.body.categoriaId) {
      const categoriaExiste = await Categoria.findByPk(req.body.categoriaId);
      if (!categoriaExiste) {
        return res.status(404).json({ error: "La categoría no existe" });
      }
    }

    const [updated] = await Producto.update(req.body, {
      where: { id: req.params.id, activo: true },
    });
    
    if (!updated) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    const productoActualizado = await Producto.findByPk(req.params.id);
    
    // Publicar evento de producto actualizado
    await productoUpdatedEvent({
      id: productoActualizado.id,
      nombre: productoActualizado.nombre,
      precio: productoActualizado.precio,
      stock: productoActualizado.stock
    });
    
    res.json({ 
      mensaje: "Producto actualizado con éxito",
      producto: productoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    // Eliminación lógica (cambiar estado 'activo' a false)
    const updated = await Producto.update(
      { activo: false },
      { where: { id: req.params.id, activo: true } }
    );
    
    if (!updated[0]) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    res.json({ mensaje: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: error.message });
  }
};