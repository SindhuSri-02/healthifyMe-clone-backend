const jwt = require('jsonwebtoken');
const DailyMeal = require('../models/DailyMeal')
const Meal = require('../models/Meal')
const User = require('../models/User')

exports.addMeal = async (req,res)=>{
    try{
        const auth = req.headers['authorization'];
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        
        const user = await User.findOne({email: decodedUser.email}).populate('dates')

        const date = new Date(req.params.date)
        date.setUTCHours(0,0,0,0)

        let dm = user.dates.find(entry =>{
            const edate = new Date(entry.date)
            edate.setUTCHours(0,0,0,0)
            return edate.getTime() === date.getTime()
        })
        if(!dm){
            dm = await DailyMeal.create({ date })
            user.dates.push(dm._id)
            await user.save()
        }

        const type = req.params.type
        const typeCalories = type+"_calories"

        const { name, servings, calories, protein, carbohydrates, fiber, sugar } = req.body;
        const dml = await DailyMeal.findById(dm._id).populate('breakfast.meal lunch.meal dinner.meal')
        const found = dml[type].find(entry => entry.meal.name === name)

        let updatedDailyMeal;
        let mealId;

        if(found){
            mealId = found.meal._id
            updatedDailyMeal = await DailyMeal.findOneAndUpdate(
                {
                    _id: dm._id,
                    [`${type}.meal`]: mealId, 
                },
                {
                    $inc: {
                        [`${type}.$.quantity`]: 1, 
                        [typeCalories]: found.meal.calories,
                    },
                },
                { new: true }
            );
        }else{
            const newMeal = await Meal.create({ name, calories, servings, protein, carbohydrates, fiber, sugar });
            mealId = newMeal._id

            updatedDailyMeal = await DailyMeal.findByIdAndUpdate(
                dm._id,
                {
                    $push: {
                        [type]: {
                            meal : mealId
                        }
                    },
                    $inc: { [typeCalories]: calories }
                },
                {new: true}
            ).populate('breakfast.meal').populate('lunch.meal').populate('dinner.meal')
        }
        mealEntry = updatedDailyMeal[type].find(entry => entry.meal._id.toString() === mealId.toString())
        return res.status(201).json({
            success: true,
            message: 'Added meal to the user\'s daily meal journal',
            allMeals: updatedDailyMeal,
            meal: mealEntry,
            found: found? true:false
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error',
            error:error.message
        })
    }
}

exports.getAllMeals = async (req,res)=>{
    try{
        const auth = req.headers['authorization']
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        const user = await User.findOne({email: decodedUser.email}).populate('dates')

        const date = new Date(req.params.date)
        date.setUTCHours(0,0,0,0)

        let dm = user.dates.find(entry =>{
            const edate = new Date(entry.date)
            edate.setUTCHours(0,0,0,0)
            return edate.getTime() === date.getTime()
        })
        if(!dm){
            dm = await DailyMeal.create({ date })
            user.dates.push(dm._id)
            await user.save()
        }

        let dailyMeal = await DailyMeal.findById(dm._id).populate('breakfast.meal lunch.meal dinner.meal')

        return res.status(200).json({
            success: true,
            message: `Fetched all meals of the date ${date}`,
            meals: dailyMeal
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error',
            error: error.message
        })
    }
}

exports.deleteAMeal = async (req,res)=>{
    try{
        const auth = req.headers['authorization']
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        const user = await User.findOne({email: decodedUser.email}).populate('dates')

        const date = new Date(req.params.date)
        date.setUTCHours(0,0,0,0)

        let dailyMeal = user.dates.find(entry =>{
            const edate = new Date(entry.date)
            edate.setUTCHours(0,0,0,0)
            return edate.getTime() === date.getTime()
        })
        
        const type = req.params.type
        const mealId = req.params.mealId
        const typeCalories = type+"_calories"

        const mealEntry = dailyMeal[type].find(entry => entry._id.toString() === mealId.toString())
        const meal = await Meal.findOne({_id: mealEntry.meal})
        const quantity = mealEntry.quantity

        const updatedDailyMeal = await DailyMeal.findByIdAndUpdate(
            dailyMeal._id,
            {
                $pull: {
                    [type]: {
                        _id : mealId
                    }
                },
                $inc: {[typeCalories]: -1*meal.calories*quantity}
            },
            {new: true}
        )

        return res.status(200).json({
            message: "deleted the meal",
            success: true,
            allMeals: updatedDailyMeal,
            deletedMeal: meal
        })
    } catch(error){
        return res.status(500).json({
            message: "Error",
            success: false,
            error: error.message
        })
    }
}

