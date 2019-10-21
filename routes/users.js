var express = require('express');
var router = express.Router();
const User = require('../models/users');
var bcrypt = require('bcrypt');

/* GET users listing. */

router.get('/', function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).end()
  }
  try {
    jwt.verify(token, 'my_secret_key', (err, data) => {
      User.getUsers((err,data) =>{
        res.json(data);
      });
    });
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {

      return res.status(401).end()
    }
    return res.status(400).end()
  }

});
//Numero de rondas del SALT de BCRYPT2
var BCRYPT_SALT_ROUNDS = 12;

//Bcrypt2 comentado y desactivado para realizar pruebas
router.post('/create', function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).end()
  }
   var password = req.body.password;
  // bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  //     .then(function(hashedPassword) {
        const userData = {
          id: null,
          username: req.body.username,
          password: password,
          email: req.body.email,
          created_at: null,
          updated_at: null,
        };
        User.insertUser(userData, (err, data) =>{
          const token = req.cookies.token;
          if (!token) {
            return res.status(401).end()
          }

          if(data && data.insertId){
            console.log(data);
            res.json({
              success: true,
              msg: 'Usuario creado',
              data: data
            })
          } else{
            res.status(500).json({
              success: false,
              msg: 'Error'
            })
          }
        });
      // })
      // .catch(function(error){
      //   console.log("Error saving user: ");
      //   console.log(error);
      //   next();
      // });
});

router.put('/update/:id', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).end()
  }
  var password = req.body.password;
  bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
      .then(function(hashedPassword) {
        const userData = {
          id: req.params.id,
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          created_at: null,
          updated_at: null,
        };
        User.updateUser(userData, (err, data) =>{
          const token = req.cookies.token;
          if (!token) {
            return res.status(401).end()
          }
          if(data && data.msg){
            res.json(data)
          } else {
            res.json({
              success: false,
              msg: 'error'
            })
          }
        });
      })
      .catch(function(error){
        console.log("Error saving user: ");
        console.log(error);
        next();
      });


});

router.delete('/delete/:id', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).end()
  }
  User.deleteUser(req.params.id, (err, data) => {
    if(data && data.msg === 'deleted' || data.msg === 'not exists'){
      res.json({
        success:  true,
        data
      })
    } else {
      res.status(500).json({
        msg: 'Error'
      })
    }
  })
});

module.exports = router;
