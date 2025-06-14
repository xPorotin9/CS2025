const { PlanEstudio, Escuela, Curso, Alumno } = require('../models');

// Crear un nuevo plan de estudio
const createPlanEstudio = async (req, res) => {
  try {
    const {
      escuelaId,
      codigo,
      nombre,
      fechaInicio,
      fechaFin,
      totalCreditos,
      totalCiclos
    } = req.body;

    // Verificar si existe la escuela
    const escuela = await Escuela.findByPk(escuelaId);
    if (!escuela) {
      return res.status(404).json({
        success: false,
        message: 'La escuela especificada no existe'
      });
    }

    // Verificar que no exista un plan con el mismo código
    const existingPlan = await PlanEstudio.findOne({ where: { codigo } });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un plan de estudio con este código'
      });
    }

    const planEstudio = await PlanEstudio.create({
      escuelaId,
      codigo,
      nombre,
      fechaInicio,
      fechaFin,
      totalCreditos: totalCreditos || 0,
      totalCiclos: totalCiclos || 10
    });

    return res.status(201).json({
      success: true,
      message: 'Plan de estudio creado exitosamente',
      data: planEstudio
    });
  } catch (error) {
    console.error('Error al crear plan de estudio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el plan de estudio',
      error: error.message
    });
  }
};

// Obtener todos los planes de estudio
const getAllPlanesEstudio = async (req, res) => {
  try {
    const { escuelaId, activo } = req.query;
    
    const whereCondition = {};
    
    if (escuelaId) {
      whereCondition.escuelaId = escuelaId;
    }
    
    if (activo !== undefined) {
      whereCondition.activo = activo === 'true';
    }
    
    const planesEstudio = await PlanEstudio.findAll({
      where: whereCondition,
      include: [{
        model: Escuela,
        as: 'escuela',
        attributes: ['id', 'nombre', 'codigo']
      }],
      order: [['fechaInicio', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count: planesEstudio.length,
      data: planesEstudio
    });
  } catch (error) {
    console.error('Error al obtener planes de estudio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los planes de estudio',
      error: error.message
    });
  }
};

// Obtener planes de estudio por escuela
const getPlanesEstudioByEscuela = async (req, res) => {
  try {
    const { escuelaId } = req.params;
    
    const escuela = await Escuela.findByPk(escuelaId);
    if (!escuela) {
      return res.status(404).json({
        success: false,
        message: 'Escuela no encontrada'
      });
    }
    
    const planesEstudio = await PlanEstudio.findAll({
      where: { escuelaId },
      order: [['fechaInicio', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count: planesEstudio.length,
      data: planesEstudio
    });
  } catch (error) {
    console.error('Error al obtener planes de estudio por escuela:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los planes de estudio por escuela',
      error: error.message
    });
  }
};

// Obtener un plan de estudio por ID
const getPlanEstudioById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const planEstudio = await PlanEstudio.findByPk(id, {
      include: [{
        model: Escuela,
        as: 'escuela',
        attributes: ['id', 'nombre', 'codigo']
      }]
    });
    
    if (!planEstudio) {
      return res.status(404).json({
        success: false,
        message: 'Plan de estudio no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: planEstudio
    });
  } catch (error) {
    console.error('Error al obtener plan de estudio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el plan de estudio',
      error: error.message
    });
  }
};

// Actualizar un plan de estudio
const updatePlanEstudio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fechaInicio,
      fechaFin,
      totalCreditos,
      totalCiclos,
      activo
    } = req.body;
    
    const planEstudio = await PlanEstudio.findByPk(id);
    
    if (!planEstudio) {
      return res.status(404).json({
        success: false,
        message: 'Plan de estudio no encontrado'
      });
    }
    
    // Verificar si hay alumnos o cursos vinculados antes de actualizar campos críticos
    if (fechaInicio && fechaInicio !== planEstudio.fechaInicio) {
      const alumnosCount = await Alumno.count({ where: { planEstudioId: id } });
      const cursosCount = await Curso.count({ where: { planEstudioId: id } });
      
      if (alumnosCount > 0 || cursosCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede modificar la fecha de inicio de un plan con alumnos o cursos registrados'
        });
      }
    }
    
    await planEstudio.update({
      nombre: nombre || planEstudio.nombre,
      fechaInicio: fechaInicio || planEstudio.fechaInicio,
      fechaFin: fechaFin !== undefined ? fechaFin : planEstudio.fechaFin,
      totalCreditos: totalCreditos || planEstudio.totalCreditos,
      totalCiclos: totalCiclos || planEstudio.totalCiclos,
      activo: activo !== undefined ? activo : planEstudio.activo
    });
    
    return res.status(200).json({
      success: true,
      message: 'Plan de estudio actualizado exitosamente',
      data: planEstudio
    });
  } catch (error) {
    console.error('Error al actualizar plan de estudio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el plan de estudio',
      error: error.message
    });
  }
};

// Eliminar un plan de estudio (lógicamente)
const deletePlanEstudio = async (req, res) => {
  try {
    const { id } = req.params;
    
    const planEstudio = await PlanEstudio.findByPk(id);
    
    if (!planEstudio) {
      return res.status(404).json({
        success: false,
        message: 'Plan de estudio no encontrado'
      });
    }
    
    // Verificar si hay alumnos o cursos vinculados
    const alumnosCount = await Alumno.count({ where: { planEstudioId: id } });
    const cursosCount = await Curso.count({ where: { planEstudioId: id } });
    
    if (alumnosCount > 0 || cursosCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un plan con alumnos o cursos registrados'
      });
    }
    
    await planEstudio.update({ activo: false });
    
    return res.status(200).json({
      success: true,
      message: 'Plan de estudio desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar plan de estudio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el plan de estudio',
      error: error.message
    });
  }
};

module.exports = {
  createPlanEstudio,
  getAllPlanesEstudio,
  getPlanesEstudioByEscuela,
  getPlanEstudioById,
  updatePlanEstudio,
  deletePlanEstudio
};