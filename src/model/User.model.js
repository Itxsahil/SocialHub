import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt"// it uses for encription and decreption
import Jwt from "jsonwebtoken";




const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim : true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim : true
        },
        fullname: {
            type: String,
            required: true,
            maxlength: 14,
            minlength: 2
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        avatar: {
            type: String,//true
            default: "https://greekherald.com.au/wp-content/uploads/2020/07/default-avatar.png"
        },
        coverImage: {
            type: String,
            default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVuC3gaBt0ChFn0jqQsIvU_P1YiQKHRk5cdQ&s"
        },
        refreshToken:{
            type : String,
            default: ""
        },
        watchHistory: {
            type: Types.ObjectId,
            ref: "Video"
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})//it encrypt the passwrd field if it is the field to be update

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)//it  returns a boolian value by comparing the encrypeted password and the plain text password
}//we can create a number of custom methodes like this by using "methodes"

userSchema.methods.generateAcessToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRfreshToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = model('User', userSchema)
