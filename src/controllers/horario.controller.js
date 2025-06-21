// src/controllers/horario.controller.js

const { Horario, Seccion, Curso, Docente, Usuario, PeriodoAcademico } = require('../models');
const { Op } = require('sequelize');

// Crear un nuevo horario
const createHorario = async (req, res) => {
  try {
    const {
      seccionId,
      dia,
      horaInicio,
      horaFin,
      tipo,
      aula
    } = req.body;

    // Verificar que existe la sección
    const seccion = await Seccion.findByPk(seccionId, {
      include: [{
        model: Curso,
        as: 'curso'
      }, {
        model: Docente,
        as: 'docente'
      }]
    });
    
    if (!seccion) {
      return res.status(404).json({
        success: false,
        message: 'Sección no encontrada'
      });
    }

    // Validar que la hora de fin sea posterior a la hora de inicio
    if (horaFin <= horaInicio) {
      return res.status(400).json({
        success: false,
        message: 'La hora de fin debe ser posterior a la hora de inicio'
      });
    }

    // Verificar conflictos de horario con otras secciones del mismo docente
    const conflictosDocente = await Horario.findAll({
      include: [{
        model: Seccion,
        as: 'seccion',
        where: {
          docenteId: seccion.docenteId
        },
        include: [{
          model: Curso,
          as: 'curso'
        }]
      }],
      where: {
        dia,
        [Op.or]: [
          {
            horaInicio: {
              [Op.lt]: horaFin,
              [Op.gte]: horaInicio
            }
          },
          {
            horaFin: {
              [Op.gt]: horaInicio,
              [Op.lte]: horaFin
            }
          },
          {
            [Op.and]: [
              { horaInicio: { [Op.lte]: horaInicio } },
              { horaFin: { [Op.gte]: horaFin } }
            ]
          }
        ]
      }
    });

    if (conflictosDocente.length > 0) {
      return res.status(400).json({
        success: false,
        message: `El docente ya tiene clases programadas en este horario: ${conflictosDocente[0].seccion.curso.nombre}`,
        conflictos: conflictosDocente
      });
    }

    // Verificar conflictos de aula
    const conflictosAula = await Horario.findAll({
      where: {
        dia,
        aula,
        [Op.or]: [
          {
            horaInicio: {
              [Op.lt]: horaFin,
              [Op.gte]: horaInicio
            }
          },
          {
            horaFin: {
              [Op.gt]: horaInicio,
              [Op.lte]: horaFin
            }
          },
          {
            [Op.and]: [
              { horaInicio: { [Op.lte]: horaInicio } },
              { horaFin: { [Op.gte]: horaFin } }
            ]
          }
        ]
      },
      include: [{
        model: Seccion,
        as: 'seccion',
        include: [{
          model: Curso,
          as: 'curso'
        }]
      }]
    });

    if (conflictosAula.length > 0) {
      return res.status(400).json({
        success: false,
        message: `El aula ${aula} ya está ocupada en este horario por: ${conflictosAula[0].seccion.curso.nombre}`,
        conflictos: conflictosAula
      });
    }

    // Crear el horario
    const horario = await Horario.create({
      seccionId,
      dia,
      horaInicio,
      horaFin,
      tipo,
      aula
    });

    return res.status(201).json({
      success: true,
      message: 'Horario creado exitosamente',
      data: horario
    });
  } catch (error) {
    console.error('Error al crear horario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el horario',
      error: error.message
    });
  }
};

// Obtener todos los horarios
const getAllHorarios = async (req, res) => {
  try {
    const { seccionId, docenteId, dia, aula } = req.query;
    
    const whereCondition = {};
    const includeSeccion = {
      model: Seccion,
      as: 'seccion',
      include: [
        {
          model: Curso,
          as: 'curso'
        },
        {
          model: Docente,
          as: 'docente',
          include: [{
            model: Usuario,
            as: 'usuario'
          }]
        }
      ]
    };

    if (seccionId) whereCondition.seccionId = seccionId;
    if (dia) whereCondition.dia = dia;
    if (aula) whereCondition.aula = { [Op.iLike]: `%${aula}%` };

    if (docenteId) {
      includeSeccion.where = { docenteId };
    }

    const horarios = await Horario.findAll({
      where: whereCondition,
      include: [includeSeccion],
      order: [
        ['dia', 'ASC'],
        ['horaInicio', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      count: horarios.length,
      data: horarios
    });
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los horarios',
      error: error.message
    });
  }
};

