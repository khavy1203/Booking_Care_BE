import express from "express";
import initApiRoutes from "./routes/api";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import configCors from "./config/cors";
// var cors = require("cors");
//
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB";
require("dotenv").config();

const app = express();
configCors(app); // cors cho trang web

//dùng tạm
//app.use(cors());
//

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//Huyên: limit cho phép gửi request tối thiểu 50mb
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb" }, { extended: true }));

app.use(cookieParser()); // thêm cookie đẩy về phía sever

//init web initWebRoutesnpx sequelize-cli init
//config view engine
configViewEngine(app);
// initWebRoutes(app);
initApiRoutes(app);

app.use((req, res) => {
  //xử lý khi link vào 1 link bất kì mà không tồn tại
  return res.send("404 not found");
});

//kết nối DB
connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("jwt nodejs and react " + PORT);
});

console.log(process.env.PORT);
