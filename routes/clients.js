const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const upload = require('../middleware/multer');
const passport = require('passport');
const Client = require('../models/Client');
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const find = require('../middleware/find');

const clientsController = require('../controllers/clients');

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

router.post('/signup',authentication.ensureNoLogin, upload.single('image'),clientsController.signUp);

router.get('/:id',authentication.ensureLogin,find.findClient,(req,res) => {
    res.render('clients/show',{clients: req.find.client});
})



module.exports = router;