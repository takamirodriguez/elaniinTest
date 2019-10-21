var express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var router = express.Router();
const login = require('../models/login');

/* GET home page. */
router.get('/', function(req, res, next) {
  const token = req.cookies.token;
  // Si el cookie no está establecido devuelve error 401
  if (!token) {
    return res.status(401).end()
  }
  try {
    jwt.verify(token, 'my_secret_key', (err, data) => {
      //console.log("T: ", data.data[0].id);
        res.json(data);

    });
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {

      return res.status(401).end()
    }
    return res.status(400).end()
  }
  //res.render('login', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
  const userData = {
    username: req.body.username,
    password: req.body.password,
  };


  login.doLogin(userData, (err, data) =>{
    if(data && data.success === true){
      const token = jwt.sign(data, 'my_secret_key');
      res.cookie('token', token,{ maxAge: 30 * 1000});
      res.json({token});
    } else if(data && data.success === false){
      res.json({
        success:  false
      })
    } else {
      res.status(500).json({
        msg: 'Error'
      })
    }
  });
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader)
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}


module.exports = router;
