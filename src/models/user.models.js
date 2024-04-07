import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true  // make fields searchable

        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullName: {
            type: String,
            required: true,
            index: true
        }, 

        avatar: {
            type: String,  //cloudanry
            required: true, 
        },

        bio: {
            type: String,  
        },

        posts: [
            { 
                type: Schema.Types.ObjectId,
                ref: "Post"
            }
        ],

        role: {
            type: Schema.Types.ObjectId,
            ref: "User_role"
        },

        department: {
            type: Schema.Types.ObjectId,
            ref: "Department"
        },

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        refreshToken: {
            type: String
        }  
    }, 
    
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(next){   // jebe jebe save haba setethara db ku request send haba sabu ku update kariba pain
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){  // compare both password bycrypt password and user entered password 
     return await bcrypt.compare(password, this.password)    // password change pain a method help kariba
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)



