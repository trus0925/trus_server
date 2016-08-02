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
    
    res.json({
        post : "success"
    });

    connection.query('insert into user(id, password) values (?, ?);', [req.body.id, req.body.password], function (error, info) {

            if (error == null) {

                    connection.query('select * from board_table where id=?;', [info.insertId], function (error, cursor) {

                            if (cursor.length > 0) {

                                    var result = cursor[0];

                                    res.json({
                                            result : true,
                                            id : result.id,
                                            password : result.password,
                                    });
                            }
                            else {

                                    res.status(503).json({
                    
                                        result : false,
                                        reason : "Cannot post article"
                                    });
                            }
                    });
            }
            else {

                    res.status(503).json(error);
            }
    });
});

module.exports = router;