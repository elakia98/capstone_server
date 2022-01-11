const mongoose = require('mongoose')

const studentsSchema = new mongoose.Schema({
    //studentID       : {type:Number, required:true},
    firstName       : {type:String, required:true, minlength:5},
    lastName        : {type:String, required:true, minlength:5},
    gender          : {type:String, required:true},
    age             : {type:Number, required:true},
    contactAddress   : {type:String, required:true},
    dept:{type:String,required:true},
    subject:[{type:String,required:true}]
});

module.exports = mongoose.model('Students',studentsSchema);