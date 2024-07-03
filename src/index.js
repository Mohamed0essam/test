const express = require("express");
const connectDB = require('./DB/connect')
const mongoSanitize = require('express-mongo-sanitize')
require('dotenv').config()
//const vars = require('./config/vars');
//const mongoose = require('./config/mongoose');

const app = express();

// Express mongo sanitize
// app.use(mongoSanitize())

//routers
authnRouter = require('./api/routes/authn.routes')
userRouter  = require('./api/routes/user.routes')
groupRouter = require('./api/routes/groups.routes')
taskRouter = require('./api/routes/task.routes')
postRouter = require('./api/routes/post.routes')    
 

//middlewares


app.use(express.json());



app.get('/serverTest',(req,res)=>{res.send('hey, test')})

app.use('/api/v1/authn', authnRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/group', groupRouter)
app.use('/api/v1/task', taskRouter)
app.use('/api/v1/post', postRouter)

// Start the server , connect to database

const start = async ()=> {
    try {
       await connectDB(process.env.MONGO_URI)
       console.log(" connected to database");
        app.listen(3000, ()=> {console.log(" server is running!")});
    } catch(err) {
        console.error('Could not connect to database')
        console.log(err)
    }
}
start()

// Expose app
module.exports = app;
