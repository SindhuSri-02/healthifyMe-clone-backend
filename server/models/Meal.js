const mongoose = require('mongoose');

const Meal = new mongoose.Schema({
    name: {type: String, required: true},
    calories: {type: Number, required: true},
    servings: {type: Number, required: true},
    protein: {type: Number, required: true},
    carbohydrates: {type: Number, required: true},
    fiber: {type: Number, required: true},
    sugar: {type: Number, required: true},
}, {collection:'Meal'})

const model = mongoose.model('Meal',Meal)

module.exports = model