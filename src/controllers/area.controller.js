const { Area, Curso } = require('../models');
const { Op } = require('sequelize');

// Crear una nueva área
const createArea = async (req, res) => {
  try {
    const { codigo, nombre, descripcion } = req.body;

    // Verificar si ya existe un área con el mismo código
    const areaExistente = await Area.findOne({ where: { codigo } });
    
    if (areaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un área con este código'
      });
    }

    const area = await Area.create({
      codigo,
      nombre,
      descripcion
    });

    return res.status(201).json({
      success: true,
      message: 'Área creada exitosamente',
      data: area
    });
  } catch (error) {
    console.error('Error al crear área:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el área',
      error: error.message
    });
  }
};

// Obtener todas las áreas
const getAllAreas = async (req, res) => {
  try {
    const { activo } = req.query;
    
    const whereCondition = {};
    
    if (activo !== undefined) {
      whereCondition.activo = activo === 'true';
    }
    
    const areas = await Area.findAll({
      where: whereCondition,
      include: [{
        model: Curso,
        as: 'cursos',
        attributes: ['id', 'codigo', 'nombre'],
        required: false
      }],
      order: [['codigo', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las áreas',
      error: error.message
    });
  }
};

// Obtener un área por ID
const getAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const area = await Area.findByPk(id, {
      include: [{
        model: Curso,
        as: 'cursos',
        attributes: ['id', 'codigo', 'nombre', 'ciclo', 'creditos'],
        required: false
      }]
    });
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: area
    });
  } catch (error) {
    console.error('Error al obtener área:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el área',
      error: error.message
    });
  }
};

// Actualizar un área
const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, activo } = req.body;
    
    const area = await Area.findByPk(id);
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }
    
    // Si se está actualizando el código, verificar que no exista otro con el mismo código
    if (codigo && codigo !== area.codigo) {
      const areaExistente = await Area.findOne({ 
        where: { 
          codigo,
          id: { [Op.ne]: id }
        } 
      });
      
      if (areaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra área con este código'
        });
      }
    }
    
    await area.update({
      codigo: codigo || area.codigo,
      nombre: nombre || area.nombre,
      descripcion: descripcion !== undefined ? descripcion : area.descripcion,
      activo: activo !== undefined ? activo : area.activo
    });
    
    return res.status(200).json({
      success: true,
      message: 'Área actualizada exitosamente',
      data: area
    });
  } catch (error) {
    console.error('Error al actualizar área:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el área',
      error: error.message
    });
  }
};

// Eliminar un área (desactivación lógica)
const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    
    const area = await Area.findByPk(id);
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }
    
    // Verificar si hay cursos asociados activos
    const cursosActivos = await Curso.count({
      where: { 
        areaId: id,
        activo: true
      }
    });
    
    if (cursosActivos > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede desactivar el área porque tiene cursos activos asociados'
      });
    }
    
    await area.update({ activo: false });
    
    return res.status(200).json({
      success: true,
      message: 'Área desactivada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar área:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el área',
      error: error.message
    });
  }
};

// Obtener cursos por área
const getCursosByArea = async (req, res) => {
  try {
    const { id } = req.params;
    
    const area = await Area.findByPk(id);
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }
    
    const cursos = await Curso.findAll({
      where: { areaId: id },
      attributes: ['id', 'codigo', 'nombre', 'ciclo', 'creditos', 'tipo', 'activo'],
      order: [['ciclo', 'ASC'], ['codigo', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      count: cursos.length,
      data: cursos
    });
  } catch (error) {
    console.error('Error al obtener cursos por área:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los cursos del área',
      error: error.message
    });
  }
};

module.exports = {
  createArea,
  getAllAreas,
  getAreaById,
  updateArea,
  deleteArea,
  getCursosByArea
};