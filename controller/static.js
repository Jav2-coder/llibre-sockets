// Arxiu on identificarem les rutes a seguir per la app i el html

var express = require("express");
var router = express.Router();
var options = {
    root: __dirname + "/../layouts"
};

router.use(express.static(__dirname+"/../assets"));
router.use(express.static(__dirname+"/../templates"));
router.get('*', function(req, res, next) {
    
    res.sendFile("app.html", options);
});

module.exports = router;