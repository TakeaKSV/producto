import express from "express";
import { swaggerUi, specs } from './src/api-docs.js';
import cors from "cors";
import sequelize from "./src/config/database.js";
import productoRoutes from "./src/routes/productoRoutes.js";
import categoriaRoutes from "./src/routes/categoriaRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/productos", productoRoutes);
app.use("/categorias", categoriaRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Conectar a la base de datos y sincronizar modelos
sequelize
  .sync()
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch((error) => console.error("❌ Error al conectar a la base de datos:", error));

// Levantar el servidor
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => console.log(`🚀 Servidor de productos corriendo en el puerto ${PORT}`));