const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    Add link to database in .env file after doing necessary stuff wrt MongoDB
    
    ------------------------------------------------------------------------------------

    
    As listed in the image sent in wp group, am defining the Schema as follows:
    
    Parameter   --->    Data Type defined in schema     --->     Reason

*/
const userSchema = new Schema({

});

const User = mongoose.model('users', userSchema);

module.exports = User;