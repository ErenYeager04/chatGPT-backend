const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
var express = require('express');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'})
}

// login user
const loginUser = async (req,res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)
    
    // create a token 
    const token = createToken(user._id) 
    
    res.status(200).json({email, token })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
  
 
}

// signup user
const signupUser = async (req,res) => {
  const { email, password } = req.body
  
  try {
    const user = await User.signup(email, password)

    // create a token 
    const token = createToken(user._id) 

    // link to confirm email
    const url = `${process.env.BACKEND}/api/user/confirm/${token}`

    // sending a verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })
    // mail model
    const mailOptions = {
      from: 'DO NOT REPLY',
      to: email,
      subject: 'Please confirm your email',
      text: `Please click this link to confirm your email: ${url}`
    }
    // sending confirmation email
    transporter.sendMail(mailOptions, err => { throw Error(err)})
    
    res.status(200).json({email, token })
  } catch (error) {
    res.status(400).json({error: error.message})
  }

  
}

// confirm email
const emailConfirm = async (req, res) => {
  try {
    const {_id} = jwt.verify(req.params.token, process.env.SECRET)
    await User.findByIdAndUpdate({_id: _id}, { verified: true})
  
  } catch (error) {
    res.status(400).json({error: error.message})
  }

   return res.redirect(`${process.env.FRONTEND}/login`)
}

module.exports = { loginUser, signupUser, emailConfirm }