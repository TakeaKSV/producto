import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";

export const crearCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json({ 
      message: "Categoría creada con éxito",
      categoria 
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerCategorias = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Solo los administradores pueden realizar esta operación" });
    }
    const categorias = await Categoria.findAll({
      where: { activo: true }
    });
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerCategoriaPorId = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Solo los administradores pueden realizar esta operación" });
    }
    const categoria = await Categoria.findOne({
      where: { id: req.params.id, activo: true }
    });
    
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    res.json(categoria);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    
    // Verificar si la categoría existe
    const categoriaExiste = await Categoria.findOne({
      where: { id: categoriaId, activo: true }
    });
    
    if (!categoriaExiste) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    // Buscar todos los productos activos de esta categoría
    const productos = await Producto.findAll({
      where: { 
        categoriaId: categoriaId,
        activo: true 
      }
    });
    
    res.json({
      categoria: categoriaExiste,
      productos: productos
    });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ error: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const [updated] = await Categoria.update(req.body, {
      where: { id: req.params.id, activo: true },
    });
    
    if (!updated) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    const categoriaActualizada = await Categoria.findByPk(req.params.id);
    
    res.json({ 
      mensaje: "Categoría actualizada con éxito",
      categoria: categoriaActualizada
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    // Verificar si hay productos con esta categoría
    const productosAsociados = await Producto.count({
      where: { 
        categoriaId: req.params.id,
        activo: true 
      }
    });
    
    if (productosAsociados > 0) {
      return res.status(400).json({ 
        error: "No se puede eliminar la categoría porque tiene productos asociados" 
      });
    }
    
    // Eliminación lógica (cambiar estado 'activo' a false)
    const updated = await Categoria.update(
      { activo: false },
      { where: { id: req.params.id, activo: true } }
    );
    
    if (!updated[0]) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    res.json({ mensaje: "Categoría eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ error: error.message });
  }
};