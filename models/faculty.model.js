const mongoose = require('mongoose')
const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
    },
    registrationNumber: {
        type: String,
    },
    gender: {
        type: String,
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String, 
        required: true
    },
    facultyMobileNumber: {
        type: Number
    },
    dob: {
        type: String,
        required: true
    },
    joiningYear: {
        type: Number,
        required: true 
    },
    subjectsCanTeach: [{
        type: String
    }],
});
module.exports = mongoose.model('Faculty',facultySchema);