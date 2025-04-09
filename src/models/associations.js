import Producto from './Producto.js';
import Categoria from './Categoria.js';

export default function setupAssociations() {
  // Relaciones Categoría-Producto
  Categoria.hasMany(Producto, { foreignKey: 'categoriaId', as: 'productos' });
  Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });
  
  console.log('✅ Asociaciones del servicio de Productos establecidas');
}