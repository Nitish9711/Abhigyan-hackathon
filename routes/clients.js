const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const passport = require('passport');
const Client = require('../models/Client');
const multer = require("multer");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      // console.log(error)
      cb(error, "images/profile");
      // cb(error, "backend/images/lectures");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });


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

router.post('/signup',authentication.ensureNoLogin, multer({ storage: storage }).single("imagePath"),(req,res,next) => {
    // const url = req.protocol + "://" + req.get("host");
    console.log(req.file);
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