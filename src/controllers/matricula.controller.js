const { 
  Matricula, 
  Alumno, 
  PeriodoAcademico, 
  DetalleMatricula, 
  Seccion,
  Curso
} = require('../models');
const { sequelize } = require('../config/database');
  
  // Crear una nueva matrícula
  const createMatricula = async (req, res) => {
    // Iniciar una transacción
    const transaction = await sequelize.transaction();
  
    try {
      const { 
        alumnoId, 
        periodoAcademicoId, 
        tipoMatricula,
        secciones
      } = req.body;
  
      // Verificar si existe el alumno
      const alumno = await Alumno.findByPk(alumnoId);
      if (!alumno) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'El alumno especificado no existe'
        });
      }
  
      // Verificar si existe el periodo académico
      const periodoAcademico = await PeriodoAcademico.findByPk(periodoAcademicoId);
      if (!periodoAcademico) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'El periodo académico especificado no existe'
        });
      }
  
      // Verificar si el alumno ya tiene una matrícula en este periodo
      const existingMatricula = await Matricula.findOne({ 
        where: { 
          alumnoId, 
          periodoAcademicoId 
        } 
      });
      
      if (existingMatricula) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'El alumno ya tiene una matrícula en este periodo académico'
        });
      }
  
      // Verificar el estado del periodo (debe estar en fase de matrícula)
      const currentDate = new Date();
      let isMatriculaPeriod = false;
  
      if (tipoMatricula === 'regular') {
        isMatriculaPeriod = currentDate >= new Date(periodoAcademico.fechaInicioMatricula) && 
                           currentDate <= new Date(periodoAcademico.fechaFinMatricula);
      } else if (tipoMatricula === 'extemporanea') {
        isMatriculaPeriod = currentDate >= new Date(periodoAcademico.fechaInicioMatriculaExtemporanea) && 
                           currentDate <= new Date(periodoAcademico.fechaFinMatriculaExtemporanea);
      }
  
      if (!isMatriculaPeriod) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `No es periodo de matrícula ${tipoMatricula}`
        });
      }
  
      // Verificar que se haya enviado al menos una sección
      if (!secciones || !Array.isArray(secciones) || secciones.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Debe especificar al menos una sección para matricular'
        });
      }
  
      // Verificar que todas las secciones existan y tengan cupo
      const seccionIds = secciones.map(seccion => seccion.seccionId);
      const seccionesBD = await Seccion.findAll({
        where: { id: seccionIds },
        include: [{
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nombre', 'codigo', 'ciclo', 'creditos']
        }]
      });
  
      if (seccionesBD.length !== seccionIds.length) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Una o más secciones especificadas no existen'
        });
      }
  
      // Verificar cupo en las secciones
      const seccionSinCupo = seccionesBD.find(seccion => seccion.capacidadActual >= seccion.capacidadMaxima);
      if (seccionSinCupo) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `La sección ${seccionSinCupo.nombre} del curso ${seccionSinCupo.curso.nombre} no tiene cupo disponible`
        });
      }
  
      // Calcular el monto total y los créditos
      let montoTotal = 0;
      let creditosInscritos = 0;
  
      seccionesBD.forEach(seccion => {
        creditosInscritos += seccion.curso.creditos;
        // Aquí podrías agregar lógica para calcular el monto según tipo de matrícula, créditos, etc.
        montoTotal += seccion.curso.creditos * 100; // Ejemplo: 100 por crédito
      });
  
      // Crear la matrícula
      const matricula = await Matricula.create({
        alumnoId,
        periodoAcademicoId,
        fechaMatricula: new Date(),
        tipoMatricula,
        montoTotal,
        creditosInscritos,
        estado: 'pendiente'
      }, { transaction });
  
      // Crear los detalles de matrícula
      const detallesMatricula = [];
      for (const seccion of seccionesBD) {
        // Incrementar la capacidad actual de la sección
        await seccion.increment('capacidadActual', { transaction });
        
        // Crear el detalle de matrícula
        const detalle = await DetalleMatricula.create({
          matriculaId: matricula.id,
          seccionId: seccion.id,
          estado: 'activo'
        }, { transaction });
        
        detallesMatricula.push(detalle);
      }
  
      // Confirmar la transacción
      await transaction.commit();
  
      return res.status(201).json({
        success: true,
        message: 'Matrícula creada exitosamente',
        data: {
          matricula,
          detallesMatricula
        }
      });
    } catch (error) {
      // Revertir la transacción en caso de error
      await transaction.rollback();
      console.error('Error al crear matrícula:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear la matrícula',
        error: error.message
      });
    }
  };
  
  // Obtener todas las matrículas
  const getAllMatriculas = async (req, res) => {
    try {
      const { periodoAcademicoId, alumnoId, estado } = req.query;
      
      const whereCondition = {};
      
      if (periodoAcademicoId) {
        whereCondition.periodoAcademicoId = periodoAcademicoId;
      }
      
      if (alumnoId) {
        whereCondition.alumnoId = alumnoId;
      }
      
      if (estado) {
        whereCondition.estado = estado;
      }
      
      const matriculas = await Matricula.findAll({
        where: whereCondition,
        include: [
          {
            model: Alumno,
            as: 'alumno',
            attributes: ['id', 'codigo', 'dni']
          },
          {
            model: PeriodoAcademico,
            as: 'periodoAcademico',
            attributes: ['id', 'nombre', 'codigo']
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
      console.error('Error al obtener matrículas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las matrículas',
        error: error.message
      });
    }
  };
  
  // Obtener una matrícula por ID
  const getMatriculaById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const matricula = await Matricula.findByPk(id, {
        include: [
          {
            model: Alumno,
            as: 'alumno',
            attributes: ['id', 'codigo', 'dni']
          },
          {
            model: PeriodoAcademico,
            as: 'periodoAcademico',
            attributes: ['id', 'nombre', 'codigo']
          },
          {
            model: DetalleMatricula,
            as: 'detallesMatricula',
            include: [
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
          }
        ]
      });
      
      if (!matricula) {
        return res.status(404).json({
          success: false,
          message: 'Matrícula no encontrada'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: matricula
      });
    } catch (error) {
      console.error('Error al obtener matrícula:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la matrícula',
        error: error.message
      });
    }
  };
  
  // Actualizar el estado de una matrícula
  const updateMatriculaEstado = async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      const matricula = await Matricula.findByPk(id);
      
      if (!matricula) {
        return res.status(404).json({
          success: false,
          message: 'Matrícula no encontrada'
        });
      }
      
      if (!['pendiente', 'pagado', 'anulado'].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado de matrícula inválido'
        });
      }
      
      await matricula.update({ estado });
      
      return res.status(200).json({
        success: true,
        message: 'Estado de matrícula actualizado exitosamente',
        data: matricula
      });
    } catch (error) {
      console.error('Error al actualizar estado de matrícula:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el estado de la matrícula',
        error: error.message
      });
    }
  };
  
  // Anular una matrícula
  const anularMatricula = async (req, res) => {
    // Iniciar una transacción
    const transaction = await sequelize.transaction();
  
    try {
      const { id } = req.params;
      
      const matricula = await Matricula.findByPk(id, {
        include: [{
          model: DetalleMatricula,
          as: 'detallesMatricula',
          include: [{
            model: Seccion,
            as: 'seccion'
          }]
        }]
      });
      
      if (!matricula) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Matrícula no encontrada'
        });
      }
      
      if (matricula.estado === 'anulado') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'La matrícula ya está anulada'
        });
      }
      
      // Actualizar el estado de los detalles a 'retirado'
      for (const detalle of matricula.detallesMatricula) {
        await detalle.update({ estado: 'retirado' }, { transaction });
        
        // Decrementar la capacidad actual de la sección
        await detalle.seccion.decrement('capacidadActual', { transaction });
      }
      
      // Actualizar el estado de la matrícula a 'anulado'
      await matricula.update({ estado: 'anulado' }, { transaction });
      
      // Confirmar la transacción
      await transaction.commit();
      
      return res.status(200).json({
        success: true,
        message: 'Matrícula anulada exitosamente'
      });
    } catch (error) {
      // Revertir la transacción en caso de error
      await transaction.rollback();
      console.error('Error al anular matrícula:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al anular la matrícula',
        error: error.message
      });
    }
  };
  
  // Obtener matrículas por periodo académico
  const getMatriculasByPeriodoAcademico = async (req, res) => {
    try {
      const { periodoAcademicoId } = req.params;
      
      const periodoAcademico = await PeriodoAcademico.findByPk(periodoAcademicoId);
      if (!periodoAcademico) {
        return res.status(404).json({
          success: false,
          message: 'Periodo académico no encontrado'
        });
      }
      
      const matriculas = await Matricula.findAll({
        where: { periodoAcademicoId },
        include: [
          {
            model: Alumno,
            as: 'alumno',
            attributes: ['id', 'codigo', 'dni']
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
      console.error('Error al obtener matrículas por periodo:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las matrículas por periodo',
        error: error.message
      });
    }
  };
  
  // Generar reporte de matrículas
  const generarReporteMatriculas = async (req, res) => {
    try {
      const { periodoAcademicoId } = req.params;
      
// Verificar que exista el periodo académico
const periodoAcademico = await PeriodoAcademico.findByPk(periodoAcademicoId);
if (!periodoAcademico) {
  return res.status(404).json({
    success: false,
    message: 'Periodo académico no encontrado'
  });
}

// Obtener estadísticas de matrículas
const totalMatriculas = await Matricula.count({
  where: { periodoAcademicoId }
});

const matriculasPorEstado = await Matricula.findAll({
  where: { periodoAcademicoId },
  attributes: [
    'estado',
    [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
  ],
  group: ['estado'],
  raw: true
});

const matriculasPorTipo = await Matricula.findAll({
  where: { periodoAcademicoId },
  attributes: [
    'tipoMatricula',
    [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
  ],
  group: ['tipoMatricula'],
  raw: true
});

// Obtener los cursos más solicitados
const cursosMasSolicitados = await Curso.findAll({
  attributes: [
    'id',
    'nombre',
    'codigo',
    'ciclo',
    [sequelize.fn('COUNT', sequelize.col('DetalleMatricula.id')), 'matriculados']
  ],
  include: [
    {
      model: Seccion,
      as: 'secciones',
      attributes: [],
      include: [
        {
          model: DetalleMatricula,
          as: 'detallesMatricula',
          attributes: [],
          include: [
            {
              model: Matricula,
              as: 'matricula',
              attributes: [],
              where: { 
                periodoAcademicoId,
                estado: { [Op.ne]: 'anulado' }
              }
            }
          ]
        }
      ]
    }
  ],
  group: ['Curso.id', 'Curso.nombre', 'Curso.codigo', 'Curso.ciclo'],
  order: [[sequelize.fn('COUNT', sequelize.col('DetalleMatricula.id')), 'DESC']],
  limit: 10,
  subQuery: false
});

return res.status(200).json({
  success: true,
  data: {
    periodoAcademico: {
      id: periodoAcademico.id,
      nombre: periodoAcademico.nombre,
      codigo: periodoAcademico.codigo
    },
    estadisticas: {
      totalMatriculas,
      matriculasPorEstado,
      matriculasPorTipo,
      cursosMasSolicitados
    }
  }
});
} catch (error) {
console.error('Error al generar reporte de matrículas:', error);
return res.status(500).json({
  success: false,
  message: 'Error al generar el reporte de matrículas',
  error: error.message
});
}
};

module.exports = {
createMatricula,
getAllMatriculas,
getMatriculaById,
updateMatriculaEstado,
anularMatricula,
getMatriculasByPeriodoAcademico,
generarReporteMatriculas
};