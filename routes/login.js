var path = require('path');
var express = require('express');
var isLoggedIn = require('./util').isLoggedIn;

module.exports = function(app, passport) {

	/**
	 * Index page
	 * If logged in : loads dashboard page
	 * If not logged in : redirects to login page
	 */
	app.get('/', function(req, res) {
		if(!req.isAuthenticated()) {
			res.redirect('/login');
		} else {
			res.redirect('/dashboard');
		}
	});

	/**
	 * Login page
	 * If logged in : loads dashboard page
	 * If not logged in : loads login page
	 */
	app.get('/login', function(req, res) {
		if(!req.isAuthenticated()) {
			// render the page and pass in any flash data if it exists
			res.render('login.ejs', { message: req.flash('loginMessage') });
		} else {
			res.redirect('/dashboard');
		}
	});

	/**
	 * Process the login page
	 */
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dashboard', // redirect to the secure dashboard section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}),
	function(req, res) {
		console.log("hello");

		if (req.body.remember) {
			req.session.cookie.maxAge = 1000 * 60 * 3;
		} else {
			req.session.cookie.expires = false;
		}
		res.redirect('/');
	});

	/**
	 * dashboard page
	 * If logged in : loads dashboard page (using route middleware to verify this (the isLoggedIn function)
	 * If not logged in : redirects to index page
	 */
	app.get('/dashboard', isLoggedIn, function(req, res) {
		res.render('dashboard.ejs', {
			user : req.user // get the user out of session and pass to template
		});
		//res.sendFile(express.static(path.join(__dirname, '../public/dashboard.html')));
	});

  /**
	 * Logout page
	 */
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});



	/**
	 * Signup form
	 */
	app.get('/signup', function(req, res) {
		if(!req.isAuthenticated()) {
			// render the page and pass in any flash data if it exists
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		} else {
			res.redirect('/dashboard');
		}
	});

	/**
	 * Process the signup form
	 */
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the secure dashboard section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
};
