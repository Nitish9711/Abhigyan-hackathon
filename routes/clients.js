const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const upload = require('../middleware/multer');
const passport = require('passport');
const Client = require('../models/Client');
const multer = require("multer");
const path = require('path');



router.get('/login',authentication.ensureNoLogin,(req,res) => {
    res.render('clients/login');
})

router.post('/login',authentication.ensureNoLogin,passport.authenticate('clientLocal',{failureRedirect: '/clients/login'}),(req,res) => {
    console.log(req.body);
    res.redirect('/dashboard');
})

router.get('/signup',authentication.ensureNoLogin,(req,res) => {
    res.render('clients/signup');
})

router.post('/signup',authentication.ensureNoLogin, upload.single('image'),async  (req,res,next) => {
    // const url = req.protocol + "://" + req.get("host");
    const imagePath = path.join(__dirname, '/public/images');
    if (!req.file) {
      res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await req.file.save(req.file.buffer);

    console.log(req.file);
    console.log(req.body);
    const {password} = req.body;
    const client = new Client(req.body);
    Client.register(client,password)
        .then(() => {
            req.login(client,err => {
                if(err) next(err);
                else res.redirect('/dashboard');
            })
        })
        .catch(err => next(err));
})

module.exports = router;