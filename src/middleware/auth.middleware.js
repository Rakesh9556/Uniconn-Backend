//   a middleware khali verify bateba j user achi ki nahin 

import { ApiError } from "../utils/ApiError.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"

export const verifyJWT = asyncHandeler(async (req, _, next) => {
    
    try { 
        // token ru access naba
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","") 
    
        if(!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        // check token thik achi ki nahin
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET )
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            // discuss about frontend
            throw new ApiError(401, "Invalid access token")
        }
     
        // jadi user achi
        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid acess token")
    }
})