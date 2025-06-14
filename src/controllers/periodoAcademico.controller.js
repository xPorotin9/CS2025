const { PeriodoAcademico, Matricula } = require('../models');
const { Op } = require('sequelize');

// Crear un nuevo periodo académico
const createPeriodoAcademico = async (req, res) => {
  try {
    const {
      nombre,
      codigo,
      fechaInicio,
      fechaFin,
      fechaInicioMatricula,
      fechaFinMatricula,
      fechaInicioMatriculaExtemporanea,
      fechaFinMatriculaExtemporanea,
      estado
    } = req.body;

    // Verificar que no exista un periodo con el mismo código
    const existingPeriodo = await PeriodoAcademico.findOne({ where: { codigo } });
    if (existingPeriodo) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un periodo académico con este código'
      });
    }

    // Verificar que las fechas sean coherentes
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    const fechaInicioMatriculaDate = new Date(fechaInicioMatricula);
    const fechaFinMatriculaDate = new Date(fechaFinMatricula);
    
    // Validar coherencia de fechas
    if (fechaInicioDate >= fechaFinDate) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
    }
    
    if (fechaInicioMatriculaDate >= fechaFinMatriculaDate) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio de matrícula debe ser anterior a la fecha de fin de matrícula'
      });
    }

    if (fechaFinMatriculaDate > fechaInicioDate) {
      return res.status(400).json({
        success: false,
        message: 'La matrícula debe finalizar antes del inicio del periodo académico'
      });
    }

    // Validar matrícula extemporánea si se proporciona
    if (fechaInicioMatriculaExtemporanea && fechaFinMatriculaExtemporanea) {
      const fechaInicioMatriculaExtemporaneaDate = new Date(fechaInicioMatriculaExtemporanea);
      const fechaFinMatriculaExtemporaneaDate = new Date(fechaFinMatriculaExtemporanea);
      
      if (fechaInicioMatriculaExtemporaneaDate >= fechaFinMatriculaExtemporaneaDate) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de inicio de matrícula extemporánea debe ser anterior a la fecha de fin'
        });
      }
      
      if (fechaInicioMatriculaExtemporaneaDate <= fechaFinMatriculaDate) {
        return res.status(400).json({
          success: false,
          message: 'La matrícula extemporánea debe comenzar después de la matrícula regular'
        });
      }
      
      if (fechaFinMatriculaExtemporaneaDate > fechaInicioDate) {
        return res.status(400).json({
          success: false,
          message: 'La matrícula extemporánea debe finalizar antes del inicio del periodo académico'
        });
      }
    }

    // Crear el periodo académico
    const periodoAcademico = await PeriodoAcademico.create({
      nombre,
      codigo,
      fechaInicio,
      fechaFin,
      fechaInicioMatricula,
      fechaFinMatricula,
      fechaInicioMatriculaExtemporanea,
      fechaFinMatriculaExtemporanea,
      estado: estado || 'programado'
    });

    return res.status(201).json({
      success: true,
      message: 'Periodo académico creado exitosamente',
      data: periodoAcademico
    });
  } catch (error) {
    console.error('Error al crear periodo académico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el periodo académico',
      error: error.message
    });
  }
};

// Obtener todos los periodos académicos
const getAllPeriodosAcademicos = async (req, res) => {
  try {
    const { estado, activo } = req.query;
    
    const whereCondition = {};
    
    if (estado) {
      whereCondition.estado = estado;
    }
    
    if (activo !== undefined) {
      whereCondition.activo = activo === 'true';
    }
    
    const periodosAcademicos = await PeriodoAcademico.findAll({
      where: whereCondition,
      order: [['fechaInicio', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count: periodosAcademicos.length,
      data: periodosAcademicos
    });
  } catch (error) {
    console.error('Error al obtener periodos académicos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los periodos académicos',
      error: error.message
    });
  }
};

// Obtener periodo académico actual
const getPeriodoAcademicoActual = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const periodoAcademico = await PeriodoAcademico.findOne({
      where: {
        fechaInicio: { [Op.lte]: currentDate },
        fechaFin: { [Op.gte]: currentDate },
        activo: true
      }
    });
    
    if (!periodoAcademico) {
      // Buscar el periodo más próximo a iniciar
      const proximoPeriodo = await PeriodoAcademico.findOne({
        where: {
          fechaInicio: { [Op.gt]: currentDate },
          activo: true
        },
        order: [['fechaInicio', 'ASC']]
      });
      
      if (!proximoPeriodo) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró un periodo académico actual o próximo'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Se encontró el próximo periodo académico',
        data: proximoPeriodo
      });
    }
    
    return res.status(200).json({
      success: true,
      data: periodoAcademico
    });
  } catch (error) {
    console.error('Error al obtener periodo académico actual:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el periodo académico actual',
      error: error.message
    });
  }
};

