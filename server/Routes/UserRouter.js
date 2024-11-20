const express = require('express')
const router = express.Router()
const {addMealToUser,getAllUsers,getAUser,deleteAMeal} = require('../Controllers/userController')

router.route('/').get(getAllUsers)
router.route('/userProfile').get(getAUser)
router.route('/meal/:mealId').delete(deleteAMeal)
router.route('/:userId').get(getAUser)
router.route('/meal').post(addMealToUser)

module.exports = router