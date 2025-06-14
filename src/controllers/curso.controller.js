const { Curso, PlanEstudio, Prerequisito } = require('../models');
const { Op } = require('sequelize');

// Crear un nuevo curso
const createCurso = async (req, res) => {
  try {
    const { 
      planEstudioId, 
      codigo, 
      nombre, 
      descripcion, 
      ciclo, 
      creditos, 
      horasTeoricas, 
      horasPracticas, 
      tipo 
    } = req.body;

    // Verificar si existe el plan de estudio
    const planEstudio = await PlanEstudio.findByPk(planEstudioId);
    if (!planEstudio) {
      return res.status(404).json({
        success: false,
        message: 'El plan de estudio especificado no existe'
      });
    }

    // Verificar si ya existe un curso con el mismo código en el mismo plan
    const existingCurso = await Curso.findOne({ 
      where: { 
        planEstudioId, 
        codigo 
      } 
    });
    
    if (existingCurso) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un curso con este código en el plan de estudio seleccionado'
      });
    }

    const curso = await Curso.create({
      planEstudioId,
      codigo,
      nombre,
      descripcion,
      ciclo,
      creditos,
      horasTeoricas,
      horasPracticas,
      tipo
    });

    return res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: curso
    });
  } catch (error) {
    console.error('Error al crear curso:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el curso',
      error: error.message
    });
  }
};

// Obtener todos los cursos
const getAllCursos = async (req, res) => {
  try {
    const { planEstudioId, ciclo, activo } = req.query;
    
    const whereCondition = {};
    
    if (planEstudioId) {
      whereCondition.planEstudioId = planEstudioId;
    }
    
    if (ciclo) {
      whereCondition.ciclo = ciclo;
    }
    
    if (activo !== undefined) {
      whereCondition.activo = activo === 'true';
    }
    
    const cursos = await Curso.findAll({
      where: whereCondition,
      include: [{
        model: PlanEstudio,
        as: 'planEstudio',
        attributes: ['id', 'nombre', 'codigo']
      }],
      order: [['ciclo', 'ASC'], ['codigo', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      count: cursos.length,
      data: cursos
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los cursos',
      error: error.message
    });
  }
};

// Obtener un curso por ID
const getCursoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findByPk(id, {
      include: [
        {
          model: PlanEstudio,
          as: 'planEstudio',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: Prerequisito,
          as: 'prerequisitosRequeridos',
          include: [
            {
              model: Curso,
              as: 'cursoPrerequisito',
              attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
            }
          ]
        }
      ]
    });
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: curso
    });
  } catch (error) {
    console.error('Error al obtener curso:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el curso',
      error: error.message
    });
  }
};

// Actualizar un curso
const updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      ciclo, 
      creditos, 
      horasTeoricas, 
      horasPracticas, 
      tipo,
      activo 
    } = req.body;
    
    const curso = await Curso.findByPk(id);
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    await curso.update({
      nombre: nombre || curso.nombre,
      descripcion: descripcion !== undefined ? descripcion : curso.descripcion,
      ciclo: ciclo || curso.ciclo,
      creditos: creditos || curso.creditos,
      horasTeoricas: horasTeoricas !== undefined ? horasTeoricas : curso.horasTeoricas,
      horasPracticas: horasPracticas !== undefined ? horasPracticas : curso.horasPracticas,
      tipo: tipo || curso.tipo,
      activo: activo !== undefined ? activo : curso.activo
    });
    
    return res.status(200).json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: curso
    });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el curso',
      error: error.message
    });
  }
};

// Eliminar un curso (lógicamente)
const deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findByPk(id);
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    await curso.update({ activo: false });
    
    return res.status(200).json({
      success: true,
      message: 'Curso desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el curso',
      error: error.message
    });
  }
};

// Obtener cursos por plan de estudio
const getCursosByPlanEstudio = async (req, res) => {
  try {
    const { planEstudioId } = req.params;
    const { ciclo } = req.query;
    
    const whereCondition = { planEstudioId };
    
    if (ciclo) {
      whereCondition.ciclo = ciclo;
    }
    
    const cursos = await Curso.findAll({
      where: whereCondition,
      order: [['ciclo', 'ASC'], ['codigo', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      count: cursos.length,
      data: cursos
    });
  } catch (error) {
    console.error('Error al obtener cursos por plan de estudio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los cursos por plan de estudio',
      error: error.message
    });
  }
};

module.exports = {
  createCurso,
  getAllCursos,
  getCursoById,
  updateCurso,
  deleteCurso,
  getCursosByPlanEstudio
};