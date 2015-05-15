var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);

app.use(bodyParser.json());
app.use(require("./auth"));
app.use("/api/llibres", require("./controller/api/llibres")(http));
app.use("/api/autors", require("./controller/api/autors"));
app.use("/api/sessions", require("./controller/api/sessions"));
app.use("/api/users", require("./controller/api/users"));

app.use("/",require("./controller/static"));

http.listen(process.env.PORT, process.env.IP, function() {
    console.log('Server listening on', process.env.PORT);
});