const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//Register a user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    if (email.split("@")[1] !== "sot.pdpu.ac.in") {
        return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (email.split("@").length != 2 || email.split(".").length != 5 || email.split(" ").length != 1 || email.split("+").length != 1 || email.split("-").length != 1 || email.split("_").length != 1) {
        // email should be of format name.xabcyy@sot.pdpu.ac.in  .=4, @=1, _=0, +=0, -=0, space=0
        return res.status(400).json({ message: "Please enter a valid email" });
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(409).send("User already exists! Please proceed to login")
    }
    const encPass = await bcrypt.hash(password, 10);
    const user = User.create({
        name,
        email,
        username: email.split("@")[0],
        password: encPass
    }, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Something went wrong" });
        }
        return res.sendStatus(200);
    });
}

//Login a user;  see if first get request can come
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ "err": "User not found" });
    }
    if (bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email, password: user.password }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        res.cookie('token', token, {
            maxAge: 1000*60*60*24,
            signed: true,
        })
        return res.sendStatus(200);
    }
    else {
        return res.status(401).json({ "err": "Email or Password Incorrect" });
    }
}

exports.logOutUser = async (req, res) => {
    if(req.signedCookies["token"]) res.clearCookie("token");
    return res.sendStatus(200);
}