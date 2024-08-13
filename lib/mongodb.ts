"use server"
import mongoose from 'mongoose'

let isConnected = false;

const connectToDb = async () => {
    mongoose.set('strictQuery', true);
    if (!process.env.MONGODB_URI) return console.log('MONGODB_URI is not Found');
    if (isConnected) return console.log('Already connected to mongodb')

    try {
        await mongoose.connect(process.env.MONGODB_URI)

        isConnected = true;
        console.log("connected to the db");

    } catch (error:any) {
        console.log(error.message);
    }
}

export default connectToDb;