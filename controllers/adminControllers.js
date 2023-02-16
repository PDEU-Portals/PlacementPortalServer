const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs");

exports.registerRecruiter = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const data = Recruiter.findOne({ email });
        if (data) {
            return res.status(409).json({ message: "User already exists" });
        }
        const encryptedPass = bcrypt.hash(password, 10);
        await Recruiter.create({
            name,
            email,
            password: encryptedPass
        });
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Something went wrong" });
    }
};
