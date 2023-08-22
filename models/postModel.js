const mongoose = require("mongoose")

const postSchema =  mongoose.Schema({

    title : {
        type : String,
        required : true
    },
    slug : {
        type : String,
        required : true
    },
    image:{
        type : String,
        default: ''
    },
    content:{
        type : String,
        required : true
    },
    comments:{
        type : Object,
        default: {}
    },
    status: {
        type: String,
        enum : ['1','0'],
        default: '1'
     }
})

module.exports = mongoose.model('posts',postSchema)