const express = require("express")
const blog_route = express()

const blogController = require('../controllers/blogController')

blog_route.get('/', blogController.loadBlog)
blog_route.get('/post/:slug', blogController.loadPost)
blog_route.post('/add-comment', blogController.addComment)
blog_route.post('/do-reply', blogController.doReply)


module.exports = blog_route
