const express = require('express')
const cloudinary = require('cloudinary').v2
const User = require('../models/User')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

exports.uploadResume = async(req,res) => {
    const id = req.params.id 

    const resume = req.files.resume

    const user = User.findById(id)

    const response = await cloudinary.uploader.upload(resume.tempFilePath,{
        public_id: user.rollNo,
        folder: 'resumes'
    })

    const data = await User.findByIdAndUpdate(id, {
        resume:{
            id: response.public_id,
            public_id: response.public_id,
            secure_url: response.secure_url
        }
    })

    res.status(200).json(data)
}

exports.uploadCv = async(req,res) => {
    const id = req.params.id 

    console.log(req.files);
    const cv = req.files.cv

    // const user = User.findById(id)

    const response = await cloudinary.uploader.upload(cv.tempFilePath,{
        folder: 'cv'
    })

    const data = await User.findByIdAndUpdate(id, {
        cv:{
            id: response.public_id,
            public_id: response.public_id,
            secure_url: response.secure_url
        }
    })

    res.status(200).json(data)
}

exports.uploadProfilePhoto = async(req,res) => {
    try {
        const id = req.params.id 
        console.log(req.files);
        const profile = req.files.profile 

        const response = await cloudinary.uploader.upload(profile.tempFilePath,{
            folder: 'profiles'
        })

        const data = await User.findByIdAndUpdate(id,{
            profilePhoto:{
                public_id: response.public_id,
                secure_url: response.secure_url
            }
        },{new:true})

        res.status(200).json(data)

    } catch (error) {
        console.error(error);
    }
}