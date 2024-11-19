const express = require('express')
const router = express.Router()
const {getProducts} = require('../Controllers/ProductsController') 
const {ensureAuthenticated} = require('../Controllers/AuthenticateController')

router.get('/',ensureAuthenticated,getProducts)

module.exports = router