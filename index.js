var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var emitter = require('events').EventEmitter;
var emitter = new emitter();

var host = 'http://www.ccjt.net';
var items = [];
var arr = [];
var arrNone = [];
var errCount = 0;
var nowcount = 0;
emitter.on('finished', function(){
	console.log('err ',errCount,'success ',arr.length,'  ',arrNone.length);
	console.log(arr.sort());
	fs.writeFileSync('./url.txt', JSON.stringify(items));
})
var i = 200;
var makeUrl = function (i) {
	return host + '/pu_list_0_' + i + '_0_5_8.htm';
}
var getUrls = function (id) {
	nowcount++;
	var id = id || ++i;
	console.log('try ', id,' ', nowcount);
	request({
	  url: makeUrl(id),
	  encoding: null
	}, function(err, res, body) {
		nowcount--;
		if( err ) {
			errCount++;
			console.log('failed ', id,' ', nowcount);
			getUrls(id);
			return;
		}
		body = iconv.decode(body, 'gbk');
		var $ = cheerio.load(body, {
		    normalizeWhitespace: true,
		    xmlMode: false,
		    decodeEntities: false
		});
		var count2 = 0;
        $('.datatable tbody').each(function (idx, element) {
        	var $element = $(element);
        	if($element.find('.icon').length) {
	        	var type = $($element.find('.icon')[0]).html();
		        if (type == "六线") {
		        	items.push({
			          title: $element.find('.subject').find('a').html(),
			          href: url.resolve(host, $element.find('.subject').find('a').attr('href'))
			        });
			        count2++;
		        };
	    	}
        });
        if (count2 == 0) {
        	console.log('none' + id,' ', nowcount);
        	arrNone.push(id);
        	if(nowcount == 0) {
				emitter.emit('finished');
			}
        } else {
        	console.log('successed ', id,' ', nowcount);
        	arr.push(id);
        	getUrls();
        	
        }
        // getUrls();
	});
}
for(var k=0; k<10; k++) {
	getUrls();
}
