var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');

var host = 'http://www.ccjt.net';
var items = [];
var errCount = 0;
var nowCount = 0;

var i = 0;
var makeUrl = function (i) {
	return host + '/pu_list_0_' + i + '_0_5_8.htm';
}
var getUrls = function (urls) {
	request({
	  url: urls,
	  encoding: null
	}, function(err, res, body) {
		if( err ) {
			errCount++;
			nowCount--;
			console.log('failed ', i);
			return false;
		}
		if(body == '') {
			errCount++;
			nowCount--;
			console.log('failed ', i);
			return false;
		}
		body = iconv.decode(body, 'gbk');

		var $ = cheerio.load(body, {
		    normalizeWhitespace: true,
		    xmlMode: false,
		    decodeEntities: false
		});
        $('.datatable tbody').each(function (idx, element) {
        	var $element = $(element);
        	if($element.find('.icon').length) {
	        	var type = $($element.find('.icon')[0]).html();
		        if (type == "六线") {
		        	items.push({
			          title: $element.find('.subject').find('a').html(),
			          href: url.resolve(host, $element.find('.subject').find('a').attr('href'))
			        });
		        };
	    	}
        });
        console.log('successed ', i);
        nowCount--;
        return true;
	});
}

while (true) {
	if (errCount < 10) {
		if(nowCount < 10) {
			i++;
			console.log(i);
			getUrls(makeUrl(i));
			nowCount++;
		}
	} else {
		break;
	}
}

fs.writeFileSync('./url.txt', JSON.stringify(items));