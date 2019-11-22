const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
// require dotenv and initialize config
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
//We use this to extract the JWT sent by the user
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

//Create a passport middleware to handle User login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async (username, password, done) => {
      try {
        //Find the user associated with the username provided by the user
        const user = await User.findOne({ where: { username } });
        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        //Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

//This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      // secret we used to sign our JWT
      secretOrKey: process.env.JWT_SECRET,
      // we expect the user to send the token as a query paramater with the name 'api_token' or
      // we expect the user to send the token as a body field with the name 'api_token' or
      // we expect the user to send the token as a Bearer token on Request header
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromBodyField("api_token"),
        ExtractJwt.fromUrlQueryParameter("api_token"),
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ])
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
