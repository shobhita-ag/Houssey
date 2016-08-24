var pool = require('./con').pool;
var mysql = require('mysql');
var path = require('path');
var express = require('express');
var dateFormat = require('dateFormat');

//TODO: change error messages to generic errors
module.exports.addPost = function(req, res, next) {
  pool.getConnection(function(err, connection) {

    var insertProjectQuery = "INSERT INTO project(developer_id, developer_contact_id, project_status_type_id, \
    name, project_area, no_of_buildings, no_of_units, desc, launch_date, possession_date, created_by, created_date) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now());";

    connection.query(insertProjectQuery, [req.body.developer, req.body.developer_contact, req.body.project_status_type,
          req.body.name, req.body.project_area, req.body.no_of_buildings, req.body.no_of_units, req.body.desc,
          req.body.launch_date, req.body.possession_date, req.user.username], function(err, rows) {
      if(err) {
        console.log("Error inserting row into the project table: %s", err);
        return res.status(500).send('Error connecting to database.');
      }

      var insertLocationQuery = "INSERT INTO location(project_id, cityarea_id, address, locality, \
      locality_desc, pincode, latitude, longitude, created_by, created_date) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now())";
      console.log("developer rows.insertId : %d", rows.insertId);

      connection.query(insertLocationQuery, [rows.insertId, req.body.city_area, req.body.address, req.body.locality,
            req.body.locality_desc, req.body.pincode, req.body.latitude, req.body.longitude, req.user.username], function(err, rows) {
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
