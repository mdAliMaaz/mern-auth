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