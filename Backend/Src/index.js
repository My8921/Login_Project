const express=require('express');
require("dotenv").config();
const app=express();
const mongoose=require('mongoose');
app.use(express.json());
require("../Schemas/UserDetails");
const cors=require("cors");
app.use(cors());
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const JWT_SECRET="My name is Ahmad";

const user_verificaton=require('../Schemas/userVerification');

const nodemailer=require('nodemailer');

const {v4:uuidv4}=require('uuid');

require('dotenv').config();








let transporter=nodemailer.createTransport({
service:"gmail",
host: 'smtp.gmail.com',
port: 465,
secure: true,
debug:true,
secureConnection:false,
auth:{
  user:"Ahmadali43a2@gmail.com",
  pass:"tybd wgmy hgne bewy"
},
tls:{
  rejectUnauthorized:false
}
})

transporter.verify((error,success)=>{

  if(error){
    console.log("showing error"+error);
  }
  else{
    console.log("Ready for message");
    console.log(success);
  }
})








const mongoUrl="mongodb://localhost:27017/rockBlocks";

mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  }).then(()=>{
console.log("yes it is working");
  }).catch((err)=>{
console.log("They have an error",err);
  });


  const User=mongoose.model('UserDetail');


//send Verificatoin email
const sendVerficatoinEmail=({_id,email},res)=>{

const current_url="http://localhost:4000/";
const unique_string=uuidv4() + _id;


//mail options

const mailOptions={

from:"ahmadali43a2@gmail.com",
to:email,
subject:"Verify your email",
html:`<p>verify your email address to complete the  signup and login process</p> 
<p>This link <b> expires in 6 hours </b> </p> <p> <a href=${current_url + "verify/" + 
_id + "/" + unique_string } >here</a> to procced .</p>`,
};

//hashing the unique string 

const saltRounds=10;
bcrypt.hash(unique_string,saltRounds).then((hashedustring)=>{

const newUserVerification=new user_verificaton({
  userId:_id,
  uniqueString:hashedustring,
  createdAt:Date.now(),
  expiresAt:Date.now()+216000000,

})
newUserVerification.save().then(()=>{

    transporter.sendMail(mailOptions).then(()=>{ 
      
      
      res.json({
          status:"ok",
          message:"Verification email sent",
       });  } ).catch((error)=>{
      res.json({
        staus:"failed",
        message:"failed to sent verification email",
      })
    });
  
  console.log("yes i succesfully verified");
  }
).catch((error)=>{

  res.json({
    staus:"failed",
    message:"Could not save verification email data",
  })

});


}).catch((error)=>{
 res.json({
    staus:"failed",
    message:"An error occured while  hashing the data",
  })

})
}


//verify email

app.get("/verify/:userId/:uniqueString",(req,res)=>{



let {userId,uniqueString} = req.params;
user_verificaton.find({userId}).then(

  (result)=>{
    if(result.length > 0){
      //user verification record exisit
      const{expiresAt}=result[0];
      const hasheduniqueString=result[0].uniqueString;
      if(expiresAt <Date.now()){
        //token not expired
          user_verificaton.deleteOne({userId}).then((

            
          )=>{
User.deleteOne({_id}).then(()=>{

  res.send("Link has expied please Sign up again");
}).catch((error)=>{

});

          }).catch( (err)=>{
            res.send("An error occured while clearing the expire record");
          });
      }

      else{

bcrypt.compare(uniqueString,hasheduniqueString).then((result)=>{
if(result){
User.updateOne({_id:userId},{verified:true}).then((result)=>{
user_verificaton.deleteOne({userId}).then((result)=>{}).catch((error)=>{});
res.send("Successfully verified the user");

}).catch( (err)=>{});
}
else{
  res.send("invalid credentials passed");
}
}).catch((error)=>{
res.send("An error occured while comparing unique string");

});

      }
    }
    else{
      //not exisist

      let message="An error occured while checking for exsisting user record"
      res.redirect(`/user/verified/error=true&message=${message}`);
      
    }
  }
).catch((error)=>{
  console.log(error);
  let message="An error occured while checking for exsisting user record"
  res.redirect(`/user/verified/error=true&message=${message}`);
});

});

app.get("/verified",(req,res)=>{
  res.sendFile
})


  //SignUp Here
  app.post("/register",async(req,res)=>{
const {name,email,password}=req.body;
const encryptedPassword =await bcrypt.hash(password,10);

try{
  const olduser= await User.findOne({email});
  if(olduser)
  {
 return res.json({status:"failed",message:"User already exists"});
  }
   const new_user= await User.create({
        name:name,
        email:email,
        password:encryptedPassword,
        verified:false,
    });
   

new_user.save().then((result) => {

  sendVerficatoinEmail(result,res);

}).catch((err) => {

  res.json({
    staus:"failed",
    message:"An error occured while saving the user",
  })
});




}
catch(error){
  
    res.send({status: "failed", message: "An error occured while saving the user"});
}
  });

  app.post("/login-user",async(req,res)=>{
    const {email,password}=req.body;
    const user= await User.findOne({email});


    if(!user)
    {
   return res.json({ status:"failed",message:"User Not Found"}); 

   }








   if(await bcrypt.compare(password,user.password)){
const token=jwt.sign({email:user.email},JWT_SECRET);

if(res.status(201))
{
  if(!user.verified)
  {
  return  res.json({
      status:"failed",
      message:"email has not been verified",
    })
  }



else{
  return res.json({status:"ok",message:"Succesfully logged in",data:token});
}
}

   }
   res.json({status:"failed",message:"Invalid Password"});

  }
  );
  app.post("/Dashboard",async(req,res)=>{
const token=req.body;
try {
  
  const user=jwt.verify(token,JWT_SECRET);
  const useremail=user.email;
  user.findOne({email:useremail}).then(data=>{
res.send({status:"Successfully logged in",data:data});
  }).catch((error)=>{
res.send({error:"Invalid Credentials failed to login",data:error});
});

  }
  catch(error){}});
app.listen(4000,()=>{
console.log("port is connected");
});