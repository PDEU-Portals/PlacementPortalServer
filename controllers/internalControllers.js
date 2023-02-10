const jwt = require('jsonwebtoken');

function isLoggedIn(req, res) {
    try {
        if (req.signedCookies["token"] && jwt.verify(req.signedCookies["token"], process.env.JWT_SECRET)) return res.json({ isLoggedIn: true });
        return res.clearCookie("token").json({ isLoggedIn: false});
    } catch (err) {
        return res.clearCookie("token").json({ isLoggedIn: false});
    }
}

module.exports = { isLoggedIn };