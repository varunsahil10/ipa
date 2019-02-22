const router = require('express').Router();
const passport = require('passport');



//auth login
router.get('/login',(req,res)=>{
	res.render('locallogin',{user: req.user }); //send user where ever requested
});


//auth logout
router.get('/logout',(req,res)=>{
	//handled with passport
	req.logout();
	res.redirect('/');
});

//auth with google
router.get('/google',passport.authenticate('google',{
	scope: ['profile'] //info we need from the user
}));


//callback routes for google to redirectr
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
	//res.send(req.user);
	res.redirect('/profile/');
});

module.exports =router;
