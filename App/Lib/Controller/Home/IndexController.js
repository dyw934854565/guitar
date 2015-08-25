/**
 * controller
 * @return 
 */
var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');

module.exports = Controller("Home/BaseController", function(){
  "use strict";
  return {
    indexAction: function(){
      	var self = this;
	  	var host = 'http://www.ccjt.net';
	  	request({
		  url: host + '/pu_list_0_51_0_5_8.htm',
		  encoding: null
		}, function(err, res, body) {
			if( err ) {
				return self.error(err);
			} 
			body = iconv.decode(body, 'gbk');

			var $ = cheerio.load(body, {  //sres.charset  iconv.encode(sres.text, 'utf-8')
			    normalizeWhitespace: true,
			    xmlMode: false,
			    decodeEntities: false
			});
	        var items = [];
	        $('.datatable tbody').each(function (idx, element) {
	        	var $element = $(element);
	        	if($element.find('.icon').length) {
		        	var type = $($element.find('.icon')[0]).html();
			        console.log(type);
			        if (type != "GTP") {
			        	items.push({
				          title: $element.find('.subject').find('a').html(),
				          href: url.resolve(host, $element.find('.subject').find('a').attr('href'))
				        });
			        };
		    	}
	        });
	        self.assign('items', items);
	        return self.display();
			// fs.writeFile(, function() {
				// defer.resolve(body)
			// });
		});
    }
  };
});