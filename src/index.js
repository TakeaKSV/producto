import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import setupAssociations from './models/associations.js';
import { sequelize } from './database/database.js';
import productosRoutes from './routes/productosRoutes.js';
import categoriasRoutes from './routes/categoriasRoutes.js';
// otros imports...

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar las rutas
app.use('/productos', productosRoutes);
app.use('/categorias', categoriasRoutes);
// otras rutas...

// Establecer las asociaciones de los modelos
setupAssociations();

// Sincronizar los modelos con la base de datos
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor de Productos iniciado en puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error sincronizando la base de datos:', error);
  });