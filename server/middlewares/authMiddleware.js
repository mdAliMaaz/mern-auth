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