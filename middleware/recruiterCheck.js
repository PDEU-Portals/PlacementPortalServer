const Recruiter = require('../models/recruiter');
const jwt = require('jsonwebtoken')


const recruiterCheck = async (req, res, next) => {
    const token = await req.signedCookies['token'];
    console.log(token)
    if (token) {
        jwt.verify(token, process.env.JWT_RECRUITER_SECRET, (err, decoded) => {
            if (err) {
                // console.log(err)
                res.clearCookie('token');
                res.status(401).send(err);
            }
            else {
                Recruiter.findById(decoded.id, (err, recruiter) => {
                    if (err) return res.status(500).json({ message: "Something went wrong" });
                    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
                    if (recruiter.isCurrentRecruiter === false) return res.status(401).json({ message: "You account is disabled, Contact Admin to enable your Account" });
                    req.body.id = decoded.id;
                    next();
                });
            }
        });
    }
    else res.status(401).json({ message: "Kindly Login Again" });
}

module.exports = { recruiterCheck };