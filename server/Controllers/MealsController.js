const jwt = require('jsonwebtoken');
const Meal = require('../models/Meal')
const fetch = require('node-fetch')
const User = require('../models/User')

exports.getAllMeals = async (req, res) => {
    try{
        const auth = req.headers['authorization'];
        const decodedUser = jwt.verify(auth, process.env.SECRET)

        const user = await User.findOne({email: decodedUser.email}).populate('meals')
        const meals = user.meals

        return res.status(200).json({message:"fetched all the meals", success: true, meals})
    }catch(error){
        return res.status(500).json({message:"error", success: false, error: err.message})
    }
}

exports.deleteAMeal = async (req, res) => {
    try{
        const meal = await Meal.deleteOne({
            name: req.params.meal
        })
        return res.status(200).json({
            message: "deleted the meal",
            success: true
        })
    } catch(err){
        return res.status(500).json({message:"error", success: false, error: err.message})
    }
}

exports.getAMeal = async (req, res) => {
    const url = process.env.NUTRITION_API + req.params.meal;
    try{
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Api-Key': process.env.API_KEY
        }
    })
    // Parse the response JSON
    const meal = await response.json();

    if (response.status==200) { 
        return res.status(200).json({
            message: "Meal exists in API",
            success: true,
            meal
        });
    } else {
            return res.status(response.status).json({
                message: "No meal with that name exists",
                success: false,
                error: meal
            });
        }
    } catch (error) {
        console.error("Error fetching meal data:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}