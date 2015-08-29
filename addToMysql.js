var fs = require('fs');
var db = require('mysql');

var connection = db.createConnection({
  host     : 'qdm114475292.my3w.com',
  user     : 'qdm114475292',
  password : 'DO923315',
  database : 'qdm114475292_db',
  insecureAuth: true
});

var data;
connection.connect(function(err) {
  	if (err) {
    	console.error('error connecting: ' + err.stack);
	    return;
  	}
   	console.log('connected as id ' + connection.threadId);

   	// var sql = "select count(id) from pu_pic_list";
   	// connection.query(sql, function(err, rows) {
   	// 	console.log(rows);
   	// });
   	fs.readFile('./withPic.txt', 'utf8', function(err, dat) {
		data = JSON.parse(dat);
		for (var i = data.length - 1; i >= 0; i--) {
			addMysql(i);
		};
	});
});




var uncheck = 0;

function addMysql(i) {
	var sql = "select id,pu_count from pu_list where pu_referer='" + data[i].href + "'";
	connection.query(sql, function(err, rows) {
		if(err){
			console.log(err, 'check', sql);
			return;
		}
	 	if(rows.length) {
	 		sql = "select count(id) from pu_pic_list where pu_id="+rows[0]['id'];
	 		connection.query(sql, function(err, row) {
	 			if (row[0]['count(id)'] == rows[0]['pu_count']) {
	 			} else {
	 				console.log(row[0]['count(id)'],rows[0]['pu_count'],i);
	 				uncheck++;
	 				var id = rows[0]['id'];
				   	var picArr = data[i].picArr;
				   	var values = [];
				   	for (var k = 0; k < picArr.length; k++) {
				   		values.push("("+id+",'"+picArr[k].src+"','',"+k+")");
				   	};
				   	sql = "insert into pu_pic_list (pu_id,pu_src,pu_path,pu_order) values" + values.join(',');
				   	connection.query(sql, function(err, rows) {
				   		if(err){
							console.log(err, 'pu_pic_list', sql);
						}
				   	});
	 			}
	 		});
		} else {
			sql = "insert into pu_list (pu_name,pu_count,pu_referer) values('"+ data[i].title +"'," + data[i].picArr.length + ",'" + data[i].href + "')";
			connection.query(sql, function(err, rows) {
				if(err){
					console.log(err, 'pu_list', sql);
					return;
				}
			   	var id = rows.insertId;
			   	var picArr = data[i].picArr;
			   	var values = [];
			   	for (var k = 0; k < picArr.length; k++) {
			   		values.push("("+id+",'"+picArr[k].src+"','',"+k+")");
			   	};
			   	sql = "insert into pu_pic_list (pu_id,pu_src,pu_path,pu_order) values" + values.join(',');
			   	connection.query(sql, function(err, rows) {
			   		if(err){
						console.log(err, 'pu_pic_list', sql);
					}
			   	});
			});
		}
	});
}