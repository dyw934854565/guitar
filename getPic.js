var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var emitter = require('events').EventEmitter;
var emitter = new emitter();

var data;

var i = 0;

var arr = [];
var errCount = 0;
var nowcount = 0;

fs.readFile('./url.txt', 'utf8', function(err, dat) {
	data = JSON.parse(dat);
	for (var i=0; i<1; i++) {
		getpic();
	}
});

emitter.on('finished', function(){
	console.log('err ',errCount,'success ',arr.length, ' ');
	console.log(arr.sort(function(a, b){
		return a - b;
	}));
	fs.writeFileSync('./test.txt', JSON.stringify(data));
})

function getpic(id) {
	var id = id || i++;
	nowcount++;
	console.log('try ', id,' ', nowcount);
	request({
	  url: data[id].href,
	  encoding: null
	}, function(err, res, body) {
		nowcount--;
		if( err ) {
			errCount++;
			console.log('failed ', id,' ', nowcount);
			getpic(id);
			return;
		}
		body = iconv.decode(body, 'gbk');
		var $ = cheerio.load(body, {
		    normalizeWhitespace: true,
		    xmlMode: false,
		    decodeEntities: false
		});
		var picArr = [];
        $('#upid img').attr('src');
    	if(nowcount == 0) {
			//emitter.emit('finished');
        } else if(i < data.length) {
        	console.log('successed ', id,' ', nowcount);
        	arr.push(id);
        	getpic();
        }
	});
}