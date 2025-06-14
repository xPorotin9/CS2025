const { Configuracion } = require('../models');

// Crear una nueva configuración
const createConfiguracion = async (req, res) => {
  try {
    const { nombre, valor, descripcion, tipo } = req.body;

    // Verificar que no exista una configuración con el mismo nombre
    const existingConfig = await Configuracion.findOne({ where: { nombre } });
    if (existingConfig) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una configuración con este nombre'
      });
    }

    // Validar el tipo de configuración
    if (!['string', 'number', 'boolean', 'json'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de configuración inválido'
      });
    }

    // Validar que el valor corresponda al tipo
    try {
      switch (tipo) {
        case 'number':
          if (isNaN(parseFloat(valor))) {
            return res.status(400).json({
              success: false,
              message: 'El valor debe ser un número'
            });
          }
          break;
        case 'boolean':
          if (valor !== 'true' && valor !== 'false') {
            return res.status(400).json({
              success: false,
              message: 'El valor debe ser "true" o "false"'
            });
          }
          break;
        case 'json':
          JSON.parse(valor);
          break;
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'El valor no corresponde al tipo especificado',
        error: error.message
      });
    }

    // Crear la configuración
    const configuracion = await Configuracion.create({
      nombre,
      valor,
      descripcion,
      tipo
    });

    return res.status(201).json({
      success: true,
      message: 'Configuración creada exitosamente',
      data: configuracion
    });
  } catch (error) {
    console.error('Error al crear configuración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la configuración',
      error: error.message
    });
  }
};

// Obtener todas las configuraciones
const getAllConfiguraciones = async (req, res) => {
  try {
    const configuraciones = await Configuracion.findAll({
      order: [['nombre', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      count: configuraciones.length,
      data: configuraciones
    });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las configuraciones',
      error: error.message
    });
  }
};

// Obtener una configuración por nombre
const getConfiguracionByNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    
    const configuracion = await Configuracion.findOne({
      where: { nombre }
    });
    
    if (!configuracion) {
      return res.status(404).json({
        success: false,
        message: 'Configuración no encontrada'
      });
    }
    
    // Devolver el valor con el tipo adecuado
    let valorTipado = configuracion.valor;
    
    switch (configuracion.tipo) {
      case 'number':
        valorTipado = parseFloat(configuracion.valor);
        break;
      case 'boolean':
        valorTipado = configuracion.valor === 'true';
        break;
      case 'json':
        valorTipado = JSON.parse(configuracion.valor);
        break;
    }
    
    return res.status(200).json({
      success: true,
      data: {
        ...configuracion.toJSON(),
        valorTipado
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la configuración',
      error: error.message
    });
  }
};

// Actualizar una configuración
const updateConfiguracion = async (req, res) => {
  try {
    const { nombre } = req.params;
    const { valor, descripcion, tipo } = req.body;
    
    const configuracion = await Configuracion.findOne({
      where: { nombre }
    });
    
    if (!configuracion) {
      return res.status(404).json({
        success: false,
        message: 'Configuración no encontrada'
      });
    }
    
    // Validar el tipo de configuración si se proporciona
    if (tipo && !['string', 'number', 'boolean', 'json'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de configuración inválido'
      });
    }
    
    // Validar que el valor corresponda al tipo
    const tipoToCheck = tipo || configuracion.tipo;
    
    if (valor) {
      try {
        switch (tipoToCheck) {
          case 'number':
            if (isNaN(parseFloat(valor))) {
              return res.status(400).json({
                success: false,
                message: 'El valor debe ser un número'
              });
            }
            break;
          case 'boolean':
            if (valor !== 'true' && valor !== 'false') {
              return res.status(400).json({
                success: false,
                message: 'El valor debe ser "true" o "false"'
              });
            }
            break;
          case 'json':
            JSON.parse(valor);
            break;
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'El valor no corresponde al tipo especificado',
          error: error.message
        });
      }
    }
    
    // Actualizar la configuración
    await configuracion.update({
      valor: valor || configuracion.valor,
      descripcion: descripcion !== undefined ? descripcion : configuracion.descripcion,
      tipo: tipo || configuracion.tipo
    });
    
    return res.status(200).json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: configuracion
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la configuración',
      error: error.message
    });
  }
};

// Eliminar una configuración
const deleteConfiguracion = async (req, res) => {
  try {
    const { nombre } = req.params;
    
    const configuracion = await Configuracion.findOne({
      where: { nombre }
    });
    
    if (!configuracion) {
      return res.status(404).json({
        success: false,
        message: 'Configuración no encontrada'
      });
    }
    
    await configuracion.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Configuración eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar configuración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la configuración',
      error: error.message
    });
  }
};

module.exports = {
  createConfiguracion,
  getAllConfiguraciones,
  getConfiguracionByNombre,
  updateConfiguracion,
  deleteConfiguracion
};