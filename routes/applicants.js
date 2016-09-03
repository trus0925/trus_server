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
    
    connection.query('insert into applicant(user_userid, bus_num, departureplace, departuretime, applycount) values (?, ?, ?, ?, ?);', 
                        [req.body.user_userid, req.body.bus_num, req.body.departureplace, req.body.departuretime, req.body.applycount], function (error, info) {
 
        if (error == null) {
            
            res.json({
                result : "success"
            });
        }
        
        else {
            res.status(503).json({    
                result : "fail",
                reason : error
            });
        }     
    });
    
});

router.post('/ticket', function(req, res, next) {
    connection.query('select bus_num, departureplace, departuretime, applycount, applytime, IF(isdeposit,"true","false") AS isdeposit, IF(isboarding,"true","false") AS isboarding from applicant where user_userid=?;', [req.body.user_userid], function (error, rows) {
     
        if (error == null) {
            
            if(rows.length>0){
                res.json({
                    result : "success",
                    applicant : rows
                });
            }
            
            //there is no apply on this id
            else {
                res.status(202).json({            
                    result : "fail",
                    reason : "not applicant"
                });
            }
            
        } else {
            res.status(503).json({    
                result : "fail",
                reason : error
            });
        }
    });
});

module.exports = router;