const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user,done)=>{	//cookies
	done(null,user.id); //done here
});

passport.deserializeUser((id,done)=>{	//cookies
	User.findById(id).then((user)=>{
		done(null,user);	
	});
	
});


passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //check if user already exists in the database

        User.findOne({googleId: profile.id}).then((currentUser)=>{
        	if(currentUser){
        		//already user hai
        		console.log('user is: ',currentUser);
        		done(null,currentUser);
        	}
        	else{
        		//create new user
		new User({
        	username: profile.displayName,
        	googleId: profile.id,
        	thumbnail: profile._json.image.url
        }).save().then((newUser)=>{
        	console.log('new user created:'+newUser);
        	done(null,newUser);
        }) //callback fire when saving complete
        	}
        });

        
    })
);