const Recruiter = require('../models/recruiterModel');

const recruiterCheck = async (req, res, next) => {
    Recruiter.findById(id, (err, recruiter) => {
        if (err) return res.status(500).json
        if (req.signedCookies['token']) {
            const token = req.signedCookies['token'];
            jwt.verify(token, process.env.JWT_RECRUITER_SECRET, (err, decoded) => {
                if (err) {
                    res.clearCookie('token');
                    res.sendStatus(401);
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
        else res.sendStatus(401).json({ message: "Kindly Login Again" });
    });
}

module.exports = { recruiterCheck };