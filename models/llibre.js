var db = require("../db");

// JSON que conté les parts del llibre

var Llibre = db.model('Llibre', {

    isbn: {
        type: String,
        required: true,
        unique: true
    },

    titol: {
        type: String,
        required: true
    },

    autors: [{
        type: db.Schema.Types.ObjectId,
        ref: 'Autors'
    }],

    "data": {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = Llibre;