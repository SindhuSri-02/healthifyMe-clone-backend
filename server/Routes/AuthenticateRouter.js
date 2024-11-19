const express = require('express')
const router = express.Router()
const {loginController,registerController} = require('../Controllers/AuthenticateController') 

router.post('/register',registerController)
router.post('/login',loginController)

module.exports = router