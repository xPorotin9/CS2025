const { Horario, Seccion, Curso, PeriodoAcademico, Docente } = require('../models');
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

    // Verificar que exista la sección
    const seccion = await Seccion.findByPk(seccionId, {
      include: [
        {
          model: Curso,
          as: 'curso'
        },
        {
          model: Docente,
          as: 'docente'
        },
        {
          model: PeriodoAcademico,
          as: 'periodoAcademico'
        }
      ]
    });
    
    if (!seccion) {
      return res.status(404).json({
        success: false,
        message: 'La sección especificada no existe'
      });
    }

    // Validar el formato de hora
    const horaInicioDate = new Date(`2000-01-01T${horaInicio}`);
    const horaFinDate = new Date(`2000-01-01T${horaFin}`);
    
    if (isNaN(horaInicioDate) || isNaN(horaFinDate)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de hora inválido. Use formato HH:MM:SS'
      });
    }
    
    if (horaInicioDate >= horaFinDate) {
      return res.status(400).json({
        success: false,
        message: 'La hora de inicio debe ser anterior a la hora de fin'
      });
    }

    // Verificar que no exista un cruce de horarios para la misma aula
    const horariosCruzadosAula = await Horario.findAll({
      include: [{
        model: Seccion,
        as: 'seccion',
        where: {
          periodoAcademicoId: seccion.periodoAcademicoId
        }
      }],
      where: {
        dia,
        aula,
        [Op.or]: [
          {
            // Hora inicio del nuevo horario está dentro de un horario existente
            horaInicio: {
              [Op.lt]: horaFin,
              [Op.gte]: horaInicio
            }
          },
          {
            // Hora fin del nuevo horario está dentro de un horario existente
            horaFin: {
              [Op.lte]: horaFin,
              [Op.gt]: horaInicio
            }
          },
          {
            // El nuevo horario contiene completamente a un horario existente
            horaInicio: {
              [Op.lte]: horaInicio
            },
            horaFin: {
              [Op.gte]: horaFin
            }
          }
        ]
      }
    });
    
    if (horariosCruzadosAula.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El aula ya está ocupada en ese horario'
      });
    }

    // Verificar que no exista un cruce de horarios para el mismo docente
    const horariosCruzadosDocente = await Horario.findAll({
      include: [{
        model: Seccion,
        as: 'seccion',
        where: {
          periodoAcademicoId: seccion.periodoAcademicoId,
          docenteId: seccion.docenteId
        }
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
              [Op.lte]: horaFin,
              [Op.gt]: horaInicio
            }
          },
          {
            horaInicio: {
              [Op.lte]: horaInicio
            },
            horaFin: {
              [Op.gte]: horaFin
            }
          }
        ]
      }
    });
    
    if (horariosCruzadosDocente.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El docente ya tiene otro curso asignado en ese horario'
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
    const { seccionId, dia, aula } = req.query;
    
    const whereCondition = {};
    
    if (seccionId) {
      whereCondition.seccionId = seccionId;
    }
    
    if (dia) {
      whereCondition.dia = dia;
    }
    
    if (aula) {
      whereCondition.aula = aula;
    }
    
    const horarios = await Horario.findAll({
      where: whereCondition,
      include: [{
        model: Seccion,
        as: 'seccion',
        include: [
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo']
          },
          {
            model: PeriodoAcademico,
            as: 'periodoAcademico',
            attributes: ['id', 'nombre', 'codigo']
          },
          {
            model: Docente,
            as: 'docente',
            attributes: ['id', 'codigo']
          }
        ]
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
    
    const seccion = await Seccion.findByPk(seccionId);
    if (!seccion) {
      return res.status(404).json({
        success: false,
        message: 'Sección no encontrada'
      });
    }
    
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
      message: 'Error al obtener los horarios por sección',
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
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo']
          },
          {
            model: PeriodoAcademico,
            as: 'periodoAcademico',
            attributes: ['id', 'nombre', 'codigo']
          },
          {
            model: Docente,
            as: 'docente',
            attributes: ['id', 'codigo']
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
    const {
      dia,
      horaInicio,
      horaFin,
      tipo,
      aula
    } = req.body;
    
    const horario = await Horario.findByPk(id, {
      include: [{
        model: Seccion,
        as: 'seccion',
        include: [
          {
            model: PeriodoAcademico,
            as: 'periodoAcademico'
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
    
    // Validar el formato de hora si se proporciona
    if (horaInicio && horaFin) {
      const horaInicioDate = new Date(`2000-01-01T${horaInicio}`);
      const horaFinDate = new Date(`2000-01-01T${horaFin}`);
      
      if (isNaN(horaInicioDate) || isNaN(horaFinDate)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de hora inválido. Use formato HH:MM:SS'
        });
      }
      
      if (horaInicioDate >= horaFinDate) {
        return res.status(400).json({
          success: false,
          message: 'La hora de inicio debe ser anterior a la hora de fin'
        });
      }
    }
    
    // Verificar cruces de horario solo si se cambia día, hora o aula
    if (dia || horaInicio || horaFin || aula) {
      const diaToCheck = dia || horario.dia;
      const horaInicioToCheck = horaInicio || horario.horaInicio;
      const horaFinToCheck = horaFin || horario.horaFin;
      const aulaToCheck = aula || horario.aula;
      
      // Verificar que no exista un cruce de horarios para la misma aula
      const horariosCruzadosAula = await Horario.findAll({
        include: [{
          model: Seccion,
          as: 'seccion',
          where: {
            periodoAcademicoId: horario.seccion.periodoAcademicoId
          }
        }],
        where: {
          id: { [Op.ne]: id },
          dia: diaToCheck,
          aula: aulaToCheck,
          [Op.or]: [
            {
              horaInicio: {
                [Op.lt]: horaFinToCheck,
                [Op.gte]: horaInicioToCheck
              }
            },
            {
              horaFin: {
                [Op.lte]: horaFinToCheck,
                [Op.gt]: horaInicioToCheck
              }
            },
            {
              horaInicio: {
                [Op.lte]: horaInicioToCheck
              },
              horaFin: {
                [Op.gte]: horaFinToCheck
              }
            }
          ]
        }
      });
      
      if (horariosCruzadosAula.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El aula ya está ocupada en ese horario'
        });
      }
      
      // Verificar que no exista un cruce de horarios para el mismo docente
      const horariosCruzadosDocente = await Horario.findAll({
        include: [{
          model: Seccion,
          as: 'seccion',
          where: {
            periodoAcademicoId: horario.seccion.periodoAcademicoId,
            docenteId: horario.seccion.docenteId
          }
        }],
        where: {
          id: { [Op.ne]: id },
          dia: diaToCheck,
          [Op.or]: [
            {
              horaInicio: {
                [Op.lt]: horaFinToCheck,
                [Op.gte]: horaInicioToCheck
              }
            },
            {
              horaFin: {
                [Op.lte]: horaFinToCheck,
                [Op.gt]: horaInicioToCheck
              }
            },
            {
              horaInicio: {
                [Op.lte]: horaInicioToCheck
              },
              horaFin: {
                [Op.gte]: horaFinToCheck
              }
            }
          ]
        }
      });
      
      if (horariosCruzadosDocente.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El docente ya tiene otro curso asignado en ese horario'
        });
      }
    }
    
    // Actualizar el horario
    await horario.update({
      dia: dia || horario.dia,
      horaInicio: horaInicio || horario.horaInicio,
      horaFin: horaFin || horario.horaFin,
      tipo: tipo || horario.tipo,
      aula: aula || horario.aula
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

module.exports = {
  createHorario,
  getAllHorarios,
  getHorariosBySeccion,
  getHorarioById,
  updateHorario,
  deleteHorario
};