const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sendMail = require('../utils/mail/mail')

class AuthController {
    async register(req, res) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
            const isExist = await User.findOne({ email: req.body.email });
            if (isExist) {
                res.json({ message: 'Email Already Exist', "success": false, })
                return;
            }
            const user = await User.create({...req.body , ip });
            const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60d' })
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
            sendMail(req.body.email, 'Account Created' ,'Thankyou For Joining LeadTanks.\n YourAccount Was Created. Your Ip : '+ip);
            res
                .status(201)
                .json({ message: "User signed in successfully", success: true, user });
        } catch (error) {
            res.status(201).json({ message: error.message, "success": false, })
        }
    }
    async signin(req, res) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
            const { email, password } = req.body;
            if (!email || !password) {
                return res.json({ message: 'All fields are required' })
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.json({ message: 'Incorrect password or email' })
            }
            const auth = await bcrypt.compare(password, user.password)
            if (!auth) {
                return res.json({ message: 'Incorrect password or email' })
            }
            const token = jwt.sign({ id : user._id} , process.env.JWT_SECRET , { expiresIn : '60d'})
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
            sendMail(req.body.email, 'Account Signin Success | LeadTanks' ,'Your Account Was LoggedIn From Ip : '+ip);
            res.status(201).json({ message: "User logged in successfully", success: true , user });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new AuthController();