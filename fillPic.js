var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var emitter = require('events').EventEmitter;
var emitter = new emitter();
// fs.mkdir('picture/test');
// console.log(fs.existsSync('picture/da'));
// request({
// 	url: 'http://www.ccjt.net/pu/2015/8/14/111458_62701/1.gif',
// 	headers: {
// 		Referer: 'http://www.ccjt.net/wy_html/191756394.htm',
// 		Host: 'www.ccjt.net'
// 	}
// }).pipe(fs.createWriteStream('picture/test/doodle.png'))
var data;

var now = 0;
var i = 0;
var host = 'http://www.ccjt.net';

emitter.on('finished', function(){
	console.log('writefile');
	fs.writeFileSync('./withPic.txt', JSON.stringify(data));
})


fs.readFile('./withPic.txt', 'utf8', function(err, dat) {
	data = JSON.parse(dat);
	console.log(data.length);

	for (; i < data.length; i++) {
		if('picArr' in data[i]) {

		} else {
			console.log(i, data[i].href, data[i].title);
			getPic(i, data[i].href);
		}
	};
});

function getPic(index, href) {
	now++;
	console.log('try ', index, now);
	request({
	  url: href,
	  encoding: null
	}, function(err, res, body) {
		now--;
		if( err ) {
			console.log('failed ', index,' ', err.code, now);
			getPic(index, href);
			return;
		}
		body = iconv.decode(body, 'gbk');
		var $ = cheerio.load(body, {
		    normalizeWhitespace: true,
		    xmlMode: false,
		    decodeEntities: false
		});
		var picArr = [];
		var reg = new RegExp('共(\\d+)页');
		try{
			if($('#yy').length && $('#upid img').length){
				var count = $('#yy').html().match(reg);
        		var picurl = url.resolve(host, $('#upid img').attr('src'));
			} else {
				console.log('none ', index);
			}
		} catch(e) {
			console.log(e);
			return;
		}
		if (count) {
        	count = count[1];
        	
        	for (var k = 1; k <= count; k++) {
        		var pic = {};
        		pic.src = picurl.replace(/\/(\d+)\./g, '/' + k + '.');
        		pic.path = '';//path + pic.src.substr(pic.src.lastIndexOf('/'));
        		//download(pic.src, data[id].href, pic.path);
	        	picArr.push(pic);
	        };
        } else {
        	var pic = {};
        	pic.src = picurl;
        	pic.path = '';//path + pic.src.substr(pic.src.lastIndexOf('/'));
        	//download(pic.src, data[id].href, pic.path);
        	picArr.push(pic);
        }
        data[index].picArr = picArr;
    	console.log('successed ', index,' ', now);
    	if (now == 0 && i == data.length) {
    		emitter.emit('finished');
    	}
    });
}