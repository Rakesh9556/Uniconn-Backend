import { asyncHandeler } from "../utils/asyncHandeler.js"; 
import { ApiError  } from "../utils/ApiError.js";
import {User} from "../models/user.models.js "
import {uploadOnCloudinary} from "../utils/cloudinary.js" 
import { ApiResponse  } from "../utils/ApiResponse.js";


const registerUser = asyncHandeler(async (req, res) => { 
    res.status(200).json({
        message: "ok"
    })
    
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
    console.log("fullname:", fullName);
    console.log("email:", email);

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
    const existedUser =  User.findOne({
        $or: [{ email }, { username }]
    })

    if(existedUser) {
        throw new ApiError(409, "Email or Username already exists! ")
    }


    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path 
    const coverImageLocalPath =  req.files?.coverImage[0]?.path

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

    const createdUser = await User.findByID(user._id).select(
        "-password - refreshToken"
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



export {registerUser}