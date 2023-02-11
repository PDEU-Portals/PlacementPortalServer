const jwt = require('jsonwebtoken');

function authenticateToken(req,res,next){
    if(req.signedCookies['token']){
        const token = req.signedCookies['token'];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.clearCookie('token');
                res.sendStatus(401);
            }
            else {
                req.body.email = decoded.email;
                req.body.id = decoded.id;
                next();
            }
        });
    }
    else res.sendStatus(401);
}

module.exports = {authenticateToken};