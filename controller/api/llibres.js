module.exports = function(http) {
  var router = require('express').Router();
  var Llibre = require("../../models/llibre");
  var socket = require('../socket.js')(http);

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
    if (req.auth) {
      var llibre = new Llibre(req.body);
      llibre.save(function(err, llibre) {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.status(201).send("El llibre : " + req.body.isbn + " s'ha creat!!");
      });
      socket.nouLlibre(llibre);
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
          socket.editarLlibre(llibre);
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
      Llibre.findOne({
        isbn: req.params.id
      }, function(err, llibre) {
        if (!err) {
          Llibre.remove({
            isbn: req.params.id
          }, function(err) {
            if (err) {
              return next(err);
            }
            else {
              socket.eliminarLlibre(llibre);
              return res.status(201).send(req.params.id + " Deleted!!");
            }
          });
        }
      });
    }
    else {
      res.status(401).json({
        "missatge": "No autoritzat"
      });
    }
  });
  return router;
};