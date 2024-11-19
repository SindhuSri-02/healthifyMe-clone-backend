const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cron = require('node-cron')
const authenticateRouter = require('./Routes/AuthenticateRouter')
const productsRouter = require('./Routes/ProductsRouter')
const mealRouter = require('./Routes/MealRouter')
const userRouter = require('./Routes/UserRouter')
const dailyMealRouter = require('./Routes/DailyMealRouter')
const DailyMeal = require('./models/DailyMeal')
// const {ensureAuthenticated} = require('./Controllers/AuthenticateController')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(`mongodb+srv://sindhusri:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER}/users?retryWrites=true&w=majority&appName=Cluster0`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err)=> console.log(err))


  async function deleteOldDailyMeals() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
        const result = await DailyMeal.deleteMany({ date: { $lt: oneWeekAgo } });
        console.log(`${result.deletedCount} old daily meals deleted successfully.`);
    } catch (error) {
        console.error("Error deleting old daily meals:", error);
    }
}

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log("Running daily meal cleanup...");
    deleteOldDailyMeals();
});


app.use('/api/authenticate',authenticateRouter)
app.use('/api/products',productsRouter)
app.use('/api/meals', mealRouter)
app.use('/api/users', userRouter)
app.use('/api/journal', dailyMealRouter)

app.get('/hello',(req,res) => {
    res.send('hello from server')
})

app.listen(1337,(req,res) => {
    console.log('app is running at 1337')
})
