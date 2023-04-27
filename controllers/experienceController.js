const User = require('../models/User')
const Experience = require('../models/experience')

exports.getExperiences = async(req,res) => {
    try {
        console.log('hit')
        const data = await Experience.find({})
        console.log(data);
        const user = await User.findById()
        res.status(200).json(data)

    } catch (error) {
        console.log(error)
    }
}

exports.addExperience = async(req,res) => {
    try {
        
        const {id,title, description} = req.body 

        const data = await Experience.create({
            id,
            title,
            description,
        })

        res.status(200).json(data)

    } catch (error) {
        console.log(error)
    }
}