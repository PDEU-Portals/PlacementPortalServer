const superAdmin = require('../models/superAdmin');
const jwt = require('jsonwebtoken');

exports.loginSuperAdmin = async(req, res) => {
    const { email, password } = req.body;
    if (email === '' || password === '') {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    const admin = await superAdmin.findOne({ email: email });
    if (!admin) {
        return res.status(400).json({ message: 'Email or password is incorrect' });
    }
    const validPassword = await admin.comparePassword(password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Email or password is incorrect' });
    }
    const token = jwt.sign({ _id: admin._id }, process.env.SECRET_KEY);
    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        signed: true,
    });
}