var pool = require('./con').pool;
var mysql = require('mysql');
var path = require('path');
var express = require('express');
var moment = require('moment');

//TODO: change error messages to generic errors
module.exports.addPost = function(req, res, next) {
  pool.getConnection(function(err, connection) {

    var date = moment(req.body.est_date, 'DD/MM/YYYY');
    console.log("date: %s", date);

    //TODO: change now() to date for established_date
    var insertDevQuery = "INSERT INTO developer(name, address, established_date, no_of_completed_projects, \
    no_of_upcoming_projects, no_of_ongoing_projects, short_desc, long_desc, created_by, created_date) \
    VALUES (?, ?, now(), ?, ?, ?, ?, ?, ?, now())";
    connection.query(insertDevQuery, [req.body.name, req.body.address, req.body.completed_projects, req.body.upcoming_projects, req.body.ongoing_projects, req.body.short_desc, req.body.long_desc, req.user.username], function(err, rows) {
      if(err) {
        console.log("Error inserting row into the developer table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }

      var insertDevContactQuery = "INSERT INTO developer_contact(developer_id, name, address, email_address, \
      phone, created_by, created_date) \
      VALUES (?, ?, ?, ?, ?, ?, now())";
      console.log("developer rows.insertId : %d", rows.insertId);
      connection.query(insertDevContactQuery, [rows.insertId, req.body.contact_name, req.body.contact_address, req.body.contact_email, req.body.contact_phone, req.user.username], function(err, rows) {
        if(err) {
          console.log("Error inserting row into the developer contact table: %s", err);
          return res.status(500).send('Error connecting to database.');
        }
        res.redirect('/browseDeveloper');
      });
    });
    connection.release();
  });
}

module.exports.addGet = function(req, res, next) {
  //res.sendFile(express.static(path.join(__dirname, '../public/add-developer.html')));
  res.render('add-developer.ejs', {
    user : req.user // get the user out of session and pass to template
  });
}

module.exports.browse = function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var selectDevQuery = "SELECT * FROM developer";
    connection.query(selectDevQuery, function(err, rows) {
      if(err) {
        console.log("Error selecting from the developer table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }
      res.render('browse-developer.ejs', {
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
    var deleteDevQuery = "DELETE FROM developer WHERE id=?";
    connection.query(deleteDevQuery, [id], function(err, rows) {
      if(err) {
        console.log("Error deleting row from the developer table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }

      var deleteDevContactQuery = "DELETE FROM developer_contact WHERE developer_id=?";
      connection.query(deleteDevContactQuery, [id], function(err, rows) {
        if(err) {
          console.log("Error deleting row from the developer-contact table: %s", err);
          return res.status(500).send('Error connecting to database.');
        }
        res.redirect('/browseDeveloper');
      });
    });
    connection.release();
  });
}

module.exports.editGet = function(req, res, next) {

}

module.exports.editPost = function(req, res, next) {

}
