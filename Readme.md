# How did i Build this project ?

- Create a new folder mern-auth
- Created 2 new folders in mern-auth folder

```
mkdir mern-auth
cd mern-auth
mkdir client server
cd server
```

## Now inside mern-auth/server run the following command

```
npm init -yes
```

## This command will intialize new node js project for you

## Now install the following packages

```
npm install mongoose express cors bcryptjs jsonwebtoken express-async-handler cookie-parser dotenv
```

```
npm install -D nodemon
```

1. `mongoose` will help us to connect to database(mongoDb) and communicate with it.

2. `express` will help us to run nodejs server very quick and easy

3. `cors` will help us to send requests from our front-end

4. `bcryptjs` will help us to hash user passwords, as it is not good practice to store
   passwords with out hashing them.

5. `jsonwebtoken` will help us to generate a JSON token.

6. `cookie-parser` will help us to parse the cookie.

7. `expess-async-handler` will help us to reduce some code ,bascially we skip writing `try-catch`-block every time.

8. `dotenv` will help us to access `.env` variables.

9. and ya the last one `nodemon` this will restart the server every time we save the file.

#### Now create the `index.js` file

add the following code in your `index.js` file

```
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import Cors from 'cors';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Cors({ origin: "http://localhost:5173", credentials: true }));
dotenv.config();


const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`server listening on ${PORT}🎉`));
```

### Now create a new file `.env`

```
PORT = 3500
MONGODB_URL = mongodb://127.0.0.1/mernAuth

SECRET_KEY= i am strong
```

### Now lets add scripts in our package.json file so that we can run our server

```
{
  "name": "mern-auth",
  "version": "1.0.0",
  "description": "this is mern-auth project",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "author": "Maaz",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}

```

### Now you run this command in your console

```
npm run dev or yarn run dev
```

what you will see in console

```
server listening on 3500
```

### Now our server is ready ,so now lets create routes controllers ,Bascially we need some endpoints on which we can request

run the following commands in your console

```
mern-auth > server mkdir routes controllers helper
```

Now inside routes folder create `userRoutes.js` file
and write the following code.

```
Import express from 'express'

const router = express.Router();

router.route('/api/users').get(getAllUsers).post(registerUser);

router.route('/api/users/auth').post(userAuth);

router.route('/api/users/logout').post(logout);

router.route('/api/users/profile').get(getUserProfile).put( updateUser)



export default router

```

Ok now lets add all controller functions. In order to do that create a new file in controller folder named as `userController.js`

and now add the following code to your `userController.js` file

```
export const getAllUsers = (req,res) =>{
  res.json({message:"getAllUsers"})
}


export const registerUser = (req,res) =>{
  res.json({message:"registerUser"})
}


export const userAuth = (req,res) =>{
  res.json({message:"userAuth"})
}


export const logout = (req,res) =>{
  res.json({message:"logout"})
}

export const getUserProfile = (req,res) =>{
  res.json({message:"getUserProfile"})
}

export const updateUser = (req,res) =>{
  res.json({message:"updateUser"})
}
```

### Now import all the controllers in your `userRoute.js` file

```
import { getAllUsers, userAuth, logout, getUserProfile, updateUser, registerUser } from '../controllers/userController.js';
```

Now open `postman` and test all your routes

now that all our routes working lets get database connection

### Create a new folder `config` and add a new file named by `dbConfig.js` and add following code.

`dbConfig.js`

```
import mongoose from 'mongoose';

const dbConnect = async (url) => {

    try {
        await mongoose.connect(url);
        console.log('Database connection established🍀')
    } catch (error) {
        console.log(error)
    }
}

export default dbConnect;
```

now lets import this fuction in our `index,js` file and use it

```
import dbConnect from './config/dbConfig.js';

// add this lines to your index.js file
dbConnect(process.env.MONGODB_URL);
```

### Now lets create user model ,lets add new folder model and ad new file `user.model.js` and add following code

```
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);

export default User;

```

- Okay cool, database setup is completed

### Now lets add logic into our controller functions

