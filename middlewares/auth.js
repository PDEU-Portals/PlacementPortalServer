const jwt = require('jsonwebtoken')

exports.auth = (req,res,next) => {
    const token = req.header('Authorization').replace('Bearer ', '') || req.cookies.token || req.body.token

    if(!token){
        return res.status(403).send('Token is missing')
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
    } catch (error) {
        res.status(401).send("Invalid token")
    }

    return next()
}
