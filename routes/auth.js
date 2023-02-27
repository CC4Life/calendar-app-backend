/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require('../controllers/authController');
const validarCampos = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

//! Routers

//* Crear usuario
router.post(
  '/new',
  [
    //middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de 6 caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

//* Login Usuario
router.post(
  '/',
  [
    //middlewares
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de 6 caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

//* Renew Token
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
