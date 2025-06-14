const { Alumno, Usuario, Escuela, PlanEstudio, Matricula } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Crear un nuevo alumno
const createAlumno = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      nombre,
      apellido,
      email,
      password,
      escuelaId,
      planEstudioId,
      codigo,
      dni,
      fechaNacimiento,
      direccion,
      telefono,
      fechaIngreso,
      cicloActual
    } = req.body;

    // Verificar si existe la escuela
    const escuela = await Escuela.findByPk(escuelaId, { transaction });
    if (!escuela) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'La escuela especificada no existe'
      });
    }

    // Verificar si existe el plan de estudio
    const planEstudio = await PlanEstudio.findByPk(planEstudioId, { transaction });
    if (!planEstudio) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'El plan de estudio especificado no existe'
      });
    }

    // Verificar que el plan de estudio pertenezca a la escuela
    if (planEstudio.escuelaId !== escuelaId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'El plan de estudio no pertenece a la escuela especificada'
      });
    }

    // Verificar que el email sea único
    const existingUserEmail = await Usuario.findOne({ 
      where: { email },
      transaction
    });
    
    if (existingUserEmail) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese correo electrónico'
      });
    }

    // Verificar que el código y dni sean únicos
    const existingAlumno = await Alumno.findOne({
      where: {
        [Op.or]: [{ codigo }, { dni }]
      },
      transaction
    });

    if (existingAlumno) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Ya existe un alumno con ese código o DNI'
      });
    }

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rol: 'alumno'
    }, { transaction });

    // Crear el alumno
    const alumno = await Alumno.create({
      usuarioId: usuario.id,
      escuelaId,
      planEstudioId,
      codigo,
      dni,
      fechaNacimiento,
      direccion,
      telefono,
      fechaIngreso: fechaIngreso || new Date(),
      cicloActual: cicloActual || 1,
      estado: 'activo'
    }, { transaction });

    // Confirmar la transacción
    await transaction.commit();

    // Obtener el alumno con sus relaciones
    const alumnoCreado = await Alumno.findByPk(alumno.id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
        },
        {
          model: Escuela,
          as: 'escuela',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: PlanEstudio,
          as: 'planEstudio',
          attributes: ['id', 'nombre', 'codigo']
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Alumno creado exitosamente',
      data: alumnoCreado
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear alumno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el alumno',
      error: error.message
    });
  }
};

// Obtener todos los alumnos
const getAllAlumnos = async (req, res) => {
  try {
    const { escuelaId, planEstudioId, estado, search } = req.query;
    
    const whereCondition = {};
    
    if (escuelaId) {
      whereCondition.escuelaId = escuelaId;
    }
    
    if (planEstudioId) {
      whereCondition.planEstudioId = planEstudioId;
    }
    
    if (estado) {
      whereCondition.estado = estado;
    }
    
    const includeUsuario = {
      model: Usuario,
      as: 'usuario',
      attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
    };
    
    // Si hay búsqueda por nombre, apellido, email o código
    if (search) {
      includeUsuario.where = {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${search}%` } },
          { apellido: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      };
      
      // Si la búsqueda podría ser un código o DNI
      if (search.length <= 20) {
        whereCondition[Op.or] = [
          { codigo: { [Op.iLike]: `%${search}%` } },
          { dni: { [Op.iLike]: `%${search}%` } }
        ];
      }
    }
    
    const alumnos = await Alumno.findAll({
      where: whereCondition,
      include: [
        includeUsuario,
        {
          model: Escuela,
          as: 'escuela',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: PlanEstudio,
          as: 'planEstudio',
          attributes: ['id', 'nombre', 'codigo']
        }
      ],
      order: [
        [{ model: Usuario, as: 'usuario' }, 'apellido', 'ASC'],
        [{ model: Usuario, as: 'usuario' }, 'nombre', 'ASC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: alumnos.length,
      data: alumnos
    });
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los alumnos',
      error: error.message
    });
  }
};

// Obtener un alumno por ID
const getAlumnoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alumno = await Alumno.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
        },
        {
          model: Escuela,
          as: 'escuela',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: PlanEstudio,
          as: 'planEstudio',
          attributes: ['id', 'nombre', 'codigo']
        }
      ]
    });
    
    if (!alumno) {
      return res.status(404).json({
        success: false,
        message: 'Alumno no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: alumno
    });
  } catch (error) {
    console.error('Error al obtener alumno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el alumno',
      error: error.message
    });
  }
};

// Actualizar un alumno
const updateAlumno = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      email,
      password,
      escuelaId,
      planEstudioId,
      direccion,
      telefono,
      cicloActual,
      estado
    } = req.body;
    
    const alumno = await Alumno.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario'
      }],
      transaction
    });
    
    if (!alumno) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Alumno no encontrado'
      });
    }
    
    // Verificar si existe la escuela
    if (escuelaId) {
      const escuela = await Escuela.findByPk(escuelaId, { transaction });
      if (!escuela) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'La escuela especificada no existe'
        });
      }
    }
    
    // Verificar si existe el plan de estudio
    if (planEstudioId) {
      const planEstudio = await PlanEstudio.findByPk(planEstudioId, { transaction });
      if (!planEstudio) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'El plan de estudio especificado no existe'
        });
      }
      
      // Verificar que el plan de estudio pertenezca a la escuela
      const escuelaIdToCheck = escuelaId || alumno.escuelaId;
      if (planEstudio.escuelaId !== escuelaIdToCheck) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'El plan de estudio no pertenece a la escuela especificada'
        });
      }
    }
    
    // Actualizar el usuario
    const usuarioUpdateData = {};
    if (nombre) usuarioUpdateData.nombre = nombre;
    if (apellido) usuarioUpdateData.apellido = apellido;
    if (email && email !== alumno.usuario.email) {
      // Verificar que el email sea único
      const existingUserEmail = await Usuario.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: alumno.usuario.id }
        },
        transaction
      });
      
      if (existingUserEmail) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese correo electrónico'
        });
      }
      
      usuarioUpdateData.email = email;
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      usuarioUpdateData.password = await bcrypt.hash(password, salt);
    }
    
    if (Object.keys(usuarioUpdateData).length > 0) {
      await alumno.usuario.update(usuarioUpdateData, { transaction });
    }
    
    // Actualizar el alumno
    const alumnoUpdateData = {};
    if (escuelaId) alumnoUpdateData.escuelaId = escuelaId;
    if (planEstudioId) alumnoUpdateData.planEstudioId = planEstudioId;
    if (direccion !== undefined) alumnoUpdateData.direccion = direccion;
    if (telefono !== undefined) alumnoUpdateData.telefono = telefono;
    if (cicloActual) alumnoUpdateData.cicloActual = cicloActual;
    if (estado) alumnoUpdateData.estado = estado;
    
    if (Object.keys(alumnoUpdateData).length > 0) {
      await alumno.update(alumnoUpdateData, { transaction });
    }
    
    // Confirmar la transacción
    await transaction.commit();
    
    // Obtener el alumno actualizado con sus relaciones
    const alumnoActualizado = await Alumno.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
        },
        {
          model: Escuela,
          as: 'escuela',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: PlanEstudio,
          as: 'planEstudio',
          attributes: ['id', 'nombre', 'codigo']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Alumno actualizado exitosamente',
      data: alumnoActualizado
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar alumno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el alumno',
      error: error.message
    });
  }
};

// Cambiar el estado de un alumno
const updateAlumnoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!['activo', 'egresado', 'retirado', 'suspendido'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }
    
    const alumno = await Alumno.findByPk(id);
    
    if (!alumno) {
      return res.status(404).json({
        success: false,
        message: 'Alumno no encontrado'
      });
    }
    
    await alumno.update({ estado });
    
    return res.status(200).json({
      success: true,
      message: 'Estado de alumno actualizado exitosamente',
      data: { id, estado }
    });
  } catch (error) {
    console.error('Error al actualizar estado de alumno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado del alumno',
      error: error.message
    });
  }
};

// Obtener matrículas de un alumno
const getMatriculasByAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alumno = await Alumno.findByPk(id);
    
    if (!alumno) {
      return res.status(404).json({
        success: false,
        message: 'Alumno no encontrado'
      });
    }
    
    const matriculas = await Matricula.findAll({
      where: { alumnoId: id },
      include: [
        {
          model: Alumno,
          as: 'alumno',
          attributes: ['id', 'codigo', 'dni'],
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'apellido']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count: matriculas.length,
      data: matriculas
    });
  } catch (error) {
    console.error('Error al obtener matrículas de alumno:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las matrículas del alumno',
      error: error.message
    });
  }
};

module.exports = {
  createAlumno,
  getAllAlumnos,
  getAlumnoById,
  updateAlumno,
  updateAlumnoEstado,
  getMatriculasByAlumno
};