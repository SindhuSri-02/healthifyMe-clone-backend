const User = require('../models/User')
const Meal = require('../models/Meal')
const jwt = require('jsonwebtoken')

exports.addMealToUser = async (req, res) => {
    const {name,meals} = req.body
    try{
        const nameIsExists = await Meal.find({ name });
        if (nameIsExists.length > 0) {
            return res.status(409).json({
                message: "Meal with this name already exists",
                success: false
            })
        }
        let calories = 0, servings = 0, protein = 0, carbohydrates = 0, fiber = 0, sugar = 0;

        meals.map(entry => {
            calories += entry.meal.calories * entry.quantity
            servings += entry.meal.servings  * entry.quantity
            protein += entry.meal.protein
            carbohydrates += entry.meal.carbohydrates
            fiber += entry.meal.fiber
            sugar += entry.meal.sugar
        })

        const meal = await Meal.create({
            name,
            calories,
            servings,
            protein,
            carbohydrates,
            fiber,
            sugar
        });

        const auth = req.headers['authorization'];
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        
        await User.findOneAndUpdate({email: decodedUser.email},{
            $push: {
                meals: meal._id
            }
        })

        return res.status(201).json({message:"created meal", success: true, meal})
        
    } catch(err){
        return res.status(500).json({message:"error", success: false, error: err.message})
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        return res.status(200).json({ message: "fetched all users" , success: true, users})
    }catch(error){
        return res.status(500).json({ message: "Error" , success: false, error})
    }
}

exports.getAUser = async (req, res) => {
    try {
        let user;
        if(req.params.userId){
            user = await User.findById(req.params.userId).populate('meals')
        }else{
            const auth = req.headers['authorization'];
            const decodedUser = jwt.verify(auth, process.env.SECRET)
            user = await User.findOne({email: decodedUser.email}).populate('meals dates')
        }
        if(user) return res.status(200).json({ message: "fetched the user" , success: true, user})
        return res.status(404).json({ message: "No such User exists" , success: false})
    }catch(error){
        return res.status(500).json({ message: "Error" , success: false, error:error.message})
    }
}

exports.deleteAMeal = async(req,res) =>{
    try{
        const auth = req.headers['authorization']
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        const user = await User.findOne({email: decodedUser.email})
        
        const mealId = req.params.mealId

        await User.findByIdAndUpdate(
            user._id,
            {
                $pull: {
                    meals: mealId
                }
            }
        )

        return res.status(200).json({
            message: "deleted the meal",
            success: true,
        })
    } catch(error){
        return res.status(500).json({
            message: "Error",
            success: false,
            error: error.message
        })
    }
}