exports.getCalories = async (req,res) => {
    try{
        const type = req.params.type
        const auth = req.headers['authorization']
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        const user = await User.findOne({email: decodedUser.email}).populate('dates')

        const date = new Date(req.params.date)
        date.setUTCHours(0,0,0,0)

        let dailyMeal = user.dates.find(entry =>{
            const edate = new Date(entry.date)
            edate.setUTCHours(0,0,0,0)
            return edate.getTime() === date.getTime()
        })

        let value = 0
        if(type==="breakfast") value = dailyMeal.breakfast_calories
        else if(type==="lunch") value = dailyMeal.lunch_calories
        else value = dailyMeal.dinner_calories

        return res.status(200).json({
            message: "fetched calories",
            success: true,
            calories: parseFloat(value).toFixed(2)
        })
    } catch(error) {
        return res.status(500).json({
            message: "Error",
            success: false,
            error: error.message
        })
    }
}

exports.increaseQuantity = async (req,res)=>{
    try{
        const auth = req.headers['authorization']
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        const user = await User.findOne({email: decodedUser.email}).populate('dates')

        const date = new Date(req.params.date)
        date.setUTCHours(0,0,0,0)

        let dailyMeal = user.dates.find(entry =>{
            const edate = new Date(entry.date)
            edate.setUTCHours(0,0,0,0)
            return edate.getTime() === date.getTime()
        })
        
        const type = req.params.type
        const mealEntryId = req.params.mealEntryId
        const typeCalories = type+"_calories"

        const mealEntry = dailyMeal[type].find(entry => entry._id.toString() === mealEntryId.toString())
        const meal = await Meal.findOne({_id: mealEntry.meal})

        const updatedDailyMeal = await DailyMeal.findOneAndUpdate(
            {
                _id: dailyMeal._id,
                [`${type}._id`]: mealEntryId, 
            },
            {
                $inc: {
                    [`${type}.$.quantity`]: 1, 
                    [typeCalories]: meal.calories,
                },
            },
            { new: true }
        );

        return res.status(200).json({
            message: "increased the quantity",
            success: true,
            allMeals: updatedDailyMeal,
            meal: mealEntry
        })
    } catch(error){
        return res.status(500).json({
            message: "Error",
            success: false,
            error: error.message
        })
    }
}

exports.decreaseQuantity = async (req,res)=>{
    try{
        const auth = req.headers['authorization']
        const decodedUser = jwt.verify(auth, process.env.SECRET)
        const user = await User.findOne({email: decodedUser.email}).populate('dates')

        const date = new Date(req.params.date)
        date.setUTCHours(0,0,0,0)

        let dailyMeal = user.dates.find(entry =>{
            const edate = new Date(entry.date)
            edate.setUTCHours(0,0,0,0)
            return edate.getTime() === date.getTime()
        })
        
        const type = req.params.type
        const mealEntryId = req.params.mealEntryId
        const typeCalories = type+"_calories"

        const mealEntry = dailyMeal[type].find(entry => entry._id.toString() === mealEntryId.toString())
        const meal = await Meal.findOne({_id: mealEntry.meal})

        const updatedDailyMeal = await DailyMeal.findOneAndUpdate(
            {
                _id: dailyMeal._id,
                [`${type}._id`]: mealEntryId, 
            },
            {
                $inc: {
                    [`${type}.$.quantity`]: -1, 
                    [typeCalories]: -1*meal.calories, 
                },
            },
            { new: true }
        );

        return res.status(200).json({
            message: "decreased the quantity",
            success: true,
            allMeals: updatedDailyMeal,
            meal: mealEntry
        })
    } catch(error){
        return res.status(500).json({
            message: "Error",
            success: false,
            error: error.message
        })
    }
}