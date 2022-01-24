const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const url = 'mongodb+srv://user:<password>@cluster0.h9rkp.mongodb.net/attendance?retryWrites=true&w=majority';

const studentRoutes = require('./routes/students.routes')
const staffRoutes = require('./routes/staff.routes')
const deptRoutes = require('./routes/department.routes')
const adminRoutes = require('./routes/admin.routes')
const facultyRoutes = require('./routes/faculty.routes')
//const attendanceRoutes = require('./routes/attendance.routes');

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
app.use(cors());
app.use('/students',studentRoutes);
app.use('/staff',staffRoutes);
app.use('/department',deptRoutes);
app.use('/admin',adminRoutes);
app.use('/faculty',facultyRoutes);
//app.use('/attendance',attendanceRoutes);


// Serve static assets in production
if (process.env.NODE_ENV === "production") {
	// Set Static Folder
	app.use(express.static("mern-auth/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "mern-auth", "build", "index.html"));
	});
}

app.listen(process.env.PORT || 5000,function(){
    console.log('Server started');
})
