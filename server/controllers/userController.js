import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import { hashPassword } from '../helper/hassingPassword.js';
import generateToken from '../helper/generateToken.js';
import bcrypt from 'bcryptjs';
import { response } from 'express';

// @desc get all users
// @route GET /api/users
// @access private
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});

    if (users) {
        res.status(200).json({ users })
    }
    else {
        res.status(404)
        throw new Error("Users not found")
    }
})


// @desc register users
// @route POST /api/users
// @access public
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
        res.status(201).json({ message: "new User Created", id: newUser._id, name: newUser.name, email: newUser.email })
    }
    else {
        res.status(400)
        throw new Error("Invalid Input Data")
    }
})


// @desc get token users
// @route post /api/users/auth
// @access public
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
    res.status(200).json({ message: "user Login Success", id: existingUser._id, name: existingUser.name, email: existingUser.email })
})


// @desc get user profile
// @route GET /api/profile
// @access private
export const getUserProfile = asyncHandler(async (req, res) => {
    if (req.user) {
        res.status(200).json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        })
    }
    else {
        res.status(404)
        throw new Error("user not found")
    }
})

// @desc update a user
// @route PUT /api/users/profile
// @access private
export const updateUser = asyncHandler(async (req, res) => {


    const user = await User.findById(req.user.id);
    console.log(user)

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = await hashPassword(req.body.password)
        }

        const updatedUser = await user.save();


        res.status(200).json({ message: "User updated successfully", name: updatedUser.name, email: updatedUser.email });

    } else {
        res.status(404);
        throw new Error('User not found');
    }



})



// @desc login a user and clear the cookies
// @route post /api/users/logout
// @access private
export const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true

    })
    res.status(200).json({ message: "Logout successfully" })
})



