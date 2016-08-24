var pool = require('./con').pool;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');
var express = require('express');
const USER_STATUS = 1;

//TODO: change error messages to generic errors
module.exports.addPost = function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query("SELECT * FROM user WHERE username = ?",[req.body.username], function(err, rows) {
      if(err)
        throw err;

      if(rows.length)
        res.render('add-user.ejs', {
          message : 'That username is already taken.', //error message
          user : req.user
        });

      else {
        var encryptedPassword = bcrypt.hashSync(req.body.password, null, null);

        var insertUserQuery = "INSERT INTO user (user_type_id, username, name, password, address, email_address, phone, status, created_date) \
        SELECT id, ?, ?, ?, ?, ?, ?, ?, now() \
        FROM user_type \
        WHERE name = ?";

        connection.query(insertUserQuery, [req.body.username, req.body.name, encryptedPassword , req.body.address, req.body.email, req.body.phone, USER_STATUS, req.body.user_type], function(err, rows) {
          if(err) {
            console.log("Error inserting row into the user table: %s", err);
            return res.status(500).send('Error connecting to database.');
          }
          res.render('browse-user.ejs', {
            user : req.user // get the user out of session and pass to template
          });
        });
      }
    });
    connection.release();
  });
}

module.exports.addGet = function(req, res, next) {
  //res.sendFile(express.static(path.join(__dirname, '../public/add-user.html')));
  res.render('add-user.ejs', {
    message : '',
    user : req.user // get the user out of session and pass to template
  });
}

module.exports.browse = function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var selectDevQuery = "SELECT * FROM user";
    connection.query(selectDevQuery, function(err, rows) {
      if(err) {
        console.log("Error selecting from user table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }
      res.render('browse-user.ejs', {
        user : req.user, // get the user out of session and pass to template
        data : rows //rows returned from the database
      });
    });
    connection.release();
  });
}

module.exports.delete = function(req, res, next) {
  var id = req.params.id;
  pool.getConnection(function(err, connection) {
    var deleteDevQuery = "DELETE FROM user WHERE id=?";
    connection.query(deleteDevQuery, [id], function(err, rows) {
      if(err) {
        console.log("Error deleting from user table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }
      res.redirect('/browseUser');
    });
    connection.release();
  });
}

module.exports.editGet = function(req, res, next) {

}

module.exports.editPost = function(req, res, next) {

}
