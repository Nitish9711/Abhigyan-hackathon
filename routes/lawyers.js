const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const passport = require('passport');

router.get('/login',(req,res) => {
    res.render('auth/lawyers/login');
})

router.post('/login',authentication.ensureNoLogin,passport.authenticate('clientLocal',{failureRedirect: '/lawyers/login'}),(req,res) => {
    res.redirect('/lawyers/login');
})

module.exports = router;