var express = require('express');
var apiRoutes = express.Router();
var schema = require('./schema');
var http = require('http');
var logging = require('./logging');
var config = require('./config');
var extend = require('extend');
var utility = require('./utility');


var registeredRoutes = {};
var methods = schema.getRestMethods();
for (method in methods) {
	if (methods.hasOwnProperty(method)) {
		if (["post", "get", "put", "patch", "delete"].indexOf(methods[method].Method.toLowerCase()) > -1) {
			apiRoutes[methods[method].Method.toLowerCase()]("/" + methods[method].Path, function (req, res) {

				logging.requestLogging(req);

				var schemaMethodObject = schema.getSchemaMethodByRoute(req.route.methods, req.route.path);
				var platformModel = {
					header: utility.getPlatformHeader(req),
					apiName: schemaMethodObject.apiName,
					payLoad: extend(true, req.body, req.params, req.query)
				};

				var options = {
					hostname: config.hostName,
					port: config.hostPort,
					path: config.defaultHostPath + "?apiName=" + schemaMethodObject.apiName,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}

				};

				var req2 = http.request(options, function (res2) {
					var res1 = res;
					var result = "";
					res2.setEncoding('utf8');
					res2.on('data', function (chunk) {
						result += chunk;
					});
					res2.on('end', function () {
						res1.send(result);
					});
				});

				req2.on('error', function (e) {
					console.log('problem with request: ' + e.message);
				});

				// write data to request body
				req2.end(platformModel);
				res.write("Processing Request...");
				res.flush();
			});
			if (apiRoutes.stack.length > 0) {
				if (registeredRoutes[apiRoutes.stack[apiRoutes.stack.length - 1].regexp] != null) {
					var error = "";
					console.error("Duplicate path found" + apiRoutes.stack[apiRoutes.stack.length - 1].regexp);
				}
				else {
					registeredRoutes[apiRoutes.stack[apiRoutes.stack.length - 1].regexp] = true
				}
			}
		}
	}
}
module.exports = apiRoutes;