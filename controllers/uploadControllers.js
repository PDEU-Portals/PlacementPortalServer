const express = require('express')
const cloudinary = require('cloudinary').v2
const User = require('../models/User')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

exports.uploadResume = async(req,res) => {
    const id = req.body.id 

    const resume = req.files.resume

    const user = User.findById(id)

    const response = await cloudinary.uploader.upload(resume.tempFilePath,{
        public_id: user.rollNo,
        folder: 'resumes'
    })

    const data = await User.findByIdAndUpdate(id, {
        resume:[{
            id: response.public_id,
            secure_url: response.secure_url
        }]
    })

   
    
    // user.resume = [
    //     {
    //         id: response.public_id,
    //         secure_url: response.secure_url,
    //         url: response.url
    //     }
    // ]

    res.status(200).json(data)
}