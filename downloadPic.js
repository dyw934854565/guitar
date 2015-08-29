var request = require('request');
var iconv = require('iconv-lite');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var Q = require('q');
var emitter = require('events').EventEmitter;
var emitter = new emitter();

var db = require('mysql');
var db_config = {
  	host     : 'qdm114475292.my3w.com',
  	user     : 'qdm114475292',
  	password : 'DO923315',
  	database : 'qdm114475292_db',
  	insecureAuth: true
};
var connection = db.createConnection(db_config);

var data;
var now = 0;
var index = 0;
var length;
var success = 0;

function reconnetMysql(err) {
	if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
    	console.log('reconnected');
      	connection = db.createConnection(db_config);                       // lost due to either server restart, or a
      	connection.connect();
      	connection.on('error', function(err) {
		    reconnetMysql(err);
	  	});
    } else {                                      // connnection idle timeout (the wait_timeout
      	throw err;                                  // server variable configures this)
    }
}
connection.connect(function(err) {
  	if (err) {
    	console.error('error connecting: ' + err.stack);
	    return;
  	}
   	console.log('connected as id ' + connection.threadId);

   	connection.on('error', function(err) {
	    reconnetMysql(err);
  	});
   	getEmptyPath().then(function(rows) {
   		length = rows.length;
   		data = rows;
   		for (var i = 0; i < 300; i++) {
   			download();
   		};
   	},function(err) {
   		console.log(err);
   		connection.end();
   	})
});

function getEmptyPath() {
	var deferred = Q.defer();
	var sql = "select pu_pic_list.*,pu_list.pu_referer from pu_list,pu_pic_list where pu_list.id = pu_pic_list.pu_id and pu_pic_list.pu_path=''";
	connection.query(sql, function(err, rows) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(rows);
		}
	});
	return deferred.promise;
}
function fillPath(id, path) {
	var deferred = Q.defer();
	var sql = "update pu_pic_list set pu_path='" + path + "' where id=" + id;
	connection.query(sql, function(err, rows) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}



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
function download(id) {
	now++;
	var id = id || index++;
	if(id >= length) {
		return;
	}
	var pu_id = data[id]['id'];
	var referer = data[id]['pu_referer'];
	var url = data[id]['pu_src'];
	console.log(referer, url);
	console.log('try ', id, now);
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
				console.log('fail ', id, now);
				download(id);
			} else {
				var path = mkdir() + url.substr(url.lastIndexOf('/'));
				console.log('writeFile',id, now);
			    writeFile(path, body)
			    	.then(function(){
			    		return fillPath(pu_id, path);
			    	})
			    	.then(function(){
						console.log('success ', id, now);
						success++;
						if (now == 0 && index == length ) {
							console.log(length, success);
					    	connection.end();
					    } else {
					    	download();
					    }
			    	})
			}
		});
	} catch (e) {
		console.log(e);
		download(id);
	}
}
function writeFile(path, body) {
	var  deferred = Q.defer();
	fs.writeFile(path, body, function(err) {
		if (err) {
			console.log(err);
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
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