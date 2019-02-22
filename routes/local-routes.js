const router = require('express').Router();
const passport = require('passport');
const User = require('../models/local-model');
const LocalStrategy = require('passport-local').Strategy;

//register new user
router.get('/register',(req,res)=>{
	res.render('register');
});

//local login
router.get('/locallogin',(req,res)=>{
	res.render('locallogin');
});
// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//console.log(name);

	
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


	var errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			errors: errors
		});
		console.log(errors);
	}
	else{
		var newUser = new User({
			name:name,
			email:email,
			username:username,
			password:password
		});

		User.createUser(newUser,function(err,user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/local/locallogin');
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/locallogin',
	passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/local/locallogin', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/locallogout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/local/locallogin');
});
module.exports = router;
