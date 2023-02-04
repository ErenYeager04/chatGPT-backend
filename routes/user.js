const express = require('express')

// controller functions
const { loginUser, signupUser, emailConfirm} = require('../controllers/userController')
const { getImage } = require('../controllers/aiController')


const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// chatGPT route
router.post('/getImageUrl', getImage)

// confirmation route
router.get('/confirm/:token', emailConfirm)

module.exports = router