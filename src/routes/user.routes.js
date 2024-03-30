import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../conrollers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
 
const router = Router()

router.route("/register").post(
    upload.fields([
         {
            name: "avatar",   // first file jau naba taku kau name re identify kariba
            maxCount: 1
         },
         {
             name: "coverImage",
             maxCount: 1
         }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes 
router.route("/logout").post(verifyJWT,logoutUser)


export default router