/*
    Rutas para eventos de calendario
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const validarCampos = require('../middlewares/validar-campos');

const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/eventsController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');
const router = Router();

//! Todas tienen que pasar por la validacion del JWT
router.use(validarJWT);

//Obtener eventos de calendario
router.get('/', getEventos);

//Crear un nuevo evento
router.post(
  '/',
  [
    check('title', 'El titulo debe ser obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos,
  ],
  crearEvento
);

//Actulizar evento
router.put('/:id', actualizarEvento);

//Borrar evento
router.delete('/:id', eliminarEvento);

module.exports = router;