// Obtener horarios por sección
const getHorariosBySeccion = async (req, res) => {
  try {
    const { seccionId } = req.params;

    const horarios = await Horario.findAll({
      where: { seccionId },
      order: [
        ['dia', 'ASC'],
        ['horaInicio', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      count: horarios.length,
      data: horarios
    });
  } catch (error) {
    console.error('Error al obtener horarios por sección:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los horarios de la sección',
      error: error.message
    });
  }
};

// Obtener horarios por docente
const getHorariosByDocente = async (req, res) => {
  try {
    const { docenteId } = req.params;

    const horarios = await Horario.findAll({
      include: [{
        model: Seccion,
        as: 'seccion',
        where: { docenteId },
        include: [{
          model: Curso,
          as: 'curso'
        }]
      }],
      order: [
        ['dia', 'ASC'],
        ['horaInicio', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      count: horarios.length,
      data: horarios
    });
  } catch (error) {
    console.error('Error al obtener horarios por docente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los horarios del docente',
      error: error.message
    });
  }
};

// Obtener un horario por ID
const getHorarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const horario = await Horario.findByPk(id, {
      include: [{
        model: Seccion,
        as: 'seccion',
        include: [
          {
            model: Curso,
            as: 'curso'
          },
          {
            model: Docente,
            as: 'docente',
            include: [{
              model: Usuario,
              as: 'usuario'
            }]
          }
        ]
      }]
    });

    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: horario
    });
  } catch (error) {
    console.error('Error al obtener horario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el horario',
      error: error.message
    });
  }
};

// Actualizar un horario
const updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia, horaInicio, horaFin, tipo, aula } = req.body;

    const horario = await Horario.findByPk(id, {
      include: [{
        model: Seccion,
        as: 'seccion'
      }]
    });

    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    // Validar que la hora de fin sea posterior a la hora de inicio
    if (horaFin <= horaInicio) {
      return res.status(400).json({
        success: false,
        message: 'La hora de fin debe ser posterior a la hora de inicio'
      });
    }

    await horario.update({
      dia,
      horaInicio,
      horaFin,
      tipo,
      aula
    });

    return res.status(200).json({
      success: true,
      message: 'Horario actualizado exitosamente',
      data: horario
    });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el horario',
      error: error.message
    });
  }
};

// Eliminar un horario
const deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;

    const horario = await Horario.findByPk(id);

    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    await horario.destroy();

    return res.status(200).json({
      success: true,
      message: 'Horario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el horario',
      error: error.message
    });
  }
};

// Verificar conflictos de horario
const checkConflicts = async (req, res) => {
  try {
    const { seccionId, dia, horaInicio, horaFin, excludeId } = req.body;

    const seccion = await Seccion.findByPk(seccionId);
    if (!seccion) {
      return res.status(404).json({
        success: false,
        message: 'Sección no encontrada'
      });
    }

    const whereCondition = {
      dia,
      [Op.or]: [
        {
          horaInicio: {
            [Op.lt]: horaFin,
            [Op.gte]: horaInicio
          }
        },
        {
          horaFin: {
            [Op.gt]: horaInicio,
            [Op.lte]: horaFin
          }
        },
        {
          [Op.and]: [
            { horaInicio: { [Op.lte]: horaInicio } },
            { horaFin: { [Op.gte]: horaFin } }
          ]
        }
      ]
    };

    if (excludeId) {
      whereCondition.id = { [Op.ne]: excludeId };
    }

    // Conflictos con el mismo docente
    const conflictosDocente = await Horario.findAll({
      where: whereCondition,
      include: [{
        model: Seccion,
        as: 'seccion',
        where: { docenteId: seccion.docenteId }
      }]
    });

    return res.status(200).json({
      success: true,
      data: {
        hasConflicts: conflictosDocente.length > 0,
        conflicts: conflictosDocente
      }
    });
  } catch (error) {
    console.error('Error al verificar conflictos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar conflictos',
      error: error.message
    });
  }
};

module.exports = {
  createHorario,
  getAllHorarios,
  getHorariosBySeccion,
  getHorariosByDocente,
  getHorarioById,
  updateHorario,
  deleteHorario,
  checkConflicts
};