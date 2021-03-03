const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const passport = require('passport');
const Lawyer = require('../models/Lawyer');

router.get('/login',(req,res) => {
    res.render('lawyers/login');
})

router.post('/login',authentication.ensureNoLogin,passport.authenticate('lawyerLocal',{failureRedirect: '/lawyers/login'}),(req,res) => {
    res.redirect('/dashboard');
})

router.get('/signup',authentication.ensureNoLogin,(req,res) => {
    res.render('lawyers/signup');
})

router.post('/signup',authentication.ensureNoLogin,(req,res,next) => {
    const {password} = req.body;
    const lawyer = new Lawyer(req.body);
    Lawyer.register(lawyer,password)
        .then(() => {
            req.login(lawyer,err => {
                if(err) next(err);
                else res.redirect('/dashboard');
            })
        })
        .catch(err => next(err));
})

module.exports = router;