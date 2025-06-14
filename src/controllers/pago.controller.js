const { Pago, Matricula, Alumno, Usuario } = require('../models');
const { sequelize } = require('../config/database');

// Crear un nuevo pago
const createPago = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      matriculaId,
      monto,
      metodoPago,
      numeroOperacion
    } = req.body;

    // Verificar que exista la matrícula
    const matricula = await Matricula.findByPk(matriculaId, {
      include: [{
        model: Alumno,
        as: 'alumno',
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      }],
      transaction
    });
    
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
        message: 'No se puede registrar pagos para una matrícula anulada'
      });
    }
    
    // Verificar que el monto sea positivo
    if (monto <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor que cero'
      });
    }
    
    // Obtener el total pagado hasta el momento
    const pagosExistentes = await Pago.findAll({
      where: {
        matriculaId,
        estado: 'completado'
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('monto')), 'totalPagado']
      ],
      raw: true,
      transaction
    });
    
    const totalPagado = parseFloat(pagosExistentes[0].totalPagado || 0);
    const montoTotalMatricula = parseFloat(matricula.montoTotal);
    
    // Verificar que el nuevo pago no exceda el monto total de la matrícula
    if (totalPagado + parseFloat(monto) > montoTotalMatricula) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El monto del pago excede el saldo pendiente de la matrícula',
        data: {
          montoTotalMatricula,
          totalPagado,
          saldoPendiente: montoTotalMatricula - totalPagado
        }
      });
    }
    
    // Crear el pago
    const pago = await Pago.create({
      matriculaId,
      monto,
      fechaPago: new Date(),
      metodoPago,
      numeroOperacion,
      estado: 'completado'
    }, { transaction });
    
    // Actualizar el estado de la matrícula si se completó el pago
    const nuevoTotalPagado = totalPagado + parseFloat(monto);
    if (nuevoTotalPagado >= montoTotalMatricula) {
      await matricula.update({ estado: 'pagado' }, { transaction });
    }
    
    // Confirmar la transacción
    await transaction.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Pago registrado exitosamente',
      data: {
        pago,
        estadoMatricula: nuevoTotalPagado >= montoTotalMatricula ? 'pagado' : 'pendiente',
        saldoPendiente: montoTotalMatricula - nuevoTotalPagado
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar el pago',
      error: error.message
    });
  }
};

// Obtener todos los pagos
const getAllPagos = async (req, res) => {
  try {
    const { matriculaId, estado, metodoPago } = req.query;
    
    const whereCondition = {};
    
    if (matriculaId) {
      whereCondition.matriculaId = matriculaId;
    }
    
    if (estado) {
      whereCondition.estado = estado;
    }
    
    if (metodoPago) {
      whereCondition.metodoPago = metodoPago;
    }
    
    const pagos = await Pago.findAll({
      where: whereCondition,
      include: [{
        model: Matricula,
        as: 'matricula',
        include: [{
          model: Alumno,
          as: 'alumno',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'apellido']
          }]
        }]
      }],
      order: [['fechaPago', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count: pagos.length,
      data: pagos
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos',
      error: error.message
    });
  }
};

// Obtener un pago por ID
const getPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pago = await Pago.findByPk(id, {
      include: [{
        model: Matricula,
        as: 'matricula',
        include: [{
          model: Alumno,
          as: 'alumno',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'apellido']
          }]
        }]
      }]
    });
    
    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: pago
    });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el pago',
      error: error.message
    });
  }
};

// Obtener pagos por matrícula
const getPagosByMatricula = async (req, res) => {
  try {
    const { matriculaId } = req.params;
    
    const matricula = await Matricula.findByPk(matriculaId);
    if (!matricula) {
      return res.status(404).json({
        success: false,
        message: 'Matrícula no encontrada'
      });
    }
    
    const pagos = await Pago.findAll({
      where: { matriculaId },
      order: [['fechaPago', 'DESC']]
    });
    
    // Calcular el total pagado
    const totalPagado = pagos
      .filter(pago => pago.estado === 'completado')
      .reduce((sum, pago) => sum + parseFloat(pago.monto), 0);
    
    const montoTotalMatricula = parseFloat(matricula.montoTotal);
    const saldoPendiente = montoTotalMatricula - totalPagado;
    
    return res.status(200).json({
      success: true,
      count: pagos.length,
      data: {
        pagos,
        resumen: {
          montoTotalMatricula,
          totalPagado,
          saldoPendiente
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener pagos por matrícula:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos por matrícula',
      error: error.message
    });
  }
};

// Anular un pago
const anularPago = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    
    const pago = await Pago.findByPk(id, {
      include: [{
        model: Matricula,
        as: 'matricula'
      }],
      transaction
    });
    
    if (!pago) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }
    
    // Verificar que el pago no esté ya anulado
    if (pago.estado === 'anulado') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El pago ya está anulado'
      });
    }
    
    // Anular el pago
    await pago.update({ estado: 'anulado' }, { transaction });
    
    // Actualizar el estado de la matrícula si corresponde
    if (pago.matricula.estado === 'pagado') {
      await pago.matricula.update({ estado: 'pendiente' }, { transaction });
    }
    
    // Confirmar la transacción
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Pago anulado exitosamente',
      data: {
        id: pago.id,
        estado: 'anulado',
        estadoMatricula: 'pendiente'
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al anular pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al anular el pago',
      error: error.message
    });
  }
};

module.exports = {
  createPago,
  getAllPagos,
  getPagoById,
  getPagosByMatricula,
  anularPago
};