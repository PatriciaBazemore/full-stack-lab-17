// * Statically serve all files located in the `client` directory
//     * Use the Express body parser instead of manually collecting the incoming chirp on the POST request
//     * Use Express route handlers to set up your API server
//         * Take action depending on GET/POST
//     * Only set content type and response codes when Express cannot infer or incorrectly infers

// * Finish the front-end
//     * Use JQuery's $.ajax function (in lecture on JSON & REST) to communicate with a server
//     * If you'd like, you can use Bootstrap to style your project
//     * Otherwise, style your project with your own CSS file

var path = require("path");
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser"); //middleware 
var mysql = require('mysql');
var app = express();

var clientPath = path.join(__dirname, '../client');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'ChirperUser',
    password: 'Chatt409',
    database: 'Chirper'
});
app.use(express.static(clientPath));
app.use(bodyParser.json());  //use a body parser for parsing jsons 

app.get('/chirps', function(req, res) {     //not api, asking for a front end page, html
    res.sendFile(path.join(clientPath, 'list.html'));
});

app.get('/chirps/*/update', function(req, res) {
    res.sendFile(path.join(clientPath, 'single_update.html'));
});

app.get('/chirps/*', function(req, res) {  //no api
        res.sendFile(path.join(clientPath, 'single_view.html'));
});



app.route('/api/chirps')  ///multiple chirps
    .get(function(req, res) {
        rows('GetAllChirps')
        .then(function(chirps) {
            res.send(chirps);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
    }).post(function(req, res) { //post request on the collection
        var newChirp = req.body;
        row('InsertChirp', [newChirp.message, newChirp.userid])  //call row, will return id
        .then(function(id) {
            res.status(201).send(id);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

app.get('/api/users', function(req, res) {
        rows('GetAllUsers')
        .then(function(users){
            res.send(users);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});



app.route('/api/chirps/:id') //express makes this id param function work//for single chirp posting, updating, deleting
    .get(function(req, res) {
            row('GetAChirp', [req.params.id])
            .then(function(chirp) {
                res.send(chirp);
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    }).put(function(req, res) {
        empty('UpdateChirp', [req.params.id, req.body.message]) //comes from json message has to match front end
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).delete(function(req, res) {
        empty('DeleteChirp', [req.params.id])
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post('/api/chirps', function(req, res) {
    insertChirp(req.body.userid, req.body.message)
    .then(function(id) {
        res.status(201).send(id);
    }, function(err) {
        console.log(err);
        res.sendStatus(500);
    });
})

app.put('/api/chirps/:id', function(req, res) {
    updateChirp(req.params.id, req.body.p_newmessage)
    .then(function() {
        res.sendStatus(204);
    }, function(err) {
        console.log(err);
        res.sendStatus(500);
    });
})

app.delete('/api/chirps/:id', function(req, res) {
    deleteChirp(req.params.id)
    .then(function() {
        res.sendStatus(204);
    }, function(err) {
        console.log(err);
        res.sendStatus(500);
    });
})

app.listen(3000);

// function getAllChirps(){
//     return new Promise(function(fullfill, reject){
//         pool.getConnection(function(err, connection){
//             if (err) {
//                 reject(err);
//             } else {
//                 connection.query("CALL GetAllChirps();", function(err, resultsets){
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         fullfill(resultsets[0]);
//                     }    
//                 });
//             }
//         });
//     });
// }

// function getAChirp(){
//     return new Promise(function(fullfill, reject){
//         pool.getConnection(function(err, connection){
//             if (err) {
//                 reject(err);
//             } else {
//                 connection.query("CALL GetAChirp();", function(err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         fullfill(resultsets[0]);
//                     }
//                 });
//             }
//         });
//     });
// }

// function insertChirp(userid, message) {
//     return new Promise(function(resolve, reject){
//         pool.getConnection(function(err, connection) {
//             if (err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL InsertChirp(?,?);', [userid, message], function(err, resultsets) {
//                    connection.release();
//                    if (err) {
//                        reject(err);
//                    } else {
//                        resolve(resultsets[0][0]);
//                    }
//                 });
//             }
//         });
//     });
// }

// function updateChirp(p_id, p_newmessage){
//     return new Promise(function(resolve, reject) {
//         pool.getConnection(function(err, connection) {
//             if (err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL UpdateChirp(?,?);', [p_newmessage], function(err, resultsets) {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 });
//             }
//         });
//     });
// }

// function deleteChirp(p_id){
//     return new Promise(function(resolve, reject) {
//         pool.getConnection(function(err, connection) {
//             if (err) {
//                 reject(err);
//             } else {
//                 connection.query('CALL DeleteChirp(?);', [p_id], function(err, resultsets) {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 });
//             }
//         });
//     });
// }

function callProcedure(procedureName, args) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                var placeholders = '';
                if (args && args.length > 0) {
                    for(var i = 0; i < args.length; i++) {
                        if (i === args.length - 1) { //if we are on last arg of array
                            placeholders += '?';  
                        } else {
                            placeholders += '?,'; //if not the last arg, adds a ?...results in ?  for each placeholder
                        }
                    }
                }
                //connection.query('CALL' + procedureName + '(' + placholders + ');';
                var callString = 'CALL ' + procedureName + '(' + placeholders + ');'  //Call GetChirps(); or C
                connection.query(callString, args, function(err, resultsets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                });
            }
        });
    });
}

function rows(procedureName, args) {  //procedureName is promise
    return callProcedure(procedureName, args)  //need to return promise
        .then(function(resultsets) {  
            return resultsets[0];   //resolves- get full result set
        });
}

function row(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultsets) {
            return resultsets[0][0];
        });
}

function empty(procedureName, args) {    //use for insert, delet--- we return nothing, aka resovle()
    return callProcedure(procedureName, args)
        .then(function() {
            return;
        });
}