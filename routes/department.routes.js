const express = require('express')
const router = express.Router();


const deptModel = require('../models/department.model');

router.get('/',async(req,res)=>{
    try{
        const dept = await deptModel.find();
        res.json(dept);
    }catch(err){
        console.log('Error' + err);
    }
   
});

router.post('/create',async(req,res)=>{
    const dept = new deptModel({
        deptName : req.body.deptName
    });
    try{
        const newdept = await dept.save();
        res.send(newdept);
    }catch(err){
        console.log('Error' + err);
    }
});

module.exports = router;