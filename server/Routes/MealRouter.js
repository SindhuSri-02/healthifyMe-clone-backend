const express = require('express')
const router = express.Router()
const {getAllMeals, getAMeal, createAMeal, deleteAMeal} = require('../Controllers/MealsController')

router.route('/').get(getAllMeals).post(createAMeal)
router.route('/:meal').get(getAMeal).delete(deleteAMeal)

module.exports = router