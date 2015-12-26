var app = require('express')();
var bodyParser = require('body-parser');
var config = require('./core/config');
var routes = require('./core/routes');
var server = require('http').Server(app);

app.use(bodyParser.json({ limit: '50mb' }));
app.use('/', routes);
server.listen(config.port);

console.log("Rest Adapter Started at " + config.port);