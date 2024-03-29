const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');
const path = require('path');


// connect to DB
 //   mongoose
   //     .connect('mongodb://localhost:27017/socialmediaapp' , { useNewUrlParser: true, useUnifiedTopology: true })
     //   .then( () => { console.log("Database connected successfully...")})
       // .catch( err => console.log("Database connection error..."));

const CONNECTION_STRING = 'mongodb+srv://admin:Alpha1234@cluster0.eegjx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log('MongoDB Database up and running!...')
})
.catch((err)=>{
    console.log(err)
})

// app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json());   // appliction/json

// make images folder static available in root
app.use('/images' , express.static( path.join(__dirname,'images')));

// Access-Control-Allow
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
      );
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
});

// API ROTUES
app.use('/api/auth' , authRoutes);
app.use('/api/posts' , postRoutes);
app.use('/api/comments' , commentRoutes);
app.use('/api/users' , userRoutes);

// ERROR HANDLING MIDDLEWARE
app.use( (error,req,res,next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data || undefined ;
    res.status(status).json({message: message , data: data});
});


// listening to port
const port =  3000;
const server = app.listen(port, () => console.log(`listening to port ${port}`));
require('./util/socket-io').init(server);
