import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const shopSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please enter your shop name!!"],
    },
    email: {
        type: String, 
        unique: true,
        required: [true, "Please enter your shop email address!!"],
    },
    password: {
        type: String, 
        required: [true, "Please enter your password!!"],
        minLength: [6,"Password should be greater than 6 characters!!"],
        select: false
    },
    address: {
        type: String, 
        required: true
    },
    phone: {
        type: Number, 
        required: true
    },
    description: {
        type: String, 
    },
    role: {
        type: String,
        default: "user" 
    },
    avatar: {
        type: String, 
        required: true
    },
    zipCode: {
        type: Number, 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now() 
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});

// Hash password
shopSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
});

// Jwt token
shopSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// Compare password
shopSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};



export default mongoose.model("Shop", shopSchema)
