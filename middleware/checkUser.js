const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
    try {
        const cookies = req.cookies;
        const token = cookies.token.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decoded", decoded);
        const user = decoded.user
        req.user = user
        next()
    } catch (error) {
        res.status(401).send("You are Unathorized")
        next(error)
    }
}
module.exports = checkUser