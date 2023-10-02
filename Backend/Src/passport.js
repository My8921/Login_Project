const GoggleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
    new GoggleStrategy({
clientID:process.env.CLIENT_ID,
callbackURL:"auth/google/callback",
    },
    function(accessToken, refreshToken,profile,callback){
        callback(null,profile);
    }
    ),

);

passport.serializeUser((user,done)=>{
done(null,user);
});

passport.deserializeUser((user,done)=>{
    done(null,user);

});