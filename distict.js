var fs = require('fs');

fs.readFile('./url.txt', 'utf8', function(err, data) {
	var data = JSON.parse(data);
	console.log(data.length);
	var count = 0;
	for (var i=0; i<=data.length-1; i++) {
		for (var k = data.length - 1; k > i; k--) {
			if(data[k].href == data[i].href) {
				data.splice(k,1);
				count++;
			}
		};
	}
	console.log(count);
	console.log(data.length);
	fs.writeFileSync('./url_distinct.txt', JSON.stringify(data));
});