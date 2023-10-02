const router=require("express").Router();
const { Router } = require("express");
const passport=require("passport");
router.get(
    "/google/callback",
    passport.authenticate("google",{
        successRedirect:process.env.CLIENT_URL,
       failureRedirect:"/login/failed", 
    })
)

router.get("/login/success",(req,res)=>{


if(req.user){

    res.status(200).json({
error:false,
message:"successfully logged in",
user:req.user
    });
}
else{
    res.status(403).json({error:true,message:"not authorized"});
}

});

router.get("/login/failed",(req,res)=>{
    res.status(401).json({
    error:true,
    message:"login failed",
    })
})

router.get("/google",passport.authenticate("google",["profile","email"]));

module.exports=router;