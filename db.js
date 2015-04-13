var mongoose = require("mongoose");
mongoose.connect("mongodb://surrui:patata@ds031661.mongolab.com:31661/jwt", function() {
    console.log('Connectat a mongodb');
});

module.exports = mongoose;