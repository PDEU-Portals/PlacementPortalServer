import User from '../models/user'
import  express  from 'express'
import mongoose from 'mongoose'


// When the user will click on the link generated, it will get redirected to the this function to get verified
const ValidateUser = async(req, res)=>{
    const{ email, username } = req.body;
    try{
        const verify = await User.UpdateOne({email, username}, {isVerified: true});
        res.status(200).send("User Verified");
        //Redirecting to the login after getting verified
        res.redirect(`http://localhost:3000/api/v1/users/login`);
    }
    catch(err){
        res.status(404).send("Error Occured while Verifying User");
        res.redirect(`http://localhost:3000/404`);
    }
}
module.exports = [ValidateUser];
