This app is built with Node.js and MongoDB to help users track their daily meals and monitor calorie intake. This application includes user authentication, weekly calorie consumption graphs, and a meal management system.

#### hosted at - [use this link as api for your app](https://healthifyme-clone-backend.onrender.com)

## Features
#### User Authentication:

Users can register and log in securely.
Authentication is implemented using **JWT (JSON Web Tokens)**.

## Meal Tracking:

Users can add, view, and delete the food items for a specific date and specific type(breakfast,lunch,dinner).
Each meal contains details like name, calories, and serving size.
one week of meals deatils will be reatined, rest of them are cleared out by **node-corn**.
Users can create their own meals so that there is no need of adding same food items daily, they can add this meal when ever required.

## Installation and Setup
#### Prerequisites
##### Ensure you have the following installed:

Node.js (v16 or higher)
MongoDB (local or cloud instance)
Git

Steps:
#### Clone the Repository:
`git clone https://github.com/SindhuSri-02/healthifyMe-clone-backend.git`

##### Install Dependencies:
`npm install`

##### Set Environment Variables:

Create a .env file in the folder and configure:
```
PORT=1337 
MONGO_PASSWORD=
NUTRITION_API=https://api.calorieninjas.com/v1/nutrition?query=
API_KEY=get from https://calorieninjas.com/api
SECRET=
```
Replace with appropriate values.

###### Start the Application:

`npm run dev`

Access the Application(API): Open your browser and navigate to http://localhost:1337. 

## Project Structure
```
Framework: Express.js
Database: MongoDB
Authentication: JWT
Directory structure:
```

```
server/
├── models/            # Mongoose models (User, Meal, DailyMeal)
├── routes/            # API endpoints (auth, meal, user, dailyMeal)
├── controllers/       # Business logic for routes
├── index.js           # Server entry point
└── ...
```

##### API Endpoints

Authentication:
| Method        | Endpoint                   | Description             |
| ------------- |:--------------------------:| -----------------------:|
| POST	        | /api/authenticate/register | Register a new user     |
| POST	        | /api/authenticate/login	   | Login and get a token   |

Meal Management:
| Method        | Endpoint                                                 | Description                                          |
| ------------- |:--------------------------------------------------------:| ----------------------------------------------------:|
| GET	          | /api/journal/date/:date                                  | Get all meals for the date                           |
| POST          | /api/journal/date/:date/type/:type                       | add a type of meal to a date                         |
| GET           | /api/journal/date/:date/type/:type/calories              | Get calories of the type of meals for a date of user |
| POST          | /api/journal/date/:date/type/:type/meal/:mealEntryId/dec | Decrease the quantity of a meal entry for a user     |
| POST          | /api/journal/date/:date/type/:type/meal/:mealEntryId/inc | Increase the quantity of a meal entry for a user     |
| DELETE        | /api/journal/date/:date/type/:type/meal/:mealId          | Delete the meal for the user of the specific date    |

User Management:
| Method        | Endpoint                   | Description                           |
| ------------- |:--------------------------:| -------------------------------------:|
| GET	          | /api/users                 | Get all users                         |
| POST          | /api/users/meal            | add a meal to a user's created meals  |
| GET           | /api/users/userProfile     | Get logged in user details            |
| GET           | /api/users/:userId         | Get user                              |
| DELETE        | /api/users/meal/:mealId    | Delete the meal for the user          |

Here's details of API endpoints and results - [API explaination](https://documenter.getpostman.com/view/12462108/2sAYBSiCKZ)

## Technologies Used
Node.js
Express.js
MongoDB
JWT Authentication

## Future Enhancements
Add the ability to edit meals.
Add a feature to track macronutrients (protein, carbs, fat).
Add exercise done, so that calories spent is noted
Recommend amount of the calories to be taken based on weight and goal of user, recommened diet too

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.
