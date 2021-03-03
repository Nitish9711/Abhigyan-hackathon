const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const passport = require('passport');

router.get('/login',authentication.ensureNoLogin,(req,res) => {
    res.render('auth/clients/login');
})

// router.post('/login',authentication.ensureNoLogin,passport.authenticate('clientLocal',{failureRedirect: '/clients/login'}),(req,res) => {
//     console.log(req.body);
//     res.redirect('/clients');
// })
router.post('/login',(req,res) => {
    console.log(req.body);
    res.redirect('/api');
})

module.exports = router;