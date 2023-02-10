const jwt = require('jsonwebtoken');

function authenticateSession(req,res,next){
    if(req.session.token){
        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET)
        if(decoded){
            req.data = decoded;
            next();
        }
        else{
            res.session.destroy();
            return res.sendStatus(401).redirect('/login');
        }
    }
    else {
        return res.status(401).redirect('/login');
    }
}

function loginAuth(req,res,next){
    if(req.session.token){
        res.redirect('/');
    }
    else next();
}

module.exports = {authenticateSession, loginAuth};