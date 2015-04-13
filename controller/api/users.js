// Zona on crearem que fa cada funció en la nostra api.

var User = require("../../models/users");
var router = require("express").Router();
var jwt = require('jwt-simple');
var bcrypt = require("bcrypt");

var secretKey = 'A0hu77QQhHhj3166pp078fqapAAAzx';

router.get('/', function(req,res) {
    //Si el token d'autenticació és correcte enviem 
    // el nom de l'usuari per provar que funciona.
    var token = req.headers['x-auth'];
    if (token) {
        var auth = jwt.decode(token,secretKey);
        User.findOne({username:auth.username}, function(err, user) {
            res.status(200).json(user);
        });
    } else {
        res.status(401).json({"missatge": "bad token"});
    }
});

router.post('/', function(req,res,next) {
    //Afegim un usuari i contrasenya nous a la base de dades
    console.log(req.body);
    User.findOne({"username": req.body.username}, function(err,user) {
        if (err) return next(err);
        if (user) return res.status(409).json({"missatge":"User exists"});
        
        bcrypt.hash(req.body.password, 11, function(err,hash) {
            console.log(hash);
            var user = new User({username: req.body.username});
            user.password = hash;
            user.save(function(erro, user) {
                if (err) return next(err);
                res.status(201).json({"missatge":"User Created"});
            });
        });
    });
        
});

module.exports = router;