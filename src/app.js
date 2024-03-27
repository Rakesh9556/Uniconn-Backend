import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
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


export default app