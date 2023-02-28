const { response } = require('express');
const Users = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//* Auth Controllers

// ruta -> /new
const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Users.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya se encuentra registrado',
      });
    }

    usuario = new Users(req.body);

    //! Encriptamos contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //*Aqui salvamos a la BD.
    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor, hable con el administrador',
    });
  }
};

// login ruta -> /
const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Users.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email',
      });
    }

    // Confirmar los passwords

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto',
      });
    }

    //Generamos nuestro JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor, hable con el administrador',
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;

  //Generar un nuevo JWT y retornarlo en esta peticion

  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