// Obtener un periodo académico por ID
const getPeriodoAcademicoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const periodoAcademico = await PeriodoAcademico.findByPk(id);
    
    if (!periodoAcademico) {
      return res.status(404).json({
        success: false,
        message: 'Periodo académico no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: periodoAcademico
    });
  } catch (error) {
    console.error('Error al obtener periodo académico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el periodo académico',
      error: error.message
    });
  }
};

// Actualizar un periodo académico
const updatePeriodoAcademico = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fechaInicio,
      fechaFin,
      fechaInicioMatricula,
      fechaFinMatricula,
      fechaInicioMatriculaExtemporanea,
      fechaFinMatriculaExtemporanea,
      estado,
      activo
    } = req.body;
    
    const periodoAcademico = await PeriodoAcademico.findByPk(id);
    
    if (!periodoAcademico) {
      return res.status(404).json({
        success: false,
        message: 'Periodo académico no encontrado'
      });
    }
    
    // Verificar si ya hay matrículas relacionadas
    const matriculasCount = await Matricula.count({
      where: { periodoAcademicoId: id }
    });
    
    if (matriculasCount > 0 && (fechaInicio || fechaFin)) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden modificar las fechas principales de un periodo con matrículas registradas'
      });
    }
    
    // Actualizar el periodo académico
    await periodoAcademico.update({
      nombre: nombre || periodoAcademico.nombre,
      fechaInicio: fechaInicio || periodoAcademico.fechaInicio,
      fechaFin: fechaFin || periodoAcademico.fechaFin,
      fechaInicioMatricula: fechaInicioMatricula || periodoAcademico.fechaInicioMatricula,
      fechaFinMatricula: fechaFinMatricula || periodoAcademico.fechaFinMatricula,
      fechaInicioMatriculaExtemporanea: fechaInicioMatriculaExtemporanea || periodoAcademico.fechaInicioMatriculaExtemporanea,
      fechaFinMatriculaExtemporanea: fechaFinMatriculaExtemporanea || periodoAcademico.fechaFinMatriculaExtemporanea,
      estado: estado || periodoAcademico.estado,
      activo: activo !== undefined ? activo : periodoAcademico.activo
    });
    
    return res.status(200).json({
      success: true,
      message: 'Periodo académico actualizado exitosamente',
      data: periodoAcademico
    });
  } catch (error) {
    console.error('Error al actualizar periodo académico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el periodo académico',
      error: error.message
    });
  }
};

// Cambiar el estado de un periodo académico
const updatePeriodoAcademicoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!['programado', 'en_curso', 'finalizado'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }
    
    const periodoAcademico = await PeriodoAcademico.findByPk(id);
    
    if (!periodoAcademico) {
      return res.status(404).json({
        success: false,
        message: 'Periodo académico no encontrado'
      });
    }
    
    // Verificar coherencia de estado
    const currentDate = new Date();
    const fechaInicio = new Date(periodoAcademico.fechaInicio);
    const fechaFin = new Date(periodoAcademico.fechaFin);
    
    if (estado === 'en_curso' && (currentDate < fechaInicio || currentDate > fechaFin)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede establecer el estado "en_curso" fuera del rango de fechas del periodo'
      });
    }
    
    if (estado === 'finalizado' && currentDate < fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'No se puede finalizar un periodo antes de su fecha de fin'
      });
    }
    
    await periodoAcademico.update({ estado });
    
    return res.status(200).json({
      success: true,
      message: 'Estado de periodo académico actualizado exitosamente',
      data: { id, estado }
    });
  } catch (error) {
    console.error('Error al actualizar estado de periodo académico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado del periodo académico',
      error: error.message
    });
  }
};

module.exports = {
  createPeriodoAcademico,
  getAllPeriodosAcademicos,
  getPeriodoAcademicoActual,
  getPeriodoAcademicoById,
  updatePeriodoAcademico,
  updatePeriodoAcademicoEstado
};