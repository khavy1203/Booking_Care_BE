import express from "express";
import initApiRoutes from "./routes/api";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import configCors from "./config/cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

import './middleware/PPConfig';

require("dotenv").config();

const app = express();


configCors(app); // cors cho trang web



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//Huyên: limit cho phép gửi request tối thiểu 50mb
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


app.use(cookieParser()); // read cookies (needed for auth)

app.use(session({
  secret: 'somethingsecretgoeshere',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
//passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//init web initWebRoutesnpx sequelize-cli init
//config view engine
configViewEngine(app);
initApiRoutes(app);

app.use((req, res) => {
  //xử lý khi link vào 1 link bất kì mà không tồn tại
  return res.send("404 not found");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("jwt nodejs " + PORT);
});

console.log(process.env.PORT);
