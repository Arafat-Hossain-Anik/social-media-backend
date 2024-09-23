const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel');
const checkUser = require('../middleware/checkUser');


//password validation function
function validatePassword(password) {
    function isValidPassword(password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])[^\s]{8,}$/.test(password);
    }
    if (!(isValidPassword(password))) {
        return res.status(400).json({ message: "Invalid password format. Password must be at least 8 characters long and contain at least one capital letter, one special character, and one number." });
    }
    return true
}
//cookie option 
const cookieOption = {
    httpOnly: true,
    sameSite: process.env?.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env?.NODE_ENV === "production" ? true : false
};
// sing up
router.post('/signup', async (req, res) => {
    try {
        const { userName, email, password, retypedPassword } = req.body;
        if (!(userName && email && password)) {
            return res.status(400).jsosn({ message: "All fields are required" });
        }
        if (password != retypedPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }
        //user already exit or not
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }
        //Password validation
        if (validatePassword(password)) {
            const hashPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({ userName, email, password: hashPassword })
            res.status(200).json({ message: "User Registerd Successfully" })
        }
    } catch (error) {
        console.log(error);
        res.json({ error: "Registration Failed" })
    }
})

// login in
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({ message: "Give Email and Password" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Register First" })
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                user.password = undefined
                const token = jwt.sign(
                    { user },
                    process.env.JWT_SECRET
                )
                user.token = token
                res.status(200).cookie("token", `bearer ${token}`, cookieOption).json({ message: "Login Successful", user })
            }
            else {
                res.status(401).json({ message: "Invalid Password" })
            }
        }
    } catch (error) {
        res.status(401).json({ error: "Login Failed. Try Again" })
    }

})
// logout
router.get('/logout', checkUser, (req, res) => {
    console.log("logout api hitted");
    res.clearCookie('token', cookieOption);
    res.json({ message: 'Logged out successfully' });
});
module.exports = router