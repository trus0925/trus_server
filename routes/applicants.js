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
    connection.query('select * from applicant where user_userid=?;', [req.body.user_userid], function (error, row) {
     
        if (error == null) {
            
            if(row.length>0){
                var applicant = row[0];
                
                connection.query('select * from bus where num=?;', [applicant.bus_num], function (error, row) {
                    
                    if(error == null){
                        
                        if(row.length>0){
                            var bus = row[0];
                            
                            res.json({
                                result : "success",
                                departureplace : applicant.departureplace,
                                departuretime : applicant.departuretime,
                                applycount : applicant.applycount,
                                applytime : applicant.applytime,
                                bus_tripdate : bus.tripdate,
                                bus_arrival : bus.arrival,
                                bus_endtime : bus.endtime,
                                bus_totalcount : bus.totalcount,
                                bus_fee : bus.fee,
                                bus_isavailable : bus.isavailable,
                                isdeposit : applicant.isdeposit,
                                isboarding : applicant.isboarding
                            });
                        }
                        
                    } else {
                        res.status(503).json({    
                            result : "fail",
                            reason : error
                        });
                    }
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