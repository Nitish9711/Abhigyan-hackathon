const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');
const find = require('../middleware/find');
const passport = require('passport');
const Lawyer = require('../models/Lawyer');
const upload = require('../middleware/multer');

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


router.post('/signup',authentication.ensureNoLogin, upload.single('image'),lawyersController.signUp);

router.get('/:id',authentication.ensureLogin,find.findLawyer,(req,res) => {
    res.render('lawyers/show',{lawyer: req.find.lawyer});
})

router.get('/',authentication.ensureLogin,(req,res) => {
    res.render('lawyers/index');
})


router.post('/search',authentication.ensureLogin,async (req,res) => {
    try{
        const filter = {};
        if(req.body.city && req.body.city!=='None') filter.city = req.body.city;
        if(req.body.practiceAreas && req.body.practiceAreas!=='None') filter.practiceAreas = {$in: [req.body.practiceAreas]};
        if(req.body.courts && req.body.courts!=='None') filter.courts = {$in: [req.body.courts]};
        if(req.body.gender && req.body.gender!=='None') filter.gender = req.body.gender;
        //TODO: rating left
        // if(req.body.rating && req.body.rating!=='None' && parseInt(req.body.rating)!==NaN){
        //     // filter.rating = {$gte: parseInt(req.body.rating)};
        // }

        const lawyers = await Lawyer.find(filter);
        if(req.body.experience && req.body.experience!=='None'){
            for(let i=0;i<lawyers.length;i++){
                let sum=0;
                for(const exp of lawyer[i].experience) sum+=exp.years;
                if(sum<req.body.experience){
                    lawyers.splice(i,1);
                    i--;
                }
            }
        }
        res.send(lawyers);
    }catch(err){
        res.send([]);
    }
})


module.exports = router;