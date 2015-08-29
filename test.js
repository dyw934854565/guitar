var fs = require('fs');
var request = require('request');

request({
	url: 'http://www.ccjt.net/pu/2012/5/18/162044_13796/1.gif',
	headers: {
		Referer: 'http://www.ccjt.net/wy_html/995404442.htm'
	},
	encoding: null
}, function(err, res, body) {
	if (err) {
		console.log(err)
	} else {
		console.log('write file');
		fs.writeFile('1.gif', body);
	}
});
