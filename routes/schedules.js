var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : '127.0.0.1',
	'user' : 'user',
	'password' : 'password', 
	'database' : 'trus',
});

router.post('/', function(req, res, next) {
  
	connection.query('select id, title, timestamp from bus order by timestamp desc;', function (error, cursor) {
		
		res.json(cursor);
	});
});

module.exports = router;
