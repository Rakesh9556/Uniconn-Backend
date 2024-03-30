import { Router } from "express";
import { registerUser } from "../conrollers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
 
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

export default router