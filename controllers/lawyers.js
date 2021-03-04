const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const upload = require('../middleware/multer');
const passport = require('passport');
const Client = require('../models/Lawyer');
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const Lawyer = require('../models/Lawyer');


exports.signUp =  (req,res,next) => {
    const {password} = req.body;
    const lawyer = new Lawyer(req.body);
    lawyer.image = `/images/uploads/${req.file.filename}`;
    Lawyer.register(lawyer,password)
        .then(() => {
            req.login(lawyer,err => {
                if(err) next(err);
                else res.redirect('/dashboard');
            })
        })
        .catch(err => {
            fs.unlink(`./public//images/uploads/${req.file.filename}`);
            next(err)
        });
}

exports.getLawyer =  (req, res, next) => {
    Lawyer.findById(req.params.id).then(lawyer => {
        if (lawyer) {
          res.status(200).json(lawyer);
        } else {
          res.status(404).json({ message: "Post not found!" });
        }
      });
  
  };

  
  