const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const upload = require('../middleware/multer');
const passport = require('passport');
const Client = require('../models/Client');
const multer = require("multer");
const path = require('path');
const fs = require('fs/promises');

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
    const {password} = req.body;
    const client = new Client(req.body);
    client.image = `/images/uploads/${req.file.filename}`;
    Client.register(client,password)
        .then(() => {
            req.login(client,err => {
                if(err) next(err);
                else res.redirect('/dashboard');
            })
        })
        .catch(err => {
            fs.unlink(`./public//images/uploads/${req.file.filename}`);
            next(err)
        });
})

module.exports = router;