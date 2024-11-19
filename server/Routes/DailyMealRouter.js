const express = require('express')
const router = express.Router()
const {addMeal,getAllMeals,deleteAMeal,getCalories,increaseQuantity,decreaseQuantity} = require('../Controllers/DailyMealController')

router.route('/date/:date/type/:type/meal/:mealId').delete(deleteAMeal)
router.route('/date/:date/type/:type/meal/:mealEntryId/inc').post(increaseQuantity)
router.route('/date/:date/type/:type/meal/:mealEntryId/dec').post(decreaseQuantity)
router.route('/date/:date/type/:type/calories').get(getCalories)
router.route('/date/:date/type/:type').post(addMeal)
router.route('/date/:date').get(getAllMeals)

module.exports = router