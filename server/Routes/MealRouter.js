const express = require('express')
const router = express.Router()
const {getAllMeals, getAMeal, deleteAMeal} = require('../Controllers/MealsController')

router.route('/').get(getAllMeals)
router.route('/:meal').get(getAMeal).delete(deleteAMeal)

module.exports = router