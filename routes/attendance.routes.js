const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs') //password hasing library
const jwt = require('jsonwebtoken') //for allowing authentication
const {check,validationResult} = require('express-validator')
const facultyModel = require("../models/faculty.model");
const auth = require("../middleware/auth");

var jwtSecret = "mysecrettoken"
