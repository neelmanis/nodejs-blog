const BlogSetting = require('../models/blogSettingModel')
const User  =  require('../models/userModel')
const Post = require('../models/postModel')
const bcrypt = require('bcrypt')

const securePassword = async(password)=>{
    try {
       const passwordHash = await bcrypt.hash(password,10)
       return passwordHash        
    } catch (error) {
        console.log(error.message)
    }
}

const blogSetup = async(req,res)=>{
    
    try {
        const blogSetting = BlogSetting.find({})
        if(blogSetting > 0) {
            res.redirect('/login')
        } else {
            res.render('blogsetup')
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

const blogSetupSave = async(req,res)=> {
    try {
     //   console.log(req.body)
    const blog_title = req.body.blog_title
    const blog_image = req.file.filename
    const description = req.body.description
    const email = req.body.email
    const name = req.body.name
    //console.log(req.body.password)
    const password = await securePassword(req.body.password)
   
    const blogSetting = new BlogSetting({
        blog_title:blog_title,
        blog_logo:blog_image,
        description:description
    })
    await blogSetting.save();

    const user = new User({
        name :name,
        email:email,
        password:password,
        is_admin:1
    })
    const userData = await user.save()
    if(userData){
        res.redirect('/login')
    } else {
        res.redirect('blogSetup',{message : 'blog not setup'})
    }
        
    } catch (error) {
        console.log(error.message)
    }
}

const dashboard = async(req,res)=>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

const loadPostDashboard = async(req,res)=>{
    try {
        res.render('admin/postDashboard',{
            pageTitle: "Create Post",
        })
    } catch (error) {
        console.log(error.message)
    }
}

const addPost = async(req,res)=>{
//console.log(req.file)
    const titleToSlug = title => {
        let slug;   
        slug = title.toLowerCase();
    
        // remove special characters
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string
    
        // replace spaces with dash symbols
        slug = slug.replace(/ /gi, "-");
        
        // remove consecutive dash symbols 
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
    
        // remove the unwanted dash symbols at the beginning and the end of the slug
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        return slug;
      };
      
      const photo = req.file.filename
      //console.log(photo)
     /* let logoFileName, logoName, logoPath = '';
      if( photo && photo.length > 0 ){
        let {originalname, filename, path} = photo[0]
        path = path.replace(/\\/g, '/')
    
        logoFileName = originalname;
        logoName = filename;
        logoPath = path;
      } */

    try {
        const gettitle = req.body.title;
        const getslug = titleToSlug(gettitle);
        const post = new Post({
            title:gettitle,
            slug:getslug,
            image : photo,
            content:req.body.content
        })
        const postData = await post.save()
        res.render('admin/postDashboard',{message:'Post Added Successfully'})

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostDashboard,
    addPost
}