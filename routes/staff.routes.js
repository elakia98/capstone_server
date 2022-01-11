const express = require('express')
const router = express.Router();

const staffModel = require('../models/staff.model');


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