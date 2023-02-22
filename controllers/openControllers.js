/*
This file contains controllers of data available to all profiles, i.e. open to all users.
*/

const express = require("express");
const User = require("../models/user");

// get all users
exports.getProfile = async (req, res) => {
    const username = req.params.username;
    User.findOne({username}, '-_id -password -__v',(err, user)=>{
        if(err) return res.status(500).json({message: "Internal server error"});
        if(!user) return res.status(404).json({message: "User not found"});
        console.log(Boolean(user.SGPA));
        if(user.SGPA) (user.CGPA = user.SGPA.reduce((total, currentValue) => total + currentValue, 0)/user.SGPA.length);
        user.SGPA = undefined;
        console.log(user);
        return res.status(200).json(user);
    });
    // if(!user) return res.status(404).json({message: "User not found"});
    // const data = {...user};
    // delete data.password;
    // if(data.SGPA) (data.CGPA = data.SGPA.reduce((total, currentValue) => total + currentValue, 0)/data.SGPA.length);
    // delete data.SGPA;
}