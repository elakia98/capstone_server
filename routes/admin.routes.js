const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs') //password hasing library
const jwt = require('jsonwebtoken') //for allowing authentication
const {check,validationResult} = require('express-validator')

const adminModel = require('../models/admin.model');
const facultyModel = require('../models/faculty.model');
const subjectModel = require('../models/subject.model');
const attendanceModel = require('../models/attendance.model');
const auth = require('../middleware/auth')

//start
var jwtSecret = "mysecrettoken"
//end
//create admin
router.post('/create',[
    check("name","Name is required").not().isEmpty(),
    check("email","Please mention your email").isEmail(),
    check("password","Please enter password with 6 or more").isLength({min:6}),
    check("registrationNumber","Please enter your registrationNumber").not().isEmpty(),
    check("department","Please enter your department").not().isEmpty(),
    check("dob","Please enter your dob in 01-01-2021").not().isEmpty(),
    check("joiningYear","Please enter joining year").not().isEmpty(),
    check("contactNumber","Please enter contact number").not().isEmpty()
],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const  {name,email,password,registrationNumber,department,dob,joiningYear,contactNumber} = req.body;
        try{
            //see if user exist
            let user = await adminModel.findOne({email});
            if(user){
                res.send(400).json({errors:[{msg:"User already exist"}]})
            }
            user = new adminModel({
                name,
                email,
                password,
                registrationNumber,
                department,
                dob,
                joiningYear,
                contactNumber
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

//login admin
router.post('/login',[
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
            let user = await adminModel.findOne({email});
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

router.get("/getAdmin",auth,async(req,res)=>{
    console.log(req.body);
    try{
        const user = await adminModel.findById(req.user.id).select("-password");
        res.json(user);
    }catch(err){
            console.error(err.message);
            res.status(500).send("Internal Server error");
        }
})

//create faculty
router.post('/createFaculty',[
    check("name","Name is required").not().isEmpty(),
    check("email","Please mention email").isEmail(),
    check("password","Please enter password with 6 or more").isLength({min:6}),
    check("registrationNumber","Please enter your registrationNumber").not().isEmpty(),
    check("gender","Mention your gender").not().isEmpty(),
    check("designation","Mention your designtion").not().isEmpty(),
    check("department","Mention department").not().isEmpty(),
    check("facultyMobileNumber","mention you number").not().isEmpty(),
    check("dob","Please enter your dob in 01-01-2021").not().isEmpty(),
    check("joiningYear","Please enter joining year").not().isEmpty(),
    check("subjectsCanTeach","Please mention subjects").not().isEmpty()
],
async(req,res)=>{
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    const{name,email,password,registrationNumber,gender,designation,department,facultyMobileNumber,dob,joiningYear,subjectsCanTeach}=req.body;
    try{
        let user = await facultyModel.findOne({email});
        if(user){
            res.send(400).json({errors:[{msg:"UserAlready exist"}]})
        }
        user = new facultyModel({
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
        })
        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        res.status(200).json({ result: user });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server error");
    }
}
);

//get all faculty
router.post('/getAllFaculty',auth,async(req,res)=>{
    try{
        const faculties = await facultyModel.find({})
            if (faculties.length === 0) {
                return res.status(404).json({ message: "No Record Found" })
            }
        res.status(200).json({ result: faculties })
    }catch(err){
        res.status(400).json({ message: `error in getting new Faculty", ${err.message}` })
    }
})

//get all faculty
router.get('/getAllFaculty',async(req,res)=>{
    try {
        const { department } = req.body;
        const allFaculties = await facultyModel.find({ department })
        res.status(200).json({ result: allFaculties })
    }
    catch (err) {
        console.log("Error in gettting all faculties", err.message)
    }
})


//add subject
router.post('/addSubject',[
    check("department","Enter department").not().isEmpty(),
    check("subjectCode","Enter subject code").not().isEmpty(),
    check("subjectName","Enter subject name").not().isEmpty(),
    check("year","Enter year").not().isEmpty(),
    check("totalLectures","Enter lectures").not().isEmpty(),
    

],
async(req,res)=>{
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    const{department,subjectCode,subjectName,year,totalLectures}=req.body;
    try{
        let user = await subjectModel.findOne({subjectCode});
        if(user){
            res.send(400).json({errors:[{msg:"Subject code exist"}]})
        }
        user= new subjectModel({
            totalLectures,
            department,
            subjectCode,
            subjectName,
            year
        })
        await user.save();
        res.status(200).json({ result: user });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server error");
    }

})


//get all subjects
router.get('/getAllSubjects',async(req,res)=>{
    try {   
        const allSubjects = await subjectModel.find({})
        if (!allSubjects) {
            return res.status(404).json({ message: "You havent registered any subject yet." })
        }
        res.status(200).json(allSubjects)
    }
    catch (err) {
        res.status(400).json({ message: `error in getting all Subjects", ${err.message}` })
    }
})

//get all subject
router.post('/getAllsubject',async(req,res)=>{
    try {
        const { department, year } = req.body;
        const allSubjects = await subjectModel.find({ department, year })
        res.status(200).json({ result: allSubjects })
    }
    catch (err) {
        console.log("Error in gettting all students", err.message)
    }
});


module.exports = router;