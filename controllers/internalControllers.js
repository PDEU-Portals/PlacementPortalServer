const jwt = require('jsonwebtoken');

function isLoggedIn(req, res) {
    // console.log(req.signedCookies["token"])  // This is to check whether the cookie is being sent or not
    try {
        if (req.signedCookies["token"] && jwt.verify(req.signedCookies["token"], process.env.JWT_SECRET)) return res.json({ isLoggedIn: true });
        return res.clearCookie("token").json({ isLoggedIn: false});
    } catch (err) {
        return res.clearCookie("token").json({ isLoggedIn: false});
    }
}

module.exports = { isLoggedIn };