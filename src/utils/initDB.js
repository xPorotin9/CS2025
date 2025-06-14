// src/utils/initDB.js
const { sequelize } = require('../config/database');
const seedData = require('./seedData');

const initDB = async () => {
  try {
    // Sincronizar la base de datos (crear tablas)
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada');
    
    // Cargar datos iniciales
    await seedData();
    
    console.log('Inicialización de la base de datos completada');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    process.exit(0);
  }
};

initDB();