import { Application } from 'express';

// Import routes
import ProductosRoutes from './routes/productos.routes';
import PersonaRoutes from './routes/persona.routes';

export const registeredRoutes = async (app:Application) => {
  app.use('/api/productos', ProductosRoutes);
  app.use('/api/personas', PersonaRoutes);
};