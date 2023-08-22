const user = require('../models/userModel')
const bcrypt = require('bcrypt')

const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await user.findOne({email:email})
        if(userData){
           // console.log(userData)
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                req.session.user_id = userData._id
                req.session.is_admin = userData.is_admin
                if(userData.is_admin == 1){
                    res.redirect('/dashboard')
                } else {
                    res.redirect('/profile')
                }
            } else {

            }

        } else {
            res.render('login',{message : "Email and Password is incorrect"})
        }

    } catch (error) {
        console.log(error.message)
    }
}

const profile = async(req,res)=>{
    try {
        res.render('Profile Page here')
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async(req,res)=>{
    try {
       req.session.destroy()
       res.redirect('/login')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    profile,
    logout
}