const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pago.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo pago
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Pagos']
  // #swagger.summary = 'Crear un nuevo pago'
  // #swagger.description = 'Registra un nuevo pago para una matrícula'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del pago',
        required: true,
        schema: {
            matriculaId: 1,
            monto: 800,
            metodoPago: 'transferencia',
            numeroOperacion: 'TRF12345'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Pago registrado exitosamente',
        schema: {
            success: true,
            message: 'Pago registrado exitosamente',
            data: {
                pago: {
                    id: 1,
                    matriculaId: 1,
                    monto: 800,
                    fechaPago: '2023-01-01T00:00:00.000Z',
                    metodoPago: 'transferencia',
                    numeroOperacion: 'TRF12345',
                    estado: 'completado',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                estadoMatricula: 'pagado',
                saldoPendiente: 0
            }
        }
   } */
  pagoController.createPago(req, res);
});

// Obtener todos los pagos
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Pagos']
  // #swagger.summary = 'Obtener todos los pagos'
  // #swagger.description = 'Obtiene la lista de todos los pagos con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['matriculaId'] = { in: 'query', description: 'ID de la matrícula para filtrar' }
  // #swagger.parameters['estado'] = { in: 'query', description: 'Estado del pago para filtrar (pendiente, completado, anulado)' }
  // #swagger.parameters['metodoPago'] = { in: 'query', description: 'Método de pago para filtrar (efectivo, tarjeta, transferencia, otro)' }
  /* #swagger.responses[200] = {
        description: 'Lista de pagos obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    matriculaId: 1,
                    monto: 800,
                    fechaPago: '2023-01-01T00:00:00.000Z',
                    metodoPago: 'transferencia',
                    numeroOperacion: 'TRF12345',
                    estado: 'completado',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    matricula: {
                        id: 1,
                        alumno: {
                            id: 1,
                            codigo: 'ALU001',
                            dni: '12345679',
                            usuario: {
                                nombre: 'Pedro',
                                apellido: 'Sánchez'
                            }
                        }
                    }
                },
                {
                    id: 2,
                    matriculaId: 2,
                    monto: 600,
                    fechaPago: '2023-01-02T00:00:00.000Z',
                    metodoPago: 'efectivo',
                    numeroOperacion: null,
                    estado: 'completado',
                    createdAt: '2023-01-02T00:00:00.000Z',
                    updatedAt: '2023-01-02T00:00:00.000Z',
                    matricula: {
                        id: 2,
                        alumno: {
                            id: 2,
                            codigo: 'ALU002',
                            dni: '98765432',
                            usuario: {
                                nombre: 'María',
                                apellido: 'López'
                            }
                        }
                    }
                }
            ]
        }
   } */
  pagoController.getAllPagos(req, res);
});

// Obtener pagos por matrícula
router.get('/matricula/:matriculaId', verifyToken, (req, res) => {
  // #swagger.tags = ['Pagos']
  // #swagger.summary = 'Obtener pagos por matrícula'
  // #swagger.description = 'Obtiene todos los pagos que pertenecen a una matrícula específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['matriculaId'] = { description: 'ID de la matrícula' }
  /* #swagger.responses[200] = {
        description: 'Lista de pagos por matrícula obtenida exitosamente',
        schema: {
            success: true,
            count: 1,
            data: {
                pagos: [
                    {
                        id: 1,
                        matriculaId: 1,
                        monto: 800,
                        fechaPago: '2023-01-01T00:00:00.000Z',
                        metodoPago: 'transferencia',
                        numeroOperacion: 'TRF12345',
                        estado: 'completado',
                        createdAt: '2023-01-01T00:00:00.000Z',
                        updatedAt: '2023-01-01T00:00:00.000Z'
                    }
                ],
                resumen: {
                    montoTotalMatricula: 800,
                    totalPagado: 800,
                    saldoPendiente: 0
                }
            }
        }
   } */
  pagoController.getPagosByMatricula(req, res);
});

// Obtener un pago por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Pagos']
  // #swagger.summary = 'Obtener un pago por ID'
  // #swagger.description = 'Obtiene los detalles de un pago específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del pago' }
  /* #swagger.responses[200] = {
        description: 'Pago obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                matriculaId: 1,
                monto: 800,
                fechaPago: '2023-01-01T00:00:00.000Z',
                metodoPago: 'transferencia',
                numeroOperacion: 'TRF12345',
                estado: 'completado',
createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                matricula: {
                    id: 1,
                    alumno: {
                        id: 1,
                        codigo: 'ALU001',
                        dni: '12345679',
                        usuario: {
                            nombre: 'Pedro',
                            apellido: 'Sánchez'
                        }
                    }
                }
            }
        }
   } */
  pagoController.getPagoById(req, res);
});

// Anular un pago
router.patch('/:id/anular', verifyToken, (req, res) => {
  // #swagger.tags = ['Pagos']
  // #swagger.summary = 'Anular un pago'
  // #swagger.description = 'Anula un pago existente y actualiza el estado de la matrícula si es necesario'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del pago' }
  /* #swagger.responses[200] = {
        description: 'Pago anulado exitosamente',
        schema: {
            success: true,
            message: 'Pago anulado exitosamente',
            data: {
                id: 1,
                estado: 'anulado',
                estadoMatricula: 'pendiente'
            }
        }
   } */
  pagoController.anularPago(req, res);
});

module.exports = router;