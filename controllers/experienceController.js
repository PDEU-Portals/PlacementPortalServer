const Experience = require('../models/experience')

exports.getExperiences = async(req,res) => {
    try {
        console.log('hit')
        const data = await Experience.find({})
        res.status(200).json(data)

    } catch (error) {
        console.log(error)
    }
}

exports.addExperience = async(req,res) => {
    try {
        
        const {title, description} = req.body 

        const data = await Experience.create({
            title,
            description,
            // experience: req.user._id
        })

        res.status(200).json(data)

    } catch (error) {
        console.log(error)
    }
}