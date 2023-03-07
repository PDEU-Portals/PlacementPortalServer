const Experience = require('../models/experience')

exports.addExperience = async(req,res) => {
    try {
        const id = req.params.id

        const {title, description} = req.body

        const data = await Experience.create({
            title,
            description
        })

        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}

exports.getExperience = async(req,res) => {
    try {
        const data = await Experience.find({}).sort({createdAt: -1})
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}