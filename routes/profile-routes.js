const router = require('express').Router();

const authCheck = (req,res,next)=>{
	if(!req.user){
		//if not logged in
		res.redirect('/auth/login');
	}
	else{
		next(); //goes to 13
	}
};

router.get('/',authCheck,(req,res)=>{
	res.render('profile',{user: req.user});
});

module.exports = router;