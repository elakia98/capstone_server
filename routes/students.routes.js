const express = require('express')
const router = express.Router();
const studentModel = require('../models/students.models')

router.get('/',async(req,res)=>{
    try{
        const students = await studentModel.find();
        res.json(students)
    }catch(err){
        console.log('Error' + err);
    }
   
});

router.get('/:id',async(req,res)=>{
    try{
        const student = await studentModel.findById(req.params.id);
        res.json(student)
    }catch(err){
        console.log('Error' + err);
    }
   
});

router.post('/create',async(req,res)=>{
    const students = new studentModel({
       // studentId : req.body.studentId,
        firstName : req.body.firstName,
        lastName  : req.body.lastName,
        gender    : req.body.gender,
        age       :req.body.age,
        contactAddress : req.body.contactAddress,
        dept : req.body.dept,
        subject:req.body.subject
    });
    try{
        const newStudent = await students.save();
        res.send(newStudent);
    }catch(err){
        res.send('Error' + err);
    }
});

router.put('/edit/:id',async(req,res)=>{
    try{
        await studentModel.findOneAndUpdate({_id:req.params.id},req.body).then(function(student){
            studentModel.findOne({_id:req.params.id}).then(function(student){
                res.send(student);
            });
        });
    }catch(err){
        res.send('Error' + err);
    }
   
});

router.delete('/:id',async(req,res)=>{
    try{
        studentModel.findOneAndDelete({_id:req.params.id}).then(function(student){
            res.send(student);
        })
    }catch(err){
        res.send('Error' +  err);
    }
})

module.exports = router;