var Autors = require("../../models/autors");
var router = require("express").Router();

router.get("/", function(req, res, next) {
    Autors.find()
        .sort('-date')
        .exec(function(err, autors) {
            if (err) {
                return next(err);
            }
            res.json(autors);
        });

});

router.post("/", function(req, res, next) {
    if (req.auth) {
    
        var autors = new Autors({
            "nom": req.body.nom,
            "cognoms": req.body.cognoms
        });
        console.log(autors);
        autors.save(function(err, autors) {
            if (err) {
                return next(err);
            }
            res.status(201).json(autors);
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
        Autors.findOne({
            '_id': id
        }, function(err, autors) {
            if (err) return next(err);
            if (!autors) res.status(403).json({
                "missatge": "Error: El autor buscado no existe!"
            });
            Autors.findByIdAndUpdate(autors._id, req.body, function(err) {
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
        var query = Autors.findOne({
            '_id': id
        });
        query.exec(function(err, autors) {
            if (err) return next(err);
            if (autors == null) return res.send("No existe!");

            autors.remove(function(err) {
                if (err) {
                    console.log(err);
                }
                res.send("Autor eliminado!");
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