var mysql = require('mysql');

var pool = mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : 'universe',
     database : 'houssey',
     dateStrings : true,
     multipleStatements : true
 });

module.exports.pool = pool;
