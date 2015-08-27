var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var emitter = require('events').EventEmitter;
var emitter = new emitter();

var data;

var countId = 0;

var host = 'http://www.ccjt.net';
var arr = [];
var none = [];
var errCount = 0;
var nowcount = 0;


var Timeout = 1000 * 60 * 5;
var t = setTimeout(writeFile, Timeout);
 function writeFile() {
 	emitter.emit('finished');
 }

var date = new Date();
date = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDay();
fs.readFile('./url_distinct.txt', 'utf8', function(err, dat) {
	data = JSON.parse(dat);
	for (var i=0; i<200; i++) {
		getpic();
	}
});

emitter.on('finished', function(){
	console.log('total ', data.length, 'err ',errCount,'success ',arr.length, ' ', none.length);
	fs.writeFileSync('./log.txt', JSON.stringify(arr) + '\r\n\r\n' + JSON.stringify(none));
	fs.writeFileSync('./withPic.txt', JSON.stringify(data));
})
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
function randomNum (max, min) {
	return Math.floor(Math.random() * (max + min)) - min;
}
function download(url, referer, path) {
	try{
		request({
			url: url,
			headers: {
				Referer: referer
			}
		}).pipe(fs.createWriteStream(path));
	} catch (e) {

	}
	
}

// function getpic(index, len) {
// 	if( index >= len ) {
// 		return;
// 	}
// 	// do
// 	if( err ) {
// 		getpic(index, len);
// 	} else {
// 		getpic(index+1, len);
// 	}
// }

// function getpic(id) {
// 	var id = id || countId++;
// 	nowcount++;

// 	console.log('try ',id, ' ', nowcount);
// 	setTimeout(function() {
// 		nowcount--;
// 		if(randomNum(10, 1)%2) {
// 			console.log('fail ',id, ' ', nowcount);
// 			getpic(id);
// 			return;
// 		}
// 		console.log('success ',id, ' ', nowcount);
// 		if (nowcount == 0) {
// 			console.log('game over');
// 		} else if (countId <= 801) {
// 			getpic();
// 		}
// 	}, randomNum(3000, 2000));
// }
function getpic(id) {
	var id = id || countId++;
	nowcount++;
	console.log('try ', id,' ', nowcount);

	request({
	  url: data[id].href,
	  encoding: null
	}, function(err, res, body) {
		nowcount--;
		clearInterval(t);
		t = setTimeout(writeFile, Timeout);
		if( err ) {
			errCount++;
			console.log('failed ', id,' ', err.code, ' ', nowcount);
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
		var reg = new RegExp('共(\\d+)页');
		try{
			if($('#yy').length && $('#upid img').length){
				var count = $('#yy').html().match(reg);
        		var picurl = url.resolve(host, $('#upid img').attr('src'));
			} else {
				console.log('none ', id);
				none.push(id);
			}
		} catch(e) {
			return;
		}
		

  //       var dir = date + randomString(8);
		// var path = 'picture/' + dir;
		// while(true) {
		// 	if (fs.existsSync(path)) {
		// 		dir = date + randomString(8);
		// 		path = 'picture/' + dir;
		// 	} else {
		// 		fs.mkdirSync(path)
		// 		break;
		// 	}
		// }
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
        data[id].picArr = picArr;
    	console.log('successed ', id,' ', nowcount);
    	arr.push(id);
    	if(nowcount == 0) {
			emitter.emit('finished');
        } else if(countId < data.length) {
        	getpic();
        }
	});
}