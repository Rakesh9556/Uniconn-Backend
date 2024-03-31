import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
    
}))

// accepting json (form data)
app.use(express.json({limit: "16kb"}))   

// accepting url data
app.use(express.urlencoded({extended: true, limit: "16kb"}))   // extended: we can give objects inside objects

// config for storing files and folders
app.use(express.static("public"))

// config to accept cookies
app.use(cookieParser())



// Router setup

import userRouter from "./routes/user.routes.js"

// routes declaration

// app.use("/api/v1/user", userRouter)  // standard practise to show that we are on v1 of the app 
app.use("/user", userRouter)


export {app}