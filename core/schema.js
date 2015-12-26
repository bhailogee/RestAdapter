var config = require('./config');
var fs = require('fs');
var schemaObj = JSON.parse(fs.readFileSync(config.schema, 'utf8'));
var utility = require('./utility');

var schemaParser = {
	schema: {},
	init: function (schema) {
		this.schema = schema;
		var _methods = this.getMethods();
		for (m in _methods) {
			if (_methods.hasOwnProperty(m)) {
				_methods[m].apiName = m;
			}
		}
	},
	restMethods: {},
	schemaRoutes : {},
	getMethods: function () {
		return this.schema["Methods"];
	},
	getMethod: function (methodName) {
		var methods = this.getMethods();
		return methods[methodName];
	},
	getParameters: function (methodName) {
		var method = this.getMethod(methodName);
		if (method != null) {
			if (method["Params"] != null) {
				return method["Params"];
			}
			else {
				return {}; //No parameters available
			}
		}
		else {
			return null;
		}
	},
	getRestMethods: function () {
		if (utility.isEmpty(this.restMethods)) {
			var methods = this.getMethods();			
			for (var prop in methods) {
				if (methods.hasOwnProperty(prop)) {
					if (methods[prop].Method != null && methods[prop].Path) {
						methods[prop].Method = methods[prop].Method.toLowerCase();
						this.restMethods[prop] = methods[prop];
						this.schemaRoutes[methods[prop].Method] = this.schemaRoutes[methods[prop].Method] || {};
						this.schemaRoutes[methods[prop].Method][methods[prop].Path] = this.restMethods[prop];
					}
				}
			}
		}
		return this.restMethods;
	},
	getSchemaMethodByRoute: function (method, route) {		
		return this.schemaRoutes[utility.getFirstTrue(method)][route.substring(1)];
	}
};

schemaParser.init(schemaObj[config.packageName]);

module.exports = schemaParser;