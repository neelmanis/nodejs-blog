const Post = require('../models/postModel')

const { MongoClient, ObjectId } = require('mongodb');
const comment_id = new ObjectId();
const reply_id = new ObjectId();

//console.log("===>"+reply_id);

const loadBlog = async(req,res)=>{
    try {
        const posts = await Post.find({})
        res.render('blog',{posts:posts})
    } catch (error) {
        console.log(error.message)
    }
}

const loadPost = async(req,res)=>{
    try {
        const post = await Post.findOne({ "slug" :req.params.slug})
        res.render('post',{post:post})
    } catch (error) {
        console.log(error.message)
    }
}

const addComment = async(req,res)=>{
    try {
        const post_id = req.body.post_id
        const username = req.body.username
        const email = req.body.email
        const comment = req.body.comment

        const comments = await Post.findByIdAndUpdate({ _id:post_id },{
            $push:{
                "comments":{ _id:comment_id, username: username, email:email, comment : comment } 
            }
        })
       // console.log(comments);
        res.status(200).send({ success:true,msg:'comment added' })
    } catch (error) {
        res.status(200).send({ success:false,msg:error.message })
    }
}

const doReply = async(req,res)=>{
    try {
       // console.log("User name = "+reply_id+", password is "+req.body.name+", password is "+req.body.reply);
        const commentsReply = {
            "_id" : new ObjectId(req.body.post_id),
            "comments._id" : new ObjectId(req.body.comment_id)
        };
        
        const updateOperation = {
            $push : {
               // "replies":{ _id:reply_id, name:req.body.name, reply : req.body.reply }
               "comments.$.replies": { _id: reply_id, name: req.body.name, reply: req.body.reply }
            }
        };

        Post.updateOne(commentsReply, updateOperation)
        .then((result) => {
          //  console.log('Update successful', result);
        })
        .catch((error) => {
           // console.error('Error updating document:', error);
        });

       //  console.log(commentsReply);
        res.status(200).send({ success:true,msg:'Reply Added!' })
    } catch (error) {
        res.status(200).send({ success:false,msg:error.message })
    }
}

module.exports = {
    loadBlog,
    loadPost,
    addComment,
    doReply
}