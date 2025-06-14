const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const { sequelize, testConnection } = require('./config/database');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const facultadRoutes = require('./routes/facultad.routes');
const escuelaRoutes = require('./routes/escuela.routes');
const planEstudioRoutes = require('./routes/planEstudio.routes');
const cursoRoutes = require('./routes/curso.routes');
const prerequisitoRoutes = require('./routes/prerequisito.routes');
const docenteRoutes = require('./routes/docente.routes');
const alumnoRoutes = require('./routes/alumno.routes');
const periodoAcademicoRoutes = require('./routes/periodoAcademico.routes');
const seccionRoutes = require('./routes/seccion.routes');
const horarioRoutes = require('./routes/horario.routes');
const matriculaRoutes = require('./routes/matricula.routes');
const detalleMatriculaRoutes = require('./routes/detalleMatricula.routes');
const pagoRoutes = require('./routes/pago.routes');
const configuracionRoutes = require('./routes/configuracion.routes');

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
let swaggerFile; 
try {
  swaggerFile = require('./swagger-output.json');
} catch (error) {
  console.log('Archivo swagger-output.json no encontrado. Ejecute npm run swagger-autogen primero.');
  swaggerFile = {
    openapi: '3.0.0',
    info: {
      title: 'API de Matrículas',
      version: '1.0.0',
      description: 'API para sistema de matrículas de alumnos'
    }
  };
}

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/facultades', facultadRoutes);
app.use('/api/escuelas', escuelaRoutes);
app.use('/api/planes-estudio', planEstudioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/prerequisitos', prerequisitoRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/periodos-academicos', periodoAcademicoRoutes);
app.use('/api/secciones', seccionRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/matriculas', matriculaRoutes);
app.use('/api/detalles-matricula', detalleMatriculaRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/configuraciones', configuracionRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API de sistema de matrículas funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await testConnection();
  await sequelize.sync({ alter: true });
  console.log('Base de datos sincronizada');
});