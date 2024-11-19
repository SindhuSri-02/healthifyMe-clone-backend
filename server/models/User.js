const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],
    dates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyMeal' }]
}, {collection:'user'})

const model = mongoose.model('user',User)

module.exports = model