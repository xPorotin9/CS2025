const { DetalleMatricula, Matricula, Seccion, Curso } = require('../models');
const { sequelize } = require('../config/database');

// Obtener todos los detalles de matrícula
const getAllDetallesMatricula = async (req, res) => {
  try {
    const { matriculaId, seccionId, estado } = req.query;
    
    const whereCondition = {};
    
    if (matriculaId) {
      whereCondition.matriculaId = matriculaId;
    }
    
    if (seccionId) {
      whereCondition.seccionId = seccionId;
    }
    
    if (estado) {
      whereCondition.estado = estado;
    }
    
    const detallesMatricula = await DetalleMatricula.findAll({
      where: whereCondition,
      include: [
        {
          model: Matricula,
          as: 'matricula',
          attributes: ['id', 'alumnoId', 'periodoAcademicoId', 'fechaMatricula', 'estado']
        },
        {
          model: Seccion,
          as: 'seccion',
          include: [{
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
          }]
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: detallesMatricula.length,
      data: detallesMatricula
    });
  } catch (error) {
    console.error('Error al obtener detalles de matrícula:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles de matrícula',
      error: error.message
    });
  }
};

// Obtener un detalle de matrícula por ID
const getDetalleMatriculaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const detalleMatricula = await DetalleMatricula.findByPk(id, {
      include: [
        {
          model: Matricula,
          as: 'matricula'
        },
        {
          model: Seccion,
          as: 'seccion',
          include: [{
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
          }]
        }
      ]
    });
    
    if (!detalleMatricula) {
      return res.status(404).json({
        success: false,
        message: 'Detalle de matrícula no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: detalleMatricula
    });
  } catch (error) {
    console.error('Error al obtener detalle de matrícula:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el detalle de matrícula',
      error: error.message
    });
  }
};

// Obtener detalles de matrícula por matrícula
const getDetallesMatriculaByMatricula = async (req, res) => {
  try {
    const { matriculaId } = req.params;
    
    const matricula = await Matricula.findByPk(matriculaId);
    if (!matricula) {
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }
    
    const detallesMatricula = await DetalleMatricula.findAll({
      where: { matriculaId },
      include: [{
        model: Seccion,
        as: 'seccion',
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
        }]
      }]
    });
    
    return res.status(200).json({
      success: true,
      count: detallesMatricula.length,
      data: detallesMatricula
    });
  } catch (error) {
    console.error('Error al obtener detalles de matrícula por matrícula:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles de matrícula por matrícula',
      error: error.message
    });
  }
};

// Añadir un detalle de matrícula
const addDetalleMatricula = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { matriculaId, seccionId } = req.body;
    
    // Verificar que exista la matrícula
    const matricula = await Matricula.findByPk(matriculaId, { transaction });
    if (!matricula) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }
    
    // Verificar que la matrícula no esté anulada
    if (matricula.estado === 'anulado') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No se puede añadir cursos a una matrícula anulada'
      });
    }
    
    // Verificar que exista la sección
    const seccion = await Seccion.findByPk(seccionId, {
      include: [{
        model: Curso,
        as: 'curso'
      }],
      transaction
    });
    
    if (!seccion) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Sección no encontrada'
      });
    }
    
    // Verificar que la sección tenga cupo
    if (seccion.capacidadActual >= seccion.capacidadMaxima) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'La sección no tiene cupo disponible'
      });
    }
    
    // Verificar que el alumno no esté ya matriculado en la misma sección
    const existingDetalle = await DetalleMatricula.findOne({
      where: {
        matriculaId,
        seccionId
      },
      transaction
    });
    
    if (existingDetalle) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El alumno ya está matriculado en esta sección'
      });
    }
    
    // Verificar que el alumno no esté matriculado en otra sección del mismo curso
    const existingCursoDetalle = await DetalleMatricula.findOne({
      include: [{
        model: Seccion,
        as: 'seccion',
        where: {
          cursoId: seccion.cursoId
        }
      }],
      where: {
        matriculaId
      },
      transaction
    });
    
    if (existingCursoDetalle) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El alumno ya está matriculado en otra sección del mismo curso'
      });
    }
    
    // Crear el detalle de matrícula
    const detalleMatricula = await DetalleMatricula.create({
      matriculaId,
      seccionId,
      estado: 'activo'
    }, { transaction });
    
    // Incrementar la capacidad actual de la sección
    await seccion.increment('capacidadActual', { transaction });
    
    // Incrementar los créditos y actualizar el monto total de la matrícula
    await matricula.increment('creditosInscritos', { by: seccion.curso.creditos, transaction });
    
    // Actualizar el monto total (esto dependerá de la lógica de negocio)
    const costoCredito = 100; // Este valor podría venir de una configuración
    await matricula.increment('montoTotal', { by: seccion.curso.creditos * costoCredito, transaction });
    
    // Confirmar la transacción
    await transaction.commit();
    
    // Obtener el detalle de matrícula con sus relaciones
    const detalleMatriculaCreado = await DetalleMatricula.findByPk(detalleMatricula.id, {
      include: [
        {
          model: Matricula,
          as: 'matricula',
          attributes: ['id', 'alumnoId', 'creditosInscritos', 'montoTotal']
        },
        {
          model: Seccion,
          as: 'seccion',
          include: [{
            model: Curso,
            as: 'curso',
            attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
          }]
        }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Detalle de matrícula creado exitosamente',
      data: detalleMatriculaCreado
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al añadir detalle de matrícula:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al añadir el detalle de matrícula',
      error: error.message
    });
  }
};

// Retirar un curso (actualizar estado de detalle de matrícula)
const retirarCurso = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    
    const detalleMatricula = await DetalleMatricula.findByPk(id, {
      include: [
        {
          model: Matricula,
          as: 'matricula'
        },
        {
          model: Seccion,
          as: 'seccion',
          include: [{
            model: Curso,
            as: 'curso'
          }]
        }
      ],
      transaction
    });
    
    if (!detalleMatricula) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Detalle de matrícula no encontrado'
      });
    }
    
    // Verificar que la matrícula no esté anulada
    if (detalleMatricula.matricula.estado === 'anulado') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No se puede retirar cursos de una matrícula anulada'
      });
    }
    
    // Verificar que el detalle no esté ya retirado
    if (detalleMatricula.estado === 'retirado') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El curso ya está retirado'
      });
    }
    
    // Actualizar el estado del detalle
    await detalleMatricula.update({ estado: 'retirado' }, { transaction });
    
    // Decrementar la capacidad actual de la sección
    await detalleMatricula.seccion.decrement('capacidadActual', { transaction });
    
    // Decrementar los créditos y actualizar el monto total de la matrícula
    await detalleMatricula.matricula.decrement('creditosInscritos', { 
      by: detalleMatricula.seccion.curso.creditos, 
      transaction 
    });
    
    // Actualizar el monto total (esto dependerá de la lógica de negocio)
    const costoCredito = 100; // Este valor podría venir de una configuración
    await detalleMatricula.matricula.decrement('montoTotal', { 
      by: detalleMatricula.seccion.curso.creditos * costoCredito, 
      transaction 
    });
    
    // Confirmar la transacción
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Curso retirado exitosamente',
      data: {
        id: detalleMatricula.id,
        estado: 'retirado'
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al retirar curso:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al retirar el curso',
      error: error.message
    });
  }
};

module.exports = {
  getAllDetallesMatricula,
  getDetalleMatriculaById,
  getDetallesMatriculaByMatricula,
  addDetalleMatricula,
  retirarCurso
};