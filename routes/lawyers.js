const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const find = require('../middleware/find');
const passport = require('passport');
const Lawyer = require('../models/Lawyer');

const lawyersController = require('../controllers/lawyers');

router.get('/login',(req,res) => {
    res.render('lawyers/login');
})

router.post('/login',authentication.ensureNoLogin,passport.authenticate('lawyerLocal',{failureRedirect: '/lawyers/login'}),(req,res) => {
    res.redirect('/dashboard');
})

router.get('/signup',authentication.ensureNoLogin,(req,res) => {
    res.render('lawyers/signup');
})

router.post('/signup',authentication.ensureNoLogin,lawyersController.signUp);

router.get('/:id',authentication.ensureLogin,find.findLawyer,(req,res) => {
    res.render('lawyers/show',{lawyer: req.find.lawyer});
})

router.get('/',authentication.ensureLogin,(req,res) => {
    res.render('lawyers/index');
})


router.post('/search',authentication.ensureLogin,async (req,res) => {
    try{
        const filter = {};
        if(req.body.city && req.body.city!=='None') filter.city = city;
        if(req.body.practiceAreas && req.body.practiceAreas!=='None') filter.practiceAreas = practiceAreas;
        if(req.body.courts && req.body.courts!=='None') filter.courts = courts;
        if(req.body.rating && req.body.rating!=='None') filter.rating = rating;

        const lawyers = await Lawyer.find(filter);
        res.send(lawyers);
    }catch(err){
        res.send([]);
    }
})

module.exports = router;