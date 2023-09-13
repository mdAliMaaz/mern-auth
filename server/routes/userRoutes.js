import express from 'express';
import { getAllUsers, userAuth, logout, getUserProfile, updateUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js'
const router = express.Router();




router.route('/api/users').get(getAllUsers).post(registerUser);

router.route('/api/users/auth').post(userAuth);

router.route('/api/users/logout').post(logout);

router.route('/api/users/profile').get(protect, getUserProfile).put(protect, updateUser)

export default router;