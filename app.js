const express = require('express');
var bodyParser = require('body-parser');
const ejs = require('ejs');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const localRoutes = require('./routes/local-routes');
const passportSetup = require('./config/passport-setup');
const passportLocal = require('./config/passport-local');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const expressValidator = require('express-validator');
const flash = require('connect-flash'); 
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine','ejs');

app.use(cookieSession({ 			
	maxAge: 12*60*60*1000,
	keys: [keys.session.cookieKey]	//encryption
}));

app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname,'public')));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//mongodb connect
mongoose.connect('mongodb://localhost:27017/ipa', { useNewUrlParser: true },()=>{
	console.log('Mongo Rumming');
});

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());


// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//set up routes
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
app.use('/local',localRoutes);

app.get('/',(req,res)=>{
	res.render('home');
});

app.listen(port, ()=>{
	console.log("app on 3000");
});