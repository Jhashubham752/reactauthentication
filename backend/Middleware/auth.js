const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified.id;
        next();
    } catch (err) {
        console.log(err)
    }
   
}

module.exports = authentication; 