var headerConfig = require('./platformheader');

var utility = {
	isEmpty: function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}

		return true;
	},
	getFirstTrue: function (a) {
		for (prop in a) {
			if (a.hasOwnProperty(prop) && a[prop]) {
				return prop;
			}
		}
		return null;
	},
	getPlatformHeader: function (req) {
		var header = {};

		for (prop in headerConfig) {
			if (headerConfig.hasOwnProperty(prop)) {
				header[prop] = this.dotnotationobject(req, headerConfig[prop]);
			}
		}
		return header;
	},
	dotnotationobject: function (obj, is, value) {
		if (typeof is == 'string')
			return this.dotnotationobject(obj, is.split('.'), value);
		else if (is.length == 1 && value !== undefined) {
			if (obj[is[0]] == null) {
				return null;
			}
			return obj[is[0]] = value;
		}
		else if (is.length == 0)
			return obj;
		else {
			if (obj[is[0]] == null) {
				return null;
			}
			return this.dotnotationobject(obj[is[0]], is.slice(1), value);
		}
	}
}

module.exports = utility;