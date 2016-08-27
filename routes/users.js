var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : '127.0.0.1',
	'user' : 'user',
	'password' : 'password',
	'database' : 'trus',
});

//get users list
// router.post('/', function(req, res, next) {
  
// 	connection.query('select * from user;', function (error, rows) {
// 		res.json(rows);
// 	});
// });

//sign-in : get a user id
router.post('/login', function(req, res, next) {
    
	connection.query('select * from user where userid=?;', [req.body.userid], function (error, row) {
        
        if(error==null){
                    
            if(row.length>0){
                var user = row[0];
                if (user.password == req.body.password) {
                    res.json({
                        result : "success",
                        userid : user.userid,
                        username : user.username,
                        phone : user.phone,
                        gender : user.gender,
                        birthday : user.birthday
                    })
                } else {
                    res.status(202).json({            
                        result : "fail",
                        reason : "wrong password"
                    });
                }
            } else {
                res.status(202).json({            
                    result : "fail",
                    reason : "wrong userid"
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

//check id duplication
router.post('/checkid', function(req, res, next) {
    connection.query('select * from user where userid=?;', [req.body.userid], function (error, row) {
        
        if (error == null) {

            //if there is no same id
            if (row.length == 0) {
                res.json({
                    result : "success"
                });
            }
            
            //else if there is same id
            else {
                res.status(202).json({
                    result : "fail",     
                    reason : "duplicated"
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

//join : a new user
router.post('/join', function(req, res, next) {
   
    connection.query('insert into user(userid, password, username, phone, gender, birth) values (?, ?, ?, ?, ?, ?);', 
        [req.body.userid, req.body.password, req.body.username, req.body.phone, req.body.gender, req.body.birth], function (error, info) {
 
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

router.post('/findid', function (req, res, next) {
    
    connection.query('select userid from user where username=? AND phone=? AND birth=?', 
                        [req.body.username, req.body.phone, req.body.birth], function (error, row) {
        
        if (error == null) {
            
            if(row.length>0){
                res.json({
                    result : "success",
                    userid : row[0].userid
                });
            }
            
            //no matches user
            else {
                res.status(202).json({            
                    result : "fail",
                    reason : "wrong info"
                });
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

router.post('/findpw', function (req, res, next) {
    
    connection.query('select password from user where userid=? AND username=? AND phone=? AND birth=?;', 
                        [req.body.userid, req.body.username, req.body.phone, req.body.birth], function (error, row) {
        
        if (error == null) {
            
            if(row.length>0){
                res.json({
                    result : "success",
                    password : row[0].password
                });
            }
            
            //no matches user
            else {
                res.status(202).json({            
                    result : "fail",
                    reason : "wrong info"
                });
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