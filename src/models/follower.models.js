import mongoose, {Schema} from "mongoose";


const followerSchema = new Schema({
    followedBy : {
        type: Schema.Types.ObjectId, //  followed by whom whom
        ref: "User"
    },
    followingTo: {
        type: Schema.Types.ObjectId, //  follwing whom whom
        ref: "User"
    }
},{timestamps: true}
)


export const Follower = mongoose.model("Follower", followerSchema)