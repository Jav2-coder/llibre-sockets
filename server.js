var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(require("./auth"));
app.use("/api/llibres", require("./controller/api/llibres"));
app.use("/api/autors", require("./controller/api/autors"));
app.use("/api/sessions", require("./controller/api/sessions"));
app.use("/api/users", require("./controller/api/users"));

app.use("/",require("./controller/static"));

app.listen(process.env.PORT, function() {
    console.log('Server listening on', process.env.PORT);
});