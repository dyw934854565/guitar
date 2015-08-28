var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var emitter = require('events').EventEmitter;
var emitter = new emitter();



var data;
var now = 0;
var index = 0;

emitter.on('finished', function(){
	console.log('writefile');
	fs.writeFileSync('./withPath.txt', JSON.stringify(data));
})

fs.readFile('./withPic.txt', 'utf8', function(err, dat) {
	data = JSON.parse(dat);

	for (; index < data.length; index++) {
		var picArr = data[index].picArr;
		var path = mkdir(data[index].title);
		for (var k=0; k<picArr.length; k++) {
			if (picArr[k].path == '') {
				download(index, k, picArr[k].src, data[index].href, path + picArr[k].src.substr(picArr[k].src.lastIndexOf('/')));
			};
		}
	};
});




function mkdir(dir) {
	var date = new Date();
	date = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDay();


  	var dir = dir || date + randomString(8);
	var path = 'picture/' + dir;
	while(true) {
		if (fs.existsSync(path)) {
			if(arguments.length) {
				return path;
			}
			dir = date + randomString(8);
			path = 'picture/' + dir;
		} else {
			fs.mkdirSync(path);
			break;
		}
	}
	return path;
}
function download(a, i) {
	now++;
	console.log('try ', a, now);
	try{
		request({
			url: url,
			headers: {
				Referer: referer
			},
			encoding: null
		}, function(err, res, body) {
			now--;
			if (err) {
				console.log('fail ', a, now);
				download(a, i, url, referer, path);
			} else {
				console.log('success ', a, now);
			    data[a].picArr[i].path = path;

			    fs.writeFile(path, body);
			    if (now ==0 && index == data.length ) {
			    	emitter.emit('finished');
			    };
			}
		});
	} catch (e) {
		console.log(e);
		download(a, i, url, referer, path);
	}
}
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (var i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}