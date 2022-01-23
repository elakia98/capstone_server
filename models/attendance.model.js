const mongoose = require('mongoose')
const attendanceSchema = new mongoose.Schema({
    faculty: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Faculty'
    },
    dates:{type:Date,default:new Date().setHours(0,0,0,0)},
    ins:{type:String,required:true},
    
});
module.exports = mongoose.model('Attendance',attendanceSchema);