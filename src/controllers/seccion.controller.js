const { Seccion, Curso, PeriodoAcademico, Docente, Horario, Usuario } = require('../models');
const { Op } = require('sequelize');

// Crear una nueva sección
const createSeccion = async (req, res) => {
  try {
    const {
      cursoId,
      periodoAcademicoId,
      docenteId,
      nombre,
      capacidadMaxima
    } = req.body;

    // Verificar que exista el curso
    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'El curso especificado no existe'
      });
    }

    // Verificar que exista el periodo académico
    const periodoAcademico = await PeriodoAcademico.findByPk(periodoAcademicoId);
    if (!periodoAcademico) {
      return res.status(404).json({
        success: false,
        message: 'El periodo académico especificado no existe'
      });
    }

    // Verificar que exista el docente
    const docente = await Docente.findByPk(docenteId);
    if (!docente) {
      return res.status(404).json({
        success: false,
        message: 'El docente especificado no existe'
      });
    }

    // Verificar que no exista una sección con el mismo nombre para el mismo curso y periodo
    const existingSeccion = await Seccion.findOne({
      where: {
        cursoId,
        periodoAcademicoId,
        nombre
      }
    });

    if (existingSeccion) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una sección con este nombre para el curso y periodo especificados'
      });
    }

    // Crear la sección
    const seccion = await Seccion.create({
      cursoId,
      periodoAcademicoId,
      docenteId,
      nombre,
      capacidadMaxima: capacidadMaxima || 40,
      capacidadActual: 0
    });

    return res.status(201).json({
      success: true,
      message: 'Sección creada exitosamente',
      data: seccion
    });
  } catch (error) {
    console.error('Error al crear sección:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la sección',
      error: error.message
    });
  }
};

