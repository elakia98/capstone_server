const mongoose = require('mongoose')

const staffSchema = new mongoose.Schema({
    staffName : {type:String,required:true},
    dept:{type:String,required:true},
    gender : {type:String,required:true},
    contactAddress:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    subject:{type:String,required:true},
    studentId:[{type:mongoose.SchemaTypes.ObjectId,ref:"Students"}]
});

module.exports = mongoose.model('Staff',staffSchema);