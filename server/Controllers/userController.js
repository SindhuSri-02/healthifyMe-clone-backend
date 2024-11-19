const User = require('../models/User')
const Meal = require('../models/Meal')
const jwt = require('jsonwebtoken')

exports.addMealToUser = async (req, res) => {
    try {
        const { name, servings, calories, protein, carbohydrates, fiber, sugar } = req.body;

        const newMeal = await Meal.create({ name, calories, servings, protein, carbohydrates, fiber, sugar });

        const updatedUser = await User.findByIdAndUpdate(req.params.userId , { $push: { meals: newMeal._id } }, { new: true });

        res.status(201).json({ success: true, message: 'Meal added to user successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding meal to user', error: error.message });
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
                    meals: { _id: mealId }
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
