# How did i made this project ?

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

## This command will intilized new node js project for you

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

### Now our server is ready ,so now lets create routes controllers ,Bascially we some endpoints on which we can request

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

and add the following to your code in `userController.js` file

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
