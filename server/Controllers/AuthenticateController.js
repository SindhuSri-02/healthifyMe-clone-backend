const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.loginController = async (req, res)=>{
    const {email,password} = req.body

    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: "no such user exists"})
    }

    const samePassword = await bcrypt.compare(password,user.password)
    if(!samePassword){
        return res.status(404).json({message: "wrong password"})
    }

    const jwtTocken = await jwt.sign({email,password},process.env.SECRET,{expiresIn: '24h'})

    return res.status(201).json({message: "logged in", success: true, jwtTocken, email, user: user.name})
}

exports.registerController = async (req, res)=>{
    try{
        const {name, email,password} = req.body
        const user = new User({
            name,
            email,
            password
        })
        user.password = await bcrypt.hash(password,10);
        await user.save();
        res.status(201).json({message: "registered user successfully", success: true});
    }catch(err){
        console.log(err)
        res.status(500).json({message: "failed to register user", success: false});
    }  
}

exports.ensureAuthenticated = (req,res,next)=>{
    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(404).json({message: "jwt token is required"})
    }
    try{
        const decoded = jwt.verify(auth, process.env.SECRET)
        req.user=decoded;
        next()
    } catch(err){
        return res.status(404).json({message: "wrong token", err})
    }
}