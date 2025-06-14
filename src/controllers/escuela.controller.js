const { Escuela, Facultad } = require('../models');

// Crear una nueva escuela
const createEscuela = async (req, res) => {
  try {
    const { facultadId, nombre, codigo, descripcion } = req.body;

    // Verificar si existe la facultad
    const facultad = await Facultad.findByPk(facultadId);
    if (!facultad) {
      return res.status(404).json({
        success: false,
        message: 'La facultad especificada no existe'
      });
    }

    // Verificar si ya existe una escuela con el mismo código
    const existingEscuela = await Escuela.findOne({ where: { codigo } });
    if (existingEscuela) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una escuela con este código'
      });
    }

    const escuela = await Escuela.create({
      facultadId,
      nombre,
      codigo,
      descripcion
    });

    return res.status(201).json({
      success: true,
      message: 'Escuela creada exitosamente',
      data: escuela
    });
  } catch (error) {
    console.error('Error al crear escuela:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la escuela',
      error: error.message
    });
  }
};

// Obtener todas las escuelas
const getAllEscuelas = async (req, res) => {
  try {
    const escuelas = await Escuela.findAll({
      include: [{
        model: Facultad,
        as: 'facultad',
        attributes: ['id', 'nombre', 'codigo']
      }]
    });
    
    return res.status(200).json({
      success: true,
      count: escuelas.length,
      data: escuelas
    });
  } catch (error) {
    console.error('Error al obtener escuelas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las escuelas',
      error: error.message
    });
  }
};

// Obtener escuelas por facultad
const getEscuelasByFacultad = async (req, res) => {
  try {
    const { facultadId } = req.params;
    
    const escuelas = await Escuela.findAll({
      where: { facultadId },
      include: [{
        model: Facultad,
        as: 'facultad',
        attributes: ['id', 'nombre', 'codigo']
      }]
    });
    
    return res.status(200).json({
      success: true,
      count: escuelas.length,
      data: escuelas
    });
  } catch (error) {
    console.error('Error al obtener escuelas por facultad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las escuelas por facultad',
      error: error.message
    });
  }
};

// Obtener una escuela por ID
const getEscuelaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const escuela = await Escuela.findByPk(id, {
      include: [{
        model: Facultad,
        as: 'facultad',
        attributes: ['id', 'nombre', 'codigo']
      }]
    });
    
    if (!escuela) {
      return res.status(404).json({
        success: false,
        message: 'Escuela no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: escuela
    });
  } catch (error) {
    console.error('Error al obtener escuela:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la escuela',
      error: error.message
    });
  }
};

// Actualizar una escuela
const updateEscuela = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultadId, nombre, codigo, descripcion, activo } = req.body;
    
    const escuela = await Escuela.findByPk(id);
    
    if (!escuela) {
      return res.status(404).json({
        success: false,
        message: 'Escuela no encontrada'
      });
    }
    
    // Verificar si la facultad existe
    if (facultadId) {
      const facultad = await Facultad.findByPk(facultadId);
      if (!facultad) {
        return res.status(404).json({
          success: false,
          message: 'La facultad especificada no existe'
        });
      }
    }
    
    // Verificar si el código ya existe en otra escuela
    if (codigo && codigo !== escuela.codigo) {
      const existingEscuela = await Escuela.findOne({ where: { codigo } });
      if (existingEscuela) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra escuela con este código'
        });
      }
    }
    
    await escuela.update({
      facultadId: facultadId || escuela.facultadId,
      nombre: nombre || escuela.nombre,
      codigo: codigo || escuela.codigo,
      descripcion: descripcion !== undefined ? descripcion : escuela.descripcion,
      activo: activo !== undefined ? activo : escuela.activo
    });
    
    return res.status(200).json({
      success: true,
      message: 'Escuela actualizada exitosamente',
      data: escuela
    });
  } catch (error) {
    console.error('Error al actualizar escuela:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la escuela',
      error: error.message
    });
  }
};

// Eliminar una escuela (lógicamente)
const deleteEscuela = async (req, res) => {
  try {
    const { id } = req.params;
    
    const escuela = await Escuela.findByPk(id);
    
    if (!escuela) {
      return res.status(404).json({
        success: false,
        message: 'Escuela no encontrada'
      });
    }
    
    await escuela.update({ activo: false });
    
    return res.status(200).json({
      success: true,
      message: 'Escuela desactivada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar escuela:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la escuela',
      error: error.message
    });
  }
};

module.exports = {
  createEscuela,
  getAllEscuelas,
  getEscuelasByFacultad,
  getEscuelaById,
  updateEscuela,
  deleteEscuela
};