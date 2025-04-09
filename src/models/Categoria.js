import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Categoria = sequelize.define(
  "Categoria",
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nombre: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true
    },
    descripcion: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    activo: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    }
  },
  {
    timestamps: true,
    tableName: "categorias",
  }
);

export default Categoria;