// Obtener todas las secciones
const getAllSecciones = async (req, res) => {
  try {
    const { cursoId, periodoAcademicoId, docenteId, activo } = req.query;
    
    const whereCondition = {};
    
    if (cursoId) {
      whereCondition.cursoId = cursoId;
    }
    
    if (periodoAcademicoId) {
      whereCondition.periodoAcademicoId = periodoAcademicoId;
    }
    
    if (docenteId) {
        whereCondition.docenteId = docenteId;
      }
      
      if (activo !== undefined) {
        whereCondition.activo = activo === 'true';
      }
      
      const secciones = await Seccion.findAll({
        where: whereCondition,
        include: [
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
          },
          {
            model: PeriodoAcademico,
            as: 'periodoAcademico',
            attributes: ['id', 'nombre', 'codigo']
          },
          {
            model: Docente,
            as: 'docente',
            attributes: ['id', 'codigo', 'especialidad'],
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'apellido']
            }]
          }
        ],
        order: [
          [{ model: Curso, as: 'curso' }, 'codigo', 'ASC'],
          ['nombre', 'ASC']
        ]
      });
      
      return res.status(200).json({
        success: true,
        count: secciones.length,
        data: secciones
      });
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las secciones',
        error: error.message
      });
    }
  };
  
  // Obtener secciones por periodo académico
  const getSeccionesByPeriodoAcademico = async (req, res) => {
    try {
      const { periodoAcademicoId } = req.params;
      
      const periodoAcademico = await PeriodoAcademico.findByPk(periodoAcademicoId);
      if (!periodoAcademico) {
        return res.status(404).json({
          success: false,
          message: 'Periodo académico no encontrado'
        });
      }
      
      const secciones = await Seccion.findAll({
        where: { periodoAcademicoId },
        include: [
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
          },
          {
            model: Docente,
            as: 'docente',
            attributes: ['id', 'codigo'],
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'apellido']
            }]
          }
        ],
        order: [
          [{ model: Curso, as: 'curso' }, 'ciclo', 'ASC'],
          [{ model: Curso, as: 'curso' }, 'codigo', 'ASC'],
          ['nombre', 'ASC']
        ]
      });
      
      return res.status(200).json({
        success: true,
        count: secciones.length,
        data: secciones
      });
    } catch (error) {
      console.error('Error al obtener secciones por periodo académico:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las secciones por periodo académico',
        error: error.message
      });
    }
  };
  
  // Obtener secciones por curso y periodo académico
  const getSeccionesByCursoAndPeriodo = async (req, res) => {
    try {
      const { cursoId, periodoAcademicoId } = req.params;
      
      const curso = await Curso.findByPk(cursoId);
      if (!curso) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
      }
      
      const periodoAcademico = await PeriodoAcademico.findByPk(periodoAcademicoId);
      if (!periodoAcademico) {
        return res.status(404).json({
          success: false,
          message: 'Periodo académico no encontrado'
        });
      }
      
      const secciones = await Seccion.findAll({
        where: { 
          cursoId,
          periodoAcademicoId,
          activo: true
        },
        include: [
          {
            model: Docente,
            as: 'docente',
            attributes: ['id', 'codigo'],
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'apellido']
            }]
          },
          {
            model: Horario,
            as: 'horarios'
          }
        ],
        order: [['nombre', 'ASC']]
      });
      
      return res.status(200).json({
        success: true,
        count: secciones.length,
        data: secciones
      });
    } catch (error) {
      console.error('Error al obtener secciones por curso y periodo:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las secciones por curso y periodo',
        error: error.message
      });
    }
  };
  
  // Obtener una sección por ID
  const getSeccionById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const seccion = await Seccion.findByPk(id, {
        include: [
          {
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos', 'horasTeoricas', 'horasPracticas']
          },
          {
            model: PeriodoAcademico,
            as: 'periodoAcademico',
            attributes: ['id', 'nombre', 'codigo', 'fechaInicio', 'fechaFin']
          },
          {
            model: Docente,
            as: 'docente',
            attributes: ['id', 'codigo', 'especialidad', 'gradoAcademico'],
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'apellido', 'email']
            }]
          },
          {
            model: Horario,
            as: 'horarios'
          }
        ]
      });
      
      if (!seccion) {
        return res.status(404).json({
          success: false,
          message: 'Sección no encontrada'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: seccion
      });
    } catch (error) {
      console.error('Error al obtener sección:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la sección',
        error: error.message
      });
    }
  };
  
  // Actualizar una sección
  const updateSeccion = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        docenteId,
        nombre,
        capacidadMaxima,
        activo
      } = req.body;
      
      const seccion = await Seccion.findByPk(id);
      
      if (!seccion) {
        return res.status(404).json({
          success: false,
          message: 'Sección no encontrada'
        });
      }
      
      // Verificar que exista el docente si se cambia
      if (docenteId) {
        const docente = await Docente.findByPk(docenteId);
        if (!docente) {
          return res.status(404).json({
            success: false,
            message: 'El docente especificado no existe'
          });
        }
      }
      
      // Verificar que no exista una sección con el mismo nombre para el mismo curso y periodo
      if (nombre && nombre !== seccion.nombre) {
        const existingSeccion = await Seccion.findOne({
          where: {
            cursoId: seccion.cursoId,
            periodoAcademicoId: seccion.periodoAcademicoId,
            nombre,
            id: { [Op.ne]: id }
          }
        });
        
        if (existingSeccion) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe una sección con este nombre para el curso y periodo especificados'
          });
        }
      }
      
      // Validar capacidad máxima
      if (capacidadMaxima && capacidadMaxima < seccion.capacidadActual) {
        return res.status(400).json({
          success: false,
          message: 'La capacidad máxima no puede ser menor que la capacidad actual'
        });
      }
      
      // Actualizar la sección
      await seccion.update({
        docenteId: docenteId || seccion.docenteId,
        nombre: nombre || seccion.nombre,
        capacidadMaxima: capacidadMaxima || seccion.capacidadMaxima,
        activo: activo !== undefined ? activo : seccion.activo
      });
      
      return res.status(200).json({
        success: true,
        message: 'Sección actualizada exitosamente',
        data: seccion
      });
    } catch (error) {
      console.error('Error al actualizar sección:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar la sección',
        error: error.message
      });
    }
  };
  
  // Eliminar una sección (lógicamente)
  const deleteSeccion = async (req, res) => {
    try {
      const { id } = req.params;
      
      const seccion = await Seccion.findByPk(id, {
        include: [{
          model: Horario,
          as: 'horarios'
        }]
      });
      
      if (!seccion) {
        return res.status(404).json({
          success: false,
          message: 'Sección no encontrada'
        });
      }
      
      // Verificar si tiene capacidad actual (alumnos matriculados)
      if (seccion.capacidadActual > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar una sección con alumnos matriculados'
        });
      }
      
      // Eliminar los horarios asociados
      if (seccion.horarios && seccion.horarios.length > 0) {
        await Promise.all(seccion.horarios.map(horario => horario.destroy()));
      }
      
      // Desactivar la sección
      await seccion.update({ activo: false });
      
      return res.status(200).json({
        success: true,
        message: 'Sección eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar sección:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar la sección',
        error: error.message
      });
    }
  };
  
  module.exports = {
    createSeccion,
    getAllSecciones,
    getSeccionesByPeriodoAcademico,
    getSeccionesByCursoAndPeriodo,
    getSeccionById,
    updateSeccion,
    deleteSeccion
  };