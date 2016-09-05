var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : '127.0.0.1',
	'user' : 'user',
	'password' : 'password',
	'database' : 'trus',
});

//get passenger information
router.get('/:userid', function(req, res, next) {
  
	connection.query('select * from applicant where userid=? AND isdeposit=1;', [req.params.userid], function (error, row) {
		
        if (error == null) {
            if(row.length>0){
                var applicant = row[0];
                
                connection.query('select username from user where userid=?;', [req.params.userid], function (error, row) {
                    if (error == null) {
                        if(row.length>0){
                            
                            var answer = "";
                            answer += "이름 : " + row[0].username + "\n";
                            answer += "버스 번호 : " + applicant.bus_num + "\n";
                            answer += "상세 출발지 : " + applicant.departureplace + "\n";
                            // answer += "좌석 번호 : " + applicant.departureplace + "\n"; 
                            
                            res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
                            res.end(answer);            
                
                        }
                        
                    } else {
                        res.status(503).json({    
                            result : "fail",
                            reason : error
                        });
                    }
                    
                });          
            }
            
            else {                
                res.writeHead(202, {'Content-Type':'text/plain; charset=utf-8'});
                res.end("츄러스 탑승객이 아닙니다.");
            }
            
        }
        
        else {
            res.status(503).json({    
                result : "fail",
                reason : error
            });
        }
        
	});
    
});


module.exports = router;