import { asyncHandeler } from "../utils/asyncHandeler.js"; 
import { ApiError  } from "../utils/ApiError.js";
import {User} from "../models/user.models.js "
import {uploadOnCloudinary} from "../utils/cloudinary.js" 
import { ApiResponse  } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


// access and refresh token method

const generateAccessAndRefreshTokens = async(userId) =>  {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

         // access token ame user ku send karidei thau but refresh token database re store kareithau
         user.refreshToken = refreshToken 
         // save kariba
         await user.save({ validateBeforeSave: false })  // but save kala bele password field kick in heijiba kahainki na jetebele bi save kariba password require so --> sethipain ame use karuche validateBeforeSave forcefully save kariba pain

         return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
        
    }
}


const registerUser = asyncHandeler(async (req, res) => { 
    // res.status(200).json({
    //     message: "ok"
    // })
    
    // get user detail from frontend
    // validation - not empty
    // check if user is already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object  - create entry in db
    // remove password and referesh token field from response 
    // check for user creation
    // return response

    const {fullName, email, username, password} = req.body
    // console.log("request body:" + req.body);
    // console.log("fullname:", fullName);
    // console.log("email:", email);

    // Validation
    // 1st way

    // if (fullName === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    // 2nd way

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // we can also validates the email has "@" symbol or not


    // check if user is already exists: username, email
    const existedUser =  await User.findOne({
        $or: [{ email }, { username }]
    })

    if(existedUser) {
        throw new ApiError(409, "Email or Username already exists! ")
    }


// check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path 

// check for coverImage 
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }



    // console.log("Req files:" + req.files);

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    //upload on cloudinary 
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath) 

    if(!avatar) {
        throw new ApiError(400, "Avatar is required")
    }


    // create user object  - create entry in db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",   // corner-case: jadi cover achhi tahale entry cretae kara nahele empty rahiba field kahinki na ame cover image ku validate karine
        email,
        password,
        username: username.toLowerCase()
    })


    // remove password and referesh token field from response 

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) 

    
    // check for user creation

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong! Try again")
    }


    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

     




})  

const loginUser = asyncHandeler(async (req, res) => {

    // to-do
    // req body ru data aniba
    // username ki email ku user thu nei database saha validate kareiba
    // user ku find kariba 
    // user achi jadi password check kariba
    //  acccess au refresh token generate kari user ku send kariba 
    // send kariba cookies re
    // response return kariba


    // 1. req body ru data aniba

    const {email, username, password} = req.body 
    // console.log(email)

    if(!(username || email)) { 
        throw new ApiError(400, "Username or email is required")
    }

    // if(username && email) { 
    //     throw new ApiError(400, "Username or email is required")
    // }
    
    
    // username ki email ku user thu nei database saha validate kareiba

    const user = await User.findOne({
        $or : [{username}, {email}]
    })

    // user ku find kariba  --- jadi nahin
    if(!user) {
        throw new ApiError(404, "User doesn't exist")
    }

    // user miligale ---> password check kariba
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials ")
    }

    
    //  acccess au refresh token generate kari user ku send kariba 
    const  {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id )

    const loggedInUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )


    // send kariba cookies re
    
    const options = {
        httpOnly: true,  // true kale a cookies kebala server re hin modify heipariba frontend ru modify kariparibani
        secure: true
    }

        
    
    // response return kariba
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})


// log out user
const logoutUser = asyncHandeler(async (req, res) => {
    // clear cookies
    
    // problem: user kauthu aniba kemiti janiba kau user ku logout  kairba boli
    // solution : middle ware create  kariba 

    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {refreshToken: undefined}
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,  // true kale a cookies kebala server re hin modify heipariba frontend ru modify kariparibani
        secure: true
    }

    // cookies clear karibara achi
     return res
     .status(200)
     .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
     .json(new ApiResponse(200, {}, "User logged out"))

      


})


// refresh token

const refreshAccessToken = asyncHandeler(async (req, res) => {

    const incomingRefreshToken =req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized requesst")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh toke n")
        }
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            )
            )
    } catch (error) {
         throw new ApiError(401, error?.message || "Invalid refresh token ")
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken 
}