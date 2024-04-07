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
        
        // Ensure accessToken and refreshToken are defined before returning
        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Access token or refresh token generation failed")
        }
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
    const avatarLocalPath = req.files?.avatar[0]?.path;

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

    // const {email, username, password} = req.body 
    const {email, password} = req.body 
    // console.log(email)

    if(!email) { 
        throw new ApiError(400, "Email is required")
    }

    // if(!(username || email)) { 
    //     throw new ApiError(400, "Username or email is required")
    // }
    
    
    // username ki email ku user thu nei database saha validate kareiba

    // const user = await User.findOne({
    //     $or : [{username}, {email}]
    // })
    const user = await User.findOne({ email });

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


// refresh token where user can refresh his token

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

const changeCurrentPassword = asyncHandeler(async (req, res) => {
     
    // pasword change kala bele user thu kna kna require field naba ---> 1. current pass, 2. new pass
     const {oldPassword, newPassword, confirmPassword} = req.body   

     // user ku acces kariba taki tara password change kariba --> findById --> ethire user milijiba and update karipariba password field ku
     const user = User.findById(req.user?._id)  // user ku accesss kariba pain, req.user bhitaare user achi (from auth midle ware)

      // isPasswordCorrect gote method achi seita true orr false valu daba jadi ama old password user correct entry kariba then jai ame password change karipariba
      const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)  // isPasswordCorrect bhitare ame amara old passsword ku pass kariba and ei  check kariba j ame entered karitiba old password database re thiba encrypted password saha equal hauchi ki nahin 
  
      if(!isPasswordCorrect) {             // old password encrypted password saha equal na hele error throw kara
        return new ApiError(400, "Invalid old password")  
      }

      // vlaidate newPassword and confirm password
      if (newPassword === confirmPassword) {
        throw new ApiError(400, "Password do not match")
      }

      // jehetu ame user ku access kariche so user bhitare password field achhi, so taku update kari newPassword set karidaba
      user.password = newPassword   // password update hele amara pre hook chaliba and then user.model re thiba pree hook check kariba j jadi password re kichhi modify heichi then se password ku bycrypt kariba and again store kariba
      
      //  ame upare khali set kariche newPaassword ku  hele save karine so
      await user.save({validateBeforeSave: false})  // user re save kariba purbaru ame au sabu validation ku run karibaku chanhune sethipain validateBeforeSave ku use kariba 

      // jadi password successfully change heijaichi then user ku gote responese send karidaba
      res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"))




})


// jadi user logged in achhi tahale req.user re ame current user ku access karipariba
const getCurrentUser = asyncHandeler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})


// field jauta ame update kari pariba user ra  ---> profile photo, username, bio, etc

// text filed update 
const updateUserDetails = asyncHandeler(async (req, res) => {
    // Step1: update kala bele user thu kna kna require filed naba (req.body)
    const {fullName, email, bio, role, department} = req.body;

    //Step2: atleast gote filed update karibaku padiba and  jadi user kichhi update karibaku deini ---> error thorw kariba
    // jadi kebala gote filed thile bi update kariba
    if (!(fullName || email || bio || role || department)) {
        throw new ApiError(400, "Atleast one filed is required")
    }

    // jadi sabu filed ku update kariba darkar eka ebele
    // if (!fullName || !email || !bio || !role || !department) {
    //     throw new ApiError(400, "All fileds are required")
    // }

    // Step3: update kariba pain data ku backend patheiba but ame kau user re update kariba, so first user find karib
    // update
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            // mongo operator
            $set: {
                fullName,
                // or fullName: fullName
                email,
                bio,
                role,
                department
            }
        },
        {new: true}    // new: true karidele update hela pare information asi ethi user re store hue
    ).select("-password")  // ame chanhune j update hela bela ame password au thare update hau so ame slect method re password ku hateidaba update ru

    // Step4: user ku return kariba gote response
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated"))

    // Step5: export karidaba

})

// file update (avatar)
const updateUserAvatar = asyncHandeler(async (req, res) => {
    // Step1 : user authentication ku check kariba user exist karuchi ki nahin, so
    if (!req.user) {
        throw new ApiError(401, "Unauthorized access")
    }

    // Step2: jadi user exist karuchi then taa ra user id find kariba
    // Step1: multer middle ware use kari file access kariba 
    const avatarLocalPath = req.file?.path  //  avatar jadi present achhi then taa ra path access kariba

    // check kariba avatarLocal path achhi na nahin
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    // Step2: jadi file path thik achi then avatar ku cloudinary re upload karidaba
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    // Step3: jadi avatar upload heijaichi but upload hela pare tara url miluni then error throw kara
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")  
    }

    // Step4: ebe update karidaba avatar ku
    const user = await User.findByIdAndUpdate(
        req.user?._id,  // a line user ku find kariba
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}   // new true kale updated avatar asi user re store hue
    ).select("-password") // user avatar update kala bele password update na heijau sethipain password filed ku hateidab update ru


    // Step5: jadi successfully update heijaichi then user ku gote response sned karidaba
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar successfully updated"))

})


// file update (coverImage)
const updateUserCoverImage = asyncHandeler(async (req, res) => {
    // Step1 : user authentication ku check kariba user exist karuchi ki nahin, so
    if (!req.user) {
        throw new ApiError(401, "Unauthorized access")
    }

    // Step2: jadi user exist karuchi then taa ra user id find kariba
    // Step1: multer middle ware use kari file access kariba 
    const coverImageLocalPath = req.file?.path  //  avatar jadi present achhi then taa ra path access kariba

    // check kariba avatarLocal path achhi na nahin
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    // Step2: jadi file path thik achi then avatar ku cloudinary re upload karidaba
    const coverImage = await uploadOnCloudinary(coverImageLocalPathLocalPath)

    // Step3: jadi avatar upload heijaichi but upload hela pare tara url miluni then error throw kara
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover image")  
    }

    // Step4: ebe update karidaba avatar ku
    const user = await User.findByIdAndUpdate(
        req.user?._id,  // a line user ku find kariba
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}   // new true kale updated avatar asi user re store hue
    ).select("-password") // user avatar update kala bele password update na heijau sethipain password filed ku hateidab update ru


    // Step5: jadi successfully update heijaichi then user ku gote response sned karidaba
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image successfully updated"))

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage
}