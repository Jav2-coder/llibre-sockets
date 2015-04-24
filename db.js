var mongoose = require("mongoose");
var config = require('./config');
mongoose.connect('mongodb://' + config.userMongo +':' + config.passMongo + '@' + config.urlMongo,function(err) {
          if(err) throw err;  
          console.log("Connectat a mongolab");
});

module.exports = mongoose;