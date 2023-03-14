const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter  title']
    },
    description:{
        type:String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Experience', experienceSchema)