const  Recruiter = require('../models/Recruiter');
const sendToken = require('../utils/jwtToken');
const bcrypt = require('bcryptjs')

const NewRecruiter = async(req, res)=>{
    const {Company_Name, Description, Website, Jobs_Posted} =req.body;
    try{
    const new_Recruiter = await Recruiter.create({Company_Name, Description, Website, Jobs_Posted}, (err, results)=>{
        res.status(200).json(result);
        

    })
    res.status(200).json(new_Recruiter)
    }
    catch(err){
        res.status(401).send({err: "Cannot Register New Recruiter"})
    }
}

const getRecruiterId = (req,res)=>{
    const {Company_Name} = req.body;
    try{
        const recruiterId = await (Recruiter.findOne({CompanyName : Company_Name}))._id; //Can be used to parse in different queries for fetching apis
        return recruiterId;
    }
    catch{
        res.status(401).send({err: err.message});
    }

} 
const getRecruiter = async(req, res)=>{
    const {Company_Name} = req.body;
    try{
        const recruiter = await Recruiter.findOne({CompanyName : Company_Name}, (err, result)=>{
            res.status(200).json(result);
        });
        res.status(200).json(recruiter);
       return res.status(200).json(recruiterId);
    }
    catch(err){
        res.status(401).send({err: err.message})
        // res.status(400).send({err: "Cannot Find the Recruiter"})
    }
}

module.exports =  {NewRecruiter, getRecruiter, getRecruiterId};