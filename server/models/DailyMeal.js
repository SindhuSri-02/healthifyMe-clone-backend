const mongoose = require('mongoose');

const DailyMealSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    breakfast: [{
        meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
        quantity: { type: Number, default: 1 } 
    }],
    lunch: [{
        meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
        quantity: { type: Number, default: 1 }  
    }],
    dinner: [{
        meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
        quantity: { type: Number, default: 1 }  
    }],
    breakfast_calories: { type: Number, default: 0 },
    lunch_calories: { type: Number, default: 0 },
    dinner_calories: { type: Number, default: 0 },
    calories: { type: Number, default: 0 }
}, { collection: 'DailyMeal' });


DailyMealSchema.pre('save', function (next) {
    this.calories = (this.breakfast_calories || 0) 
                    + (this.lunch_calories || 0) 
                    + (this.dinner_calories || 0);
    next();
});

const DailyMeal = mongoose.model('DailyMeal', DailyMealSchema);

module.exports = DailyMeal;