- but before writing logic ,lets take care of error handling,so create a folder named middlerware and add `errorMiddleware.js` and add the following code

```
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404)
    next(error);
}

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // If Mongoose not found error, set to 404 and change message
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
```

- now lets import this functions and add it in your index.js `add it Below`(after your routes)

```
// handlling errors
app.use(notFound);
app.use(errorHandler);
```

- now wrap your controller functions with express-async-handler,your code should look like this:

```
userController.js


import asyncHandler from 'express-async-handler'

export const getAllUsers =asyncHandler(async (req,res) =>{
  res.json({message:"getAllUsers"})
})


export const registerUser = asyncHandler(async(req,res) =>{
  res.json({message:"registerUser"})
})


export const userAuth = asyncHandler(async(req,res) =>{
  res.json({message:"userAuth"})
})


export const logout = asyncHandler(async(req,res) =>{
  res.json({message:"logout"})
})

export const getUserProfile = asyncHandler(async(req,res) =>{
  res.json({message:"getUserProfile"})
})

export const updateUser = asyncHandler(async(req,res) =>{
  res.json({message:"updateUser"})
})
```

### Good to go now lets add the logic🚀

- we can't store passwords normally in database we need to hash them so create a new file in `helper` folder `hashPassword.js` and add below code.

```
import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
    return bcrypt.hash(password, 12)
}

```

```
registerUser

export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("All fields are required")
    }

    const alreadyUser = await User.findOne({ email });

    if (alreadyUser) {
        res.status(400)
        throw new Error("User alredy exists")
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({ name, email, password: hashedPassword });

    if (newUser) {

        generateToken(res, newUser._id)
        res.status(201).json({ success: true, message: "new User Created", id: newUser._id, name: newUser.name, email: newUser.email })
    }
    else {
        res.status(400)
        throw new Error("Invalid Input Data")
    }
})
```

- now if user is logged in with correct email and password then we gona provide user a token basically jsonwebtoken ,in order to do that create a new filer in `helper` folder `generateToken.js` and add the following code,we are setting that jwt in cookie

```
generateToken.js

import JWT from 'jsonwebtoken';

const generateToken = (res, id) => {

    const token = JWT.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: '30d'
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

}

export default generateToken;
```

```
userAuth

export const userAuth = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(403);
        throw new Error("All fields are required")
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        res.status(404);
        throw new Error(`User not found`);
    }

    const correctPassword = bcrypt.compareSync(password, existingUser.password);

    if (!correctPassword) {
        res.status(403);
        throw new Error(`Invalid password'`);
    }
    generateToken(res, existingUser._id)
    res.status(200).json({ success: true, message: "user Login Success", id: existingUser._id, name: existingUser.name, email: existingUser.email })
})

```

- okay now we able to regiseter a user and also user can login ,we are able to provide a `jwt` for user and we are also seeting the `jwt` in cookie.

- now lets protect some routes with the help of `jwt`

- To do that lets create a new file in `helper` folder `authMiddleware.js`
- add the following code to your file `authMiddleware.js`

```
authMiddleware.js


import JWT from 'jsonwebtoken';
import User from '../models/user.model.js'
import asynHandler from 'express-async-handler';

const protect = asynHandler(async (req, res, next) => {
    let token = req.cookies.token;
    if (token) {
        try {

            const decoded = JWT.verify(token, process.env.SECRET_KEY);

            req.user = await User.findById(decoded.id).select('-password')
            next();

        } catch (error) {
            res.status(401)
            throw new Error("Token not valid login again")
        }
    }
    else {

        res.status(401)
        throw new Error("Not authorized , No token found")
    }
})

export { protect }
```

- now lets use this middleware in `userRoute.js`
- user `userRoute.js` file should look like this

```
userRoute.js

import express from 'express';
import { getAllUsers, userAuth, logout, getUserProfile, updateUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router();


router.route('/api/users').get(getAllUsers).post(registerUser);

router.route('/api/users/auth').post(userAuth);

router.route('/api/users/logout').post(logout);

router.route('/api/users/profile').get(protect, getUserProfile).put(protect, updateUser)

export default router;
```

# Done with server
