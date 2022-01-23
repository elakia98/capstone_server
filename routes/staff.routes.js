const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs') //password hasing library
const jwt = require('jsonwebtoken') //for allowing authentication
const {check,validationResult} = require('express-validator')

const staffModel = require('../models/staff.model');
const auth = require('../middleware/auth')

//start
var jwtSecret = "mysecrettoken"
//end



router.get('/',async(req,res)=>{
    try{
        const staff = await staffModel.find();
        res.json(staff)
    }catch(err){
        console.log('Error' + err);
    }
   
});

router.post('/create',async(req,res)=>{
    const staff = new staffModel({
        staffName : req.body.staffName,
        dept : req.body.dept,
        gender : req.body.gender,
        contactAddress : req.body.contactAddress,
        email : req.body.email,
        password:req.body.password,
        subject : req.body.subject,
        studentId : req.body.studentId
    });
    try{
        const newStaff = await staff.save();
        res.send(newStaff);
    }catch(err){
        res.send('Error' + err);
    }
});

//start

router.post('/dummy',[
    check("staffName","Name is required").not().isEmpty(),
    check("email","Please mention your email").isEmail(),
    check("password","Please enter password with 6 or more").isLength({min:6}),
    check("dept","Please enter your department").not().isEmpty(),
    check("gender","Please enter your Gender").not().isEmpty(),
    check("contactAddress","Please enter your Address").not().isEmpty(),
    check("subject","Please enter subject").not().isEmpty()
],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const  {staffName,email,password,dept,gender,contactAddress,subject} = req.body;
        try{
            //see if user exist
            let user = await staffModel.findOne({email});
            if(user){
                res.send(400).json({errors:[{msg:"User already exist"}]})
            }
            user = new staffModel({
                staffName,
                email,
                password,
                dept,
                gender,
                contactAddress,
                subject
            });
            //Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            await user.save();

            //Return json web token(jwt)
            const payload = {
                user:{
                    id : user.id,
                }
            };
            jwt.sign(payload,jwtSecret,{expiresIn:360000},(err,token)=>{
                if(err) throw err;
                res.json({token});
            });
        }catch(err){
            console.error(err.message);
            res.status(500).send("Internal Server error");
        }
    }
)

//Load user
router.get("/dummy/det",auth,async(req,res)=>{
    console.log(req.body);
    try{
        const user = await staffModel.findById(req.user.id).select("-password");
        res.json(user);
    }catch(err){
            console.error(err.message);
            res.status(500).send("Internal Server error");
        }
});

router.post('/dummy/det',[
    check("email","Please enter a valid email").isEmail(),
    check("password","Password is required").exists(),

],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const  {email,password} = req.body;
        try{
            //see if user exist
            let user = await staffModel.findOne({email});
            if(!user){
               return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({errors:[{msg:"Invalid credentials"}]})

            }
            //Return json web token
            const payload = {
                user:{
                    id : user.id,
                }
            };
            jwt.sign(payload,jwtSecret,{expiresIn:"5 days"},(err,token)=>{
                if(err) throw err;
                res.json({token});
            });
        }catch(err){
            console.error(err.message);
            res.status(500).send("Internal Server error");
        }
    }
)



//end


router.put('/edit/:id',async(req,res)=>{
    try{
        await staffModel.findOneAndUpdate({_id:req.params.id},req.body).then(function(staff){
            staffModel.findOne({_id:req.params.id}).then(function(staff){
                res.send(staff);
            });
        });
    }catch(err){
        res.send('Error' + err);
    }
   
});

module.exports = router;