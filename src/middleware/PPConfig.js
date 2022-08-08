// login google API
require("dotenv").config();
import passport from "passport";
import db from "../models/index";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const URL_GOOGLE_CALLBACK = "/api/v1/auth/google/callback";
const URL_GITHUB_CALLBACK = "/api/v1/auth/github/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: URL_GOOGLE_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, done) {
      const currentUser = await db.Users.findOne({
        where: { googleId: profile.id },
      });
      if (!currentUser) {
        //nếu chưa tạo
        // chưa có thì tạo
        console.log("check profile >>>>", profile);
        const user = await db.Users.create({
          email: profile.emails[0].value,
          username: profile.displayName,
          genderId: 1, //1 nam, 2 là nữ
          groupId: 3, //3 là khách hàng, 1 là admin,  2 là bác sĩ
          googleId: profile.id,
        });
      }
      done(null, profile);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: URL_GITHUB_CALLBACK,
    },
    async function (accessToken, refreshToken, profile, done) {
      const currentUser = await db.Users.findOne({
        where: { githubId: profile.id },
      });
      if (!currentUser) {
        //nếu chưa tạo
        // chưa có thì tạo
        console.log("check profile >>>>", profile);
        const user = await db.Users.create({
          email: profile.username + "@gmail.com",
          username: profile.displayName,
          genderId: 1, //1 nam, 2 là nữ
          groupId: 3, //3 là khách hàng, 2 là admin,  1 là bác sĩ
          githubId: profile.id,
        });
      }
      done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
