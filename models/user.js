const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/*
    Add link to database in .env file after doing necessary stuff wrt MongoDB
    
    ------------------------------------------------------------------------------------

    
    As listed in the image sent in wp group, am defining the Schema as follows:
    
    Parameter   --->    Data Type defined in schema     --->     Reason
    Name                    String                               Because it's an individual's name
    RollNo                  String                               Based on our Roll Numbers
    DOB                     String                               To give flexibility to users
    Skills                  array of strings                     I guess it would be better to have skills in the form of array of strings as it would make insertion and deletion easier
    Projects                array of strings                     I guess it would be better to have projects in the form of array of strings as it would make insertion and deletion easier       
    CGPA                    Number                               Because cgpa can be of float, double or int, but can't have alphabets in it
    work experience         Number                               Because work experience can be of half a year, or of 2.5 years and so on
    publications            array of strings                     Because we can add links to multiple publications
    contacts                defined as shown in Schema           For convenience              
*/

const userSchema = new Schema({
    userName: {
        type: String,
        // required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        // required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        // required: [true, 'Please enter your password'],
    },
    rollNo: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    skills: {
        type: [String],
    },
    projects: {
        type: [String],
    },
    cgpa: {
        type: String,
    },
    workExperience: {
        role: String,
        description: String
    },
    publications: {
        type: [String],
    },
    phoneNumber: String,
    socialMediaHandles: {
        type: [String],
    } 
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

//Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('users', userSchema);

module.exports = User;