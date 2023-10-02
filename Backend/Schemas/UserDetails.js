const mongoose=require('mongoose');


const UserDetail=new mongoose.Schema(

    {
name:String,
email:{type:String, unique:true},
password:String,
verified:Boolean
    },
    {
collection:"User_Details",
    }
);

mongoose.model('UserDetail',UserDetail);