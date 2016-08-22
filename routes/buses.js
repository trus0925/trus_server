var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : '127.0.0.1',
	'user' : 'user',
	'password' : 'password', 
	'database' : 'trus',
});

router.get('/', function(req, res, next) {
    
    connection.query('select * from bus order by tripdate asc;', function (error, rows) {
		res.json({
            result : "success",
            buses : rows
        });
        
	});
});

module.exports = router;
