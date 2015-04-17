var router = require("express").Router();
var User = require("../../models/users");
var bcrypt = require("bcrypt");
var jwt = require("jwt-simple");

var secretKey = 'A0hu77QQhHhj3166pp078fqapAAAzx';

router.post('/', function(req,res, next) {
    //Si la contrasenya enviada per l'usuari és correcte
    //enviem un toke d'autenticació
    console.log(req.body);
    User.findOne({username: req.body.username})
            .select('username')
            .select('password')
            .exec(function(err,user) {
                console.log(user);
                if (err) return next(err);
                if (!user) return res.status(401).json({"missatge": "auth problem"});
                bcrypt.compare(req.body.password, user.password, function (err, valid) {
                    if (err) return next(err);
                    if (!valid) return res.status(401).json({"missatge": "auth problem"});
                    var token = jwt.encode({username: user.username}, secretKey);
                    res.status(200).json(token);
                });
            });
});

module.exports = router;