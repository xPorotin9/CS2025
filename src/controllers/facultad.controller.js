const { Facultad } = require('../models');

// Crear una nueva facultad
const createFacultad = async (req, res) => {
  try {
    const { nombre, codigo, descripcion } = req.body;

    // Verificar si ya existe una facultad con el mismo código
    const existingFacultad = await Facultad.findOne({ where: { codigo } });
    if (existingFacultad) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una facultad con este código'
      });
    }

    const facultad = await Facultad.create({
      nombre,
      codigo,
      descripcion
    });

    return res.status(201).json({
      success: true,
      message: 'Facultad creada exitosamente',
      data: facultad
    });
  } catch (error) {
    console.error('Error al crear facultad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la facultad',
      error: error.message
    });
  }
};

// Obtener todas las facultades
const getAllFacultades = async (req, res) => {
  try {
    const facultades = await Facultad.findAll();
    
    return res.status(200).json({
      success: true,
      count: facultades.length,
      data: facultades
    });
  } catch (error) {
    console.error('Error al obtener facultades:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las facultades',
      error: error.message
    });
  }
};

// Obtener una facultad por ID
const getFacultadById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facultad = await Facultad.findByPk(id);
    
    if (!facultad) {
      return res.status(404).json({
        success: false,
        message: 'Facultad no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: facultad
    });
  } catch (error) {
    console.error('Error al obtener facultad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la facultad',
      error: error.message
    });
  }
};

// Actualizar una facultad
const updateFacultad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, descripcion, activo } = req.body;
    
    const facultad = await Facultad.findByPk(id);
    
    if (!facultad) {
      return res.status(404).json({
        success: false,
        message: 'Facultad no encontrada'
      });
    }
    
    // Verificar si el código ya existe en otra facultad
    if (codigo && codigo !== facultad.codigo) {
      const existingFacultad = await Facultad.findOne({ where: { codigo } });
      if (existingFacultad) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra facultad con este código'
        });
      }
    }
    
    await facultad.update({
      nombre: nombre || facultad.nombre,
      codigo: codigo || facultad.codigo,
      descripcion: descripcion !== undefined ? descripcion : facultad.descripcion,
      activo: activo !== undefined ? activo : facultad.activo
    });
    
    return res.status(200).json({
      success: true,
      message: 'Facultad actualizada exitosamente',
      data: facultad
    });
  } catch (error) {
    console.error('Error al actualizar facultad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la facultad',
      error: error.message
    });
  }
};

// Eliminar una facultad (lógicamente)
const deleteFacultad = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facultad = await Facultad.findByPk(id);
    
    if (!facultad) {
      return res.status(404).json({
        success: false,
        message: 'Facultad no encontrada'
      });
    }
    
    await facultad.update({ activo: false });
    
    return res.status(200).json({
      success: true,
      message: 'Facultad desactivada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar facultad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la facultad',
      error: error.message
    });
  }
};

module.exports = {
  createFacultad,
  getAllFacultades,
  getFacultadById,
  updateFacultad,
  deleteFacultad
};