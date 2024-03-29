import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
    {
        imgFile: {
            type: String,  //cloudnary
            required: true
        },
        videoFile: {
            type: String,
            required: true
        },

        caption: {
            type: String,
            required: true
        },

        views: {
            type: Number,
            default: 0,
            required: true
        },

        isPublished: {
            type: Boolean,
            default: true
        }, 
          
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {
        timestamps: true
    }
)
 
postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema)