import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Categoria from "./Categoria.js";

const Producto = sequelize.define(
  "Producto",
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    descripcion: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    precio: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false 
    },
    stock: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 0 
    },
    imagen: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    activo: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Categoria,
        key: 'id'
      }
    }
  },
  {
    timestamps: true,
    tableName: "productos",
  }
);

// Establecer relación con Categoria
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });

export default Producto;