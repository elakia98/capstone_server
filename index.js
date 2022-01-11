const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/AttendanceDb';

const studentRoutes = require('./routes/students.routes')
const staffRoutes = require('./routes/staff.routes')
const deptRoutes = require('./routes/department.routes')

const app = express();
mongoose.connect(url,{useNewUrlParser:true}) //newUrlParser = might give warning or some deprecated
const con = mongoose.connection; //connect to db

con.on('open',function(){
    console.log("connected");
});
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

app.use('/students',studentRoutes);
app.use('/staff',staffRoutes);
app.use('/department',deptRoutes);


app.listen(process.env.PORT || 3000,function(){
    console.log('Server started');
})