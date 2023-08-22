const express = require("express")
const user_route = express()

const session = require('express-session')
const config = require('../config/config')
user_route.use(session({
    secret:config.sessionSecret,
    resave : true,
    saveUninitialized:true
}))

const userController = require("../controllers/userController")
const adminLoginAuth = require('../middlewares/adminLoginAuth')

user_route.get('/login', adminLoginAuth.isLogout, userController.loadLogin)
user_route.post('/login', userController.verifyLogin)
user_route.get('/profile', userController.profile)

user_route.get('/logout', adminLoginAuth.isLogin, userController.logout)

module.exports = user_route
