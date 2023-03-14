
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.loginSuperAdmin = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: 'Please enter all fields'
        });
    }
    try{
        const superAdmin = SuperAdmin.findAll({email});
        if(!superAdmin){
            return res.status(404).json({
                message: 'Admin not found'
            });
        }
        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        const token = jwt.sign({id: superAdmin._id}, process.env.JWT_SUPERADMIN_SECRET);
        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * 24,
            signed: true
        });
        return res.status(200).json({
            message: 'Login Successful'
        });
    }catch(err){
        return res.status(500).json({message: "Something went Wrong"});
    }
}

exports.registerSuperAdmin = async(req,res) => {
    const{email,password} = req.body 
    try{
        const superAdmin = await SuperAdmin.create({
            email,
            password
        });
        // if(!superAdmin){
        //     return res.status(404).json({
        //         message: 'Admin not found'
        //     });
        // }
        // const isMatch = await bcrypt.compare(password, superAdmin.password);
        // if(!isMatch){
        //     return res.status(400).json({
        //         message: 'Invalid credentials'
        //     });
        // }
        const token = jwt.sign({id: superAdmin._id}, process.env.JWT_SUPERADMIN_SECRET);
        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * 24,
            signed: true
        });
        return res.status(200).json({
            message: 'Login Successful',
            token,
            superAdmin
        });
    }catch(err){
        return res.status(500).json({message: "Something went Wrong", err: err.message});
    }
}

exports.logOutSuperAdmin = async (req, res) => {
    if (req.signedCookies["token"]) res.clearCookie("token");
    return res.sendStatus(200);
}
exports.addAdmin = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please enter all fields'
            });
        }
        const encryptedPass = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            name,
            email,
            password: encryptedPass
        });
        return res.status(200).json({
            message: `Admin ${admin.name} added successfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
};

exports.deleteAdmin = async (req, res) => {
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                message: 'Please enter all fields'
            });
        }
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(404).json({
                message: 'Admin not found'
            });
        }
        await admin.remove();
        return res.status(200).json({
            message: `Admin ${admin.name} deleted successfully`
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
}

exports.getAdmins = async (req, res) => {
    try{
        const admins = await Admin.find();
        if(!admins){
            return res.status(404).json({
                message: 'No Admins found'
            });
        }
        return res.status(200).json({
            admins
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
}