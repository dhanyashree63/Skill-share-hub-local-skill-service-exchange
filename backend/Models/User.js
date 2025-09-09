import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const UserModel = new mongoose.Schema({
    name:{
        type: String,
        required : [true, "Please Enter your name"]
    },

    email:{
        type: String,
        required : [true, "Please Enter your Email Address"],
        unique : true,
        validate : validator.isEmail,
    },

    password:{
    type: String,
    required : [true, "Please Enter your Password"],
    minlength : [6, "Password Must Be Atleast 6 characters"],
    select: false,
    validate: {
      validator: function(v) {
        // example options: minLength 6, require at least 1 lowercase, 1 uppercase, 1 number, 1 symbol
        return validator.isStrongPassword(v, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        });
      },
      message: "Password is not strong enough. Use mix of upper, lower, numbers and symbols."
      }
   },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },

    subscription: {
        id: {
            type: String,
            default: "",   
        },
        status: {
            type: String,
            default: "",
        },
    },

    avatar: {
        public_id: {
            type: String,
            required : true,
        },
        url: {
            type: String,
            required : true,
        }
    },

    playlist : [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        poster: String,
    }],

    createdAt: {
        type:Date,
        default: Date.now,
    },


    resetPasswordToken : String,
    resetPasswordExpire: Date,

});

UserModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  

UserModel.methods.getJWTToken = function () {

    const secret_key = process.env.JWT_SECRET_KEY;
    console.log(secret_key);
    
    return jwt.sign({ _id: this._id }, secret_key, {
      expiresIn: "15d",
    });
  };
  

UserModel.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserModel.methods.getResetToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken =  crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire =  Date.now() + 15 * 60 * 1000;


    return resetToken;
};


export const User = mongoose.model('User', UserModel);
