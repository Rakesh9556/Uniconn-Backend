import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})
  

connectDB()
.then(() => {
    
    app.on("error", (error) => {   
        console.error("Server connection failed !");
        throw error 
    })

    app.listen(process.env.PORT || 8000, () => {
         console.log(`Server is running at http://localhost:${process.env.PORT}`);
    })

})

.catch((err) => {
    console.error("MongoDB connection failed !", err);

})







/*
import express from "express"
const app = express()

(async () => {
    try { 
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Error:", error)
            throw error 
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port: http://${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("Error", error)  
        throw err
    }
})()
*/
