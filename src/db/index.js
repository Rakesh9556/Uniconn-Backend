import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected succesfully and hosted at: ${connectionInstance.connection.host}`);
        
    } catch (error ) {
        console.error("MongoDB connection failed !", error);
        process.exit(1)  // process exit instead of throw error
    }
}

export default connectDB