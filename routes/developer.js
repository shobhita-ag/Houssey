var pool = require('./con').pool;
var mysql = require('mysql');
var path = require('path');
var express = require('express');
var moment = require('moment');

//TODO: change error messages to generic errors
module.exports.addPost = function(req, res, next) {

  //form validation
  req.checkBody('name', 'Name is not valid (max characters allowed:100)').notEmpty().isLength({ min: 1, max: 100 });
  req.checkBody('address', 'Address is not valid (max characters allowed:255)').notEmpty().isLength({ min: 1, max: 255 });;
  req.checkBody('est_date', 'Established Date is not valid').notEmpty();
  req.checkBody('completed_projects', 'Number of completed projects is not valid').notEmpty().isInt({ min: 1, max: 2147483647 });
  req.checkBody('upcoming_projects', 'Number of upcoming projects is not valid').notEmpty().isInt({ min: 1, max: 2147483647 });
  req.checkBody('ongoing_projects', 'Number of ongoing projects is not valid').notEmpty().isInt({ min: 1, max: 2147483647 });
  req.checkBody('short_desc', 'Short description of the developer is not valid (max characters allowed:100)').notEmpty().isLength({ min: 1, max: 100 });
  req.checkBody('long_desc', 'Long description of the developer is not valid (max characters allowed:1000)').notEmpty().isLength({ min: 1, max: 1000 });
  req.checkBody('contact_name', 'Contact Name is not valid (max characters allowed:100)').notEmpty().isLength({ min: 1, max: 100 });
  req.checkBody('contact_address', 'Contact Address is not valid (max characters allowed:255)').notEmpty().isLength({ min: 1, max: 255 });
  req.checkBody('contact_email', 'Contact Email address is not valid (max characters allowed:255)').notEmpty().isEmail().isLength({ min: 1, max: 255 });;
  req.checkBody('contact_phone', 'Contact Phone is not a valid IN number').notEmpty().isMobilePhone("en-IN");

  // check the validation object for errors
  var errors = req.validationErrors();
  console.log(errors);
  if (errors) {
    req.flash('addDeveloperErrors', errors);
    res.redirect('/addDeveloper');
    return;
  }
  pool.getConnection(function(err, connection) {

    var date = moment(req.body.est_date, 'DD/MM/YYYY');
    console.log("date: %s", date);

    var data = [
      req.body.name,
      req.body.address,
      req.body.est_date,
      req.body.completed_projects,
      req.body.upcoming_projects,
      req.body.ongoing_projects,
      req.body.short_desc,
      req.body.long_desc,
      req.user.username
    ]
    var insertDevQuery = "INSERT INTO developer(name, address, established_date, no_of_completed_projects, \
    no_of_upcoming_projects, no_of_ongoing_projects, short_desc, long_desc, created_by, created_date) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now())";

    connection.query(insertDevQuery, data, function(err, rows) {
      if(err) {
        console.log("Error inserting row into the developer table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }

      var contactData = [
        rows.insertId,
        req.body.contact_name,
        req.body.contact_address,
        req.body.contact_email,
        req.body.contact_phone,
        req.user.username
      ]
      var insertDevContactQuery = "INSERT INTO developer_contact(developer_id, name, address, email_address, \
      phone, created_by, created_date) \
      VALUES (?, ?, ?, ?, ?, ?, now())";
      console.log("developer rows.insertId : %d", rows.insertId);
      connection.query(insertDevContactQuery, contactData, function(err, rows) {
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
    user : req.user, // get the user out of session and pass to template
    message : req.flash('addDeveloperErrors')
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
