var pool = require('./con').pool;
var mysql = require('mysql');
var path = require('path');
var express = require('express');
var dateFormat = require('dateFormat');

//TODO: change error messages to generic errors
module.exports.addPost = function(req, res, next) {

  //form validation - project
  req.checkBody('developer', 'Developer is not valid').notEmpty();
  req.checkBody('developer_contact', 'Developer contact is not valid').notEmpty();
  req.checkBody('project_status_type', 'Project status type is not valid').notEmpty();
  req.checkBody('project_name', 'Project name is not valid').notEmpty().isLength({ min: 1, max: 100 });
  req.checkBody('project_area', 'Project area is not valid').notEmpty().isFloat({ min: 1, max: 999999999.99 });
  req.checkBody('no_of_buildings', 'Number of buildings in the project is not valid').notEmpty().isInt({ min: 1, max: 2147483647 });
  req.checkBody('no_of_units', 'Number of units in the project is not valid').notEmpty().isInt({ min: 1, max: 2147483647 });
  req.checkBody('project_desc', 'Long description of the developer is not valid (max characters allowed:1000)').notEmpty().isLength({ min: 1, max: 1000 });
  req.checkBody('launch_date', 'Launch Date is not valid').notEmpty();
  req.checkBody('possession_date', 'Possession Date is not valid').notEmpty();

  //form validation - project location
  req.checkBody('city', 'Developer is not valid').notEmpty();
  req.checkBody('city_area', 'Developer contact is not valid').notEmpty();
  req.checkBody('address', 'Address is not valid (max characters allowed:255)').notEmpty().isLength({ min: 1, max: 255 });
  req.checkBody('locality', 'Locality is not valid (max characters allowed:255)').notEmpty().isLength({ min: 1, max: 255 });
  req.checkBody('locality_desc', 'Locality Description is not valid (max characters allowed:1000)').notEmpty().isLength({ min: 1, max: 1000 });;
  req.checkBody('pincode', 'Pincode is not valid(max characters allowed:45)').notEmpty().isNumeric().isLength({ min: 1, max: 45 });
  req.checkBody('latitude', 'Latitude is not valid').notEmpty().isFloat({ min: 1, max: 99.99999999 });
  req.checkBody('longitude', 'Longitude is not valid').notEmpty().isFloat({ min: 1, max: 999.99999999 });

  pool.getConnection(function(err, connection) {
    var data = [
      req.body.developer,
      req.body.developer_contact,
      req.body.project_status_type,
      req.body.project_name,
      req.body.project_area,
      req.body.no_of_buildings,
      req.body.no_of_units,
      req.body.project_desc,
      req.body.launch_date,
      req.body.possession_date,
      req.user.username
    ]
    var insertProjectQuery = "INSERT INTO `project` (developer_id, developer_contact_id, project_status_type_id, \
        name, project_area, no_of_buildings, no_of_units, project_desc, launch_date, possession_date, created_by, \
        created_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())";

    connection.query(insertProjectQuery, data, function(err, rows) {
      if(err) {
        console.log("Error inserting row into the project table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }

      var locationData = [
        rows.insertId,
        req.body.city_area,
        req.body.address,
        req.body.locality,
        req.body.locality_desc,
        req.body.pincode,
        req.body.latitude,
        req.body.longitude,
        req.user.username
      ]
      var insertLocationQuery = "INSERT INTO `location` (project_id, cityarea_id, address, locality, \
      locality_desc, pincode, latitude, longitude, created_by, created_date) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now())";

      connection.query(insertLocationQuery, locationData, function(err, rows) {
        if(err) {
          console.log("Error inserting row into the location table: %s", err);
          return res.status(500).send('Error connecting to database.');
        }
        res.redirect('/browseProject');
      });
    });
    connection.release();
  });
}

module.exports.addGet = function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var selectQuery = "SELECT * FROM developer;";
    selectQuery += "SELECT * FROM developer_contact;";
    selectQuery += "SELECT * FROM project_status_type;";
    selectQuery += "SELECT * FROM city;";
    selectQuery += "SELECT * FROM cityarea;";
    connection.query(selectQuery, function(err, rows) {
      if(err) {
        console.log("Error selecting from the project table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }

      res.render('add-project.ejs', {
        user : req.user, // get the user out of session and pass to template
        developers : rows[0], //rows returned from the database
        developer_contacts : rows[1],
        project_status_types : rows[2],
        cities : rows[3],
        cityareas : rows[4]
      });
    });
    connection.release();
  });
}

module.exports.browse = function(req, res, next) {
  /*pool.getConnection(function(err, connection) {
    var selectDevQuery = "SELECT * FROM developer";
    connection.query(selectDevQuery, function(err, rows) {
      if(err) {
        console.log("Error selecting from the developer table: %s", err);
        throw err;
      }
      res.render('browse-developer.ejs', {
        user : req.user, // get the user out of session and pass to template
        data : rows //rows returned from the database
      });
    });
    connection.release();
  });*/
}

module.exports.delete = function(req, res, next) {
  /*var id = req.params.id;
  pool.getConnection(function(err, connection) {
    var deleteDevQuery = "DELETE FROM developer WHERE id=?";
    connection.query(deleteDevQuery, [id], function(err, rows) {
      if(err) {
        console.log("Error deleting row from the developer table: %s", err);
        throw err;
      }

      var deleteDevContactQuery = "DELETE FROM developer_contact WHERE developer_id=?";
      connection.query(deleteDevContactQuery, [id], function(err, rows) {
        if(err) {
          console.log("Error deleting row from the developer-contact table: %s", err);
          throw err;
        }
        res.redirect('/browseDeveloper');
      });
    });
    connection.release();
  });*/
}

module.exports.editGet = function(req, res, next) {

}

module.exports.editPost = function(req, res, next) {

}
