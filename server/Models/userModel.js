import mongoose from "mongoose";

const userShema =new mongoose.Schema({
    name : {type:String,required:true},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:true, unique:true},
    verifyOtp:{type:String,default:''},
    verifyOtpExpireAt:{type:Number,default:0},
    isVerified:{type:Boolean,default:false},
    resetOtp:{type:String,default:''},
    resetOtpExpireAt:{type:Number,default:0},
})

const userModel = mongoose.models.User || mongoose.model("User", userShema);
export default userModel;