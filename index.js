const mongoose = require('mongoose');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bms', {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
})
  .then(() => {
    console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

    // Require static assets from public folder 
    app.use(express.static(path.join(__dirname,'public')))
     // Require blog image 
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/public', express.static(path.join(__dirname, 'public')));

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended : true}))

    app.use(cookieParser())
    app.use(express.urlencoded({ extended: true })); 
    app.use(express.json());

    app.set('view engine','ejs')
    app.set('views','./views')

    const isBlog = require("./middlewares/isBlog")
    app.use(isBlog.isBlog)

    // For Admin Routes
    const admin_route = require('./routes/adminRoute')
    app.use('/',admin_route)

    // For user Routes
    const user_route = require('./routes/userRoute')
    app.use('/',user_route)

    // For blog Routes
    const blog_route = require('./routes/blogRoute')
    app.use('/',blog_route)

    global.nodeSiteUrl = 'http://localhost:3000/'; // node

    app.listen(3000, function(){
        //console.log("server is running")
        console.log(`server is listening on development url ${nodeSiteUrl}`)
    })