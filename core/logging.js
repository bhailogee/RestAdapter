var logging = {

	requestLogging: function (req) {

		console.log("-------------");
		console.log("URL          :" + req.originalUrl);
		console.log("Route Path   :" + req.route.path);
		console.log("Route Method :" + JSON.stringify(req.route.methods));
		console.log("Request Params :" + JSON.stringify(req.params));
		console.log("Query Params :" + JSON.stringify(req.query));
		console.log("Body :" + JSON.stringify(req.body));
	}
}


module.exports = logging;