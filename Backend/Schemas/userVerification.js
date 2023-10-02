const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');
const Schema=mongoose.Schema;

const UserVerificationSchema=new Schema({

    userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date,


})

const Verification_Schema=mongoose.model('UserVerification',UserVerificationSchema );

module.exports=Verification_Schema;