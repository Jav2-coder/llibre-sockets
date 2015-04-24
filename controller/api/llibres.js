// Zona on crearem que fa cada funció en la nostra api.

var Llibre = require("../../models/llibre");
var router = require("express").Router();

router.get("/", function(req, res, next) {
    Llibre.find()
        .sort('-date')
        .populate('autors')
        .exec(function(err, llibre) {
            if (err) {
                return next(err);
            }
            res.json(llibre);
        });

});

router.post("/", function(req, res, next) {
    console.log(req.body);
    if (req.auth) {
        var llibre = new Llibre(req.body);
        console.log(llibre);
        llibre.save(function(err, llibre) {
            if (err) {
                return next(err);
            }
            res.status(201).json(llibre);
        });
    }
    else {
        res.status(401).json({
            "missatge": "No autoritzat"
        });
    }
});

router.put("/:id", function(req, res, next) {
    if (req.auth) {
        var id = req.params.id;
        Llibre.findOne({
            'isbn': id
        }, function(err, llibre) {
            if (err) return next(err);
            if (!llibre) res.status(403).json({
                "missatge": "Error: El libro buscado no existe!"
            });
            Llibre.findByIdAndUpdate(llibre._id, req.body, function(err) {
                if (err) return next(err);
                res.status(201).json({
                    "missatge": "Actualizado!"
                });
            });
        });
    }
    else {
        res.status(401).json({
            "missatge": "No autoritzat"
        });
    }
});

router.delete("/:id", function(req, res, next) {
    if (req.auth) {
        var id = req.params.id;
        var query = Llibre.findOne({
            'isbn': id
        });
        query.exec(function(err, llibre) {
            if (err) return handleError(err);
            if (llibre == null) return res.send("No existe!");

            llibre.remove(function(err) {
                if (err) {
                    console.log(err);
                }
                res.send("Libro eliminado!");
            });
        });
    }
    else {
        res.status(401).json({
            "missatge": "No autoritzat"
        });
    }
});

module.exports = router;