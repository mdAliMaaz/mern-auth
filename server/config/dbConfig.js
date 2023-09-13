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