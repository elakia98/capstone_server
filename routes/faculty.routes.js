const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs') //password hasing library
const jwt = require('jsonwebtoken') //for allowing authentication
const {check,validationResult} = require('express-validator')
const facultyModel = require("../models/faculty.model");
const subjectModel = require('../models/subject.model');
const attendanceModel = require('../models/attendance.model');
const auth = require("../middleware/auth");


var jwtSecret = "mysecrettoken"

router.post('/login',[
    check("registrationNumber","Please enter a valid email").not().isEmpty(),
    check("password","Password is required").exists(),

],
async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const  {registrationNumber,password} = req.body;
    try{
        //see if user exist
        let user = await facultyModel.findOne({registrationNumber});
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
                id: user.id,
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
//mark attendance
router.post('/addAttendance',auth,[
    check("dates","Date is required").not().isEmpty(),
    check("ins","Mention u are present or absent").not().isEmpty()
],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const{dates,ins}=req.body;
        const faculty = req.user.id;
        //console.log(dates.toDateString());
        try{
            let user = await attendanceModel.find({dates}).populate("faculty");
            console.log(user);
            let result = user.filter(item=>item.faculty._id.toString()===faculty);
           
            if(result.length>0)
               return res.send("Already there");
            else
            {
                newuser= new attendanceModel({
                   faculty,dates,ins
                })
               let x= await newuser.save();
                return res.send(x);
            }
            
        }
        catch(err){
                    res.send('Error' + err);
        }
    }
)
// router.post("/addAttendance",async(req,res)=>{
//     const errors = validationResult(req);
//         if(!errors.isEmpty()){
//             return res.status(400).json({errors:errors.array()})
//         }
//     const user = new attendanceModel(
//         req.body
//     )
//     try{
//        const newAtt = await user.save();
//        res.send(newAtt);
//     }catch(err){
//         res.send('Error' + err);
//     }
// });


//get all subjects
router.post('/getSubjects',async(req,res)=>{
    try {
        const allSubjects = await subjectModel.find({})
        if (!allSubjects) {
            return res.status(404).json({ message: "You havent registered any subject yet." })
        }
        res.status(200).json({ allSubjects })
    }
    catch (err) {
        res.status(400).json({ message: `error in getting all Subjects", ${err.message}` })
    }
});

router.get('/getSubjects',async(req,res)=>{
    try {
        const allSubjects = await subjectModel.find({})
        if (!allSubjects) {
            return res.status(404).json({ message: "You havent registered any subject yet." })
        }
        res.status(200).json({ allSubjects })
    }
    catch (err) {
        res.status(400).json({ message: `error in getting all Subjects", ${err.message}` })
    }
});


router.post('/create',[
    check("name","Name is required").not().isEmpty(),
    check("email","Please mention your email").isEmail(),
    check("password","Please enter password with 6 or more").isLength({min:6}),
    check("registrationNumber","Please enter your department").not().isEmpty(),
    check("gender","Please enter your Gender").not().isEmpty(),
    check("designation","Please enter your Address").not().isEmpty(),
    check("department","Please enter subject").not().isEmpty(),
    check("facultyMobileNumber","Please enter subject").not().isEmpty(),
    check("dob","Please enter subject").not().isEmpty(),
    check("joiningYear","Please enter subject").not().isEmpty(),
    check("subjectsCanTeach","Please enter subject").not().isEmpty()




],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const  {name,email,password,registrationNumber,gender,designation,department,facultyMobileNumber,dob,joiningYear,subjectsCanTeach} = req.body;
        try{
            //see if user exist
            let user = await facultyModel.findOne({email});
            if(user){
                res.send(400).json({errors:[{msg:"User already exist"}]})
            }
            user = new staffModel({
                name,
                email,
                password,
                registrationNumber,
                gender,
                designation,
                department,
                facultyMobileNumber,
                dob,
                joiningYear,
                subjectsCanTeach
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
);

//Load user
router.get("/dummy/det",auth,async(req,res)=>{
    console.log(req.body);
    try{
        const user = await facultyModel.findById(req.user.id).select("-password");
        res.json(user);
    }catch(err){
            console.error(err.message);
            res.status(500).send("Internal Server error");
        }
});


//get attendance
router.get('/getAttendance',auth,async(req,res)=>{
    let x = req.user.id;
    try {
        const allSubjects = await attendanceModel.find({x});
        res.json(allSubjects);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server error");
    }
})

router.get("/show",auth,async(req,res)=>{
    console.log(req.user.id);
    let x=req.user.id;
    try{
        const user = await attendanceModel.find({faculty:x});
        res.json(user)
    }catch(err){
            console.error(err.message);
            res.status(500).send("Internal Server error");
        }
});


module.exports = router;