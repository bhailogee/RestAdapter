var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./appConfig.json', 'utf8'));

module.exports = config;

