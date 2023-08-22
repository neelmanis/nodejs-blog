const express = require("express")
const admin_route = express()
const fs = require('fs')

const session = require('express-session')
const config = require('../config/config')
admin_route.use(session({
    secret:config.sessionSecret,
    resave : true,
    saveUninitialized:true
}))

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        console.log(req.body)
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename : function(req, file, cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name)
    }
})

/**
 *  File Upload for POST
 */
const storagePost = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null,path.join(__dirname,'../public/images/post'))
    },
    filename : function(req, file, cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name)
    }
  });
  
  /*
  const uploadPic = multer({
    storagePost: storagePost,
    fileFilter: (req, file, cb) => {
      if(file){
        if(
          !(
            file.mimetype == "image/png" || 
            file.mimetype == "image/jpg" || 
            file.mimetype == "image/jpeg"
          )
        ){
          cb(null,false);
          req.fileError = 'Only .png, .jpg and .jpeg format allowed!'
        }else{
          cb(null, true);  
        }
      }else{
        cb(null,false);
        req.fileError = 'file required'
      } 
    }
  }).fields([
    {name:"photo", maxCount:1},
  ]); */
/* End Post Image Upload */

const upload = multer({ storage:storage })
const uploadPost = multer({storage:storagePost})

const adminController = require("../controllers/adminController")
const adminLoginAuth = require('../middlewares/adminLoginAuth')

admin_route.get('/blog-setup', adminController.blogSetup)
admin_route.post('/blog-setup',upload.single('blog_image'), adminController.blogSetupSave)

admin_route.get('/dashboard', adminLoginAuth.isLogin,adminController.dashboard)
admin_route.get('/create-post', adminLoginAuth.isLogin,adminController.loadPostDashboard)
admin_route.post('/create-post', uploadPost.single('photo'), adminLoginAuth.isLogin,adminController.addPost)

module.exports = admin_route
