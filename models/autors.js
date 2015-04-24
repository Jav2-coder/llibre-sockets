var db = require("../db");

// JSON que conté les parts del llibre

var Autors = db.model('Autors', {

    nom: {
        type: String,
        required: true
    },

    cognoms: {
        type: String,
        required: true
    }
});

module.exports = Autors;