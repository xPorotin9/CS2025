const { Prerequisito, Curso } = require('../models');

// Crear un nuevo prerrequisito
const createPrerequisito = async (req, res) => {
  try {
    const { cursoId, prerequisitoId, tipoRequisito } = req.body;

    // Verificar que los cursos existan
    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'El curso especificado no existe'
      });
    }

    const prerequisitoCurso = await Curso.findByPk(prerequisitoId);
    if (!prerequisitoCurso) {
      return res.status(404).json({
        success: false,
        message: 'El curso prerrequisito especificado no existe'
      });
    }

    // Verificar que no se pueda añadir un curso como su propio prerrequisito
    if (cursoId === prerequisitoId) {
      return res.status(400).json({
        success: false,
        message: 'Un curso no puede ser prerrequisito de sí mismo'
      });
    }

    // Verificar ciclos (un prerrequisito debe estar en un ciclo anterior)
    if (prerequisitoCurso.ciclo >= curso.ciclo) {
      return res.status(400).json({
        success: false,
        message: 'El prerrequisito debe estar en un ciclo anterior al curso'
      });
    }

    // Verificar que no exista ya el prerrequisito
    const existingPrerequisito = await Prerequisito.findOne({
      where: { cursoId, prerequisitoId }
    });

    if (existingPrerequisito) {
      return res.status(400).json({
        success: false,
        message: 'Este prerrequisito ya existe para el curso'
      });
    }

    const prerequisito = await Prerequisito.create({
      cursoId,
      prerequisitoId,
      tipoRequisito
    });

    return res.status(201).json({
      success: true,
      message: 'Prerrequisito creado exitosamente',
      data: prerequisito
    });
  } catch (error) {
    console.error('Error al crear prerrequisito:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el prerrequisito',
      error: error.message
    });
  }
};

// Obtener todos los prerrequisitos
const getAllPrerequisitos = async (req, res) => {
  try {
    const prerequisitos = await Prerequisito.findAll({
      include: [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nombre', 'codigo', 'ciclo']
        },
        {
          model: Curso,
          as: 'cursoPrerequisito',
          attributes: ['id', 'nombre', 'codigo', 'ciclo']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: prerequisitos.length,
      data: prerequisitos
    });
  } catch (error) {
    console.error('Error al obtener prerrequisitos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los prerrequisitos',
      error: error.message
    });
  }
};

// Obtener prerrequisitos por curso
const getPrerequisitoByCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    
    const prerequisitos = await Prerequisito.findAll({
      where: { cursoId },
      include: [
        {
          model: Curso,
          as: 'cursoPrerequisito',
          attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: prerequisitos.length,
      data: prerequisitos
    });
  } catch (error) {
    console.error('Error al obtener prerrequisitos por curso:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los prerrequisitos por curso',
      error: error.message
    });
  }
};

// Obtener cursos que tienen como prerrequisito a un curso específico
const getCursosByPrerequisito = async (req, res) => {
  try {
    const { prerequisitoId } = req.params;
    
    const prerequisitos = await Prerequisito.findAll({
      where: { prerequisitoId },
      include: [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: prerequisitos.length,
      data: prerequisitos
    });
  } catch (error) {
    console.error('Error al obtener cursos por prerrequisito:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los cursos por prerrequisito',
      error: error.message
    });
  }
};

// Actualizar un prerrequisito
const updatePrerequisito = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoRequisito } = req.body;
    
    const prerequisito = await Prerequisito.findByPk(id);
    
    if (!prerequisito) {
      return res.status(404).json({
        success: false,
        message: 'Prerrequisito no encontrado'
      });
    }
    
    await prerequisito.update({ tipoRequisito });
    
    return res.status(200).json({
      success: true,
      message: 'Prerrequisito actualizado exitosamente',
      data: prerequisito
    });
  } catch (error) {
    console.error('Error al actualizar prerrequisito:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el prerrequisito',
      error: error.message
    });
  }
};

// Eliminar un prerrequisito
const deletePrerequisito = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prerequisito = await Prerequisito.findByPk(id);
    
    if (!prerequisito) {
      return res.status(404).json({
        success: false,
        message: 'Prerrequisito no encontrado'
      });
    }
    
    await prerequisito.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Prerrequisito eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar prerrequisito:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el prerrequisito',
      error: error.message
    });
  }
};

module.exports = {
  createPrerequisito,
  getAllPrerequisitos,
  getPrerequisitoByCurso,
  getCursosByPrerequisito,
  updatePrerequisito,
  deletePrerequisito
};