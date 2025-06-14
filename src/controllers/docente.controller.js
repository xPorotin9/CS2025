const { Docente, Usuario, Facultad, Seccion } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');

// Crear un nuevo docente
const createDocente = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      nombre,
      apellido,
      email,
      password,
      facultadId,
      codigo,
      dni,
      especialidad,
      gradoAcademico,
      fechaIngreso
    } = req.body;

    // Verificar si existe la facultad
    const facultad = await Facultad.findByPk(facultadId);
    if (!facultad) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'La facultad especificada no existe'
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
    const existingDocente = await Docente.findOne({
      where: {
        [Op.or]: [{ codigo }, { dni }]
      },
      transaction
    });

    if (existingDocente) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Ya existe un docente con ese código o DNI'
      });
    }

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rol: 'docente'
    }, { transaction });

    // Crear el docente
    const docente = await Docente.create({
      usuarioId: usuario.id,
      facultadId,
      codigo,
      dni,
      especialidad,
      gradoAcademico,
      fechaIngreso: fechaIngreso || new Date()
    }, { transaction });

    // Confirmar la transacción
    await transaction.commit();

    // Obtener el docente con sus relaciones
    const docenteCreado = await Docente.findByPk(docente.id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
        },
        {
          model: Facultad,
          as: 'facultad',
          attributes: ['id', 'nombre', 'codigo']
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Docente creado exitosamente',
      data: docenteCreado
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear docente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el docente',
      error: error.message
    });
  }
};

// Obtener todos los docentes
const getAllDocentes = async (req, res) => {
  try {
    const { facultadId, activo, search } = req.query;
    
    const whereCondition = {};
    
    if (facultadId) {
      whereCondition.facultadId = facultadId;
    }
    
    if (activo !== undefined) {
      whereCondition.activo = activo === 'true';
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
      
      // Si la búsqueda podría ser un código
      if (search.length <= 20) {
        whereCondition.codigo = { [Op.iLike]: `%${search}%` };
      }
    }
    
    const docentes = await Docente.findAll({
      where: whereCondition,
      include: [
        includeUsuario,
        {
          model: Facultad,
          as: 'facultad',
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
      count: docentes.length,
      data: docentes
    });
  } catch (error) {
    console.error('Error al obtener docentes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los docentes',
      error: error.message
    });
  }
};

// Obtener un docente por ID
const getDocenteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docente = await Docente.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
        },
        {
          model: Facultad,
          as: 'facultad',
          attributes: ['id', 'nombre', 'codigo']
        },
        {
          model: Seccion,
          as: 'secciones',
          attributes: ['id', 'nombre', 'capacidadMaxima', 'capacidadActual']
        }
      ]
    });
    
    if (!docente) {
      return res.status(404).json({
        success: false,
        message: 'Docente no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: docente
    });
  } catch (error) {
    console.error('Error al obtener docente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el docente',
      error: error.message
    });
  }
};

// Actualizar un docente
const updateDocente = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      email,
      password,
      facultadId,
      especialidad,
      gradoAcademico,
      activo
    } = req.body;
    
    const docente = await Docente.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario'
      }],
      transaction
    });
    
    if (!docente) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Docente no encontrado'
      });
    }
    
    // Verificar si existe la facultad
    if (facultadId) {
      const facultad = await Facultad.findByPk(facultadId, { transaction });
      if (!facultad) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'La facultad especificada no existe'
        });
      }
    }
    
    // Actualizar el usuario
    const usuarioUpdateData = {};
    if (nombre) usuarioUpdateData.nombre = nombre;
    if (apellido) usuarioUpdateData.apellido = apellido;
    if (email && email !== docente.usuario.email) {
      // Verificar que el email sea único
      const existingUserEmail = await Usuario.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: docente.usuario.id }
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
      await docente.usuario.update(usuarioUpdateData, { transaction });
    }
    
    // Actualizar el docente
    const docenteUpdateData = {};
    if (facultadId) docenteUpdateData.facultadId = facultadId;
    if (especialidad !== undefined) docenteUpdateData.especialidad = especialidad;
    if (gradoAcademico) docenteUpdateData.gradoAcademico = gradoAcademico;
    if (activo !== undefined) docenteUpdateData.activo = activo;
    
    if (Object.keys(docenteUpdateData).length > 0) {
      await docente.update(docenteUpdateData, { transaction });
    }
    
    // Confirmar la transacción
    await transaction.commit();
    
    // Obtener el docente actualizado con sus relaciones
    const docenteActualizado = await Docente.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido', 'email', 'rol']
        },
        {
          model: Facultad,
          as: 'facultad',
          attributes: ['id', 'nombre', 'codigo']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Docente actualizado exitosamente',
      data: docenteActualizado
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar docente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el docente',
      error: error.message
    });
  }
};

// Eliminar un docente (lógicamente)
const deleteDocente = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    
    const docente = await Docente.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario'
      }],
      transaction
    });
    
    if (!docente) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Docente no encontrado'
      });
    }
    
    // Verificar si el docente tiene secciones asignadas
    const seccionesCount = await Seccion.count({
      where: {
        docenteId: id,
        activo: true
      },
      transaction
    });
    
    if (seccionesCount > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el docente porque tiene secciones asignadas activas'
      });
    }
    
    // Desactivar el docente
    await docente.update({ activo: false }, { transaction });
    
    // Desactivar el usuario
    await docente.usuario.update({ activo: false }, { transaction });
    
    // Confirmar la transacción
    await transaction.commit();
    
    return res.status(200).json({
      success: true,
      message: 'Docente eliminado exitosamente'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar docente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el docente',
      error: error.message
    });
  }
};

module.exports = {
  createDocente,
  getAllDocentes,
  getDocenteById,
  updateDocente,
  deleteDocente
};