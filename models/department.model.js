const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
    deptName : {type:String,required:true}
});

module.exports = mongoose.model('Department',departmentSchema);