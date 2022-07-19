require("dotenv").config();
import jwt from "jsonwebtoken";

const nonSecurePaths = [
  "/logout",
  "/login",
  "/register",
  "/google",
  "/auth/google/callback",
  "/github",
  "/auth/github/callback",
  "/user/account",
  '/user/forgotPasswordUser',
  '/reset-password',
  '/user/updateInforUser',
  '/clinic/read',
  '/doctor-page',
  "/clinic-page",
  "/user/updatepassword",
  "/doctor/getAllDoctors",
  "/specialty/read",

  "/schedule/create",
  "/top-doctor-home",
  "/timeframe/read",
  "/booking/create",
  `/doctor-detail`,
  "/schedule-detail",
  "/doctor-modal",
]; //mảng này chứa các phần sẽ sẽ không được check quyền


const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: "365d",
    });
  } catch (e) {
    console.log("check error jwt token >>>", e);
  }

  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log("check error verify token", error);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

//huyên
function checkNoneSecureDetailPaths(path) {
  for (let item of nonSecurePaths) {
    if (item === path) return true;
  }
  return false;
}
//

const checkUserJwt = (req, res, next) => {

  //xác thực trước khi gửi xuống
  let check = checkNoneSecureDetailPaths(req.path);
  console.log("check được phép bỏ qua hay không , ", check, " check path hiện tại >>", req.path)
  if (
    check
  )
    return next(); //nếu path thuộc các đường dẫn không được phép check quyền thì

  let cookies = req.cookies; //lấy cookie từ client
  let tokenFromHeader = extractToken(req);
  console.log("check cooke và tooken từ header>>>", JSON.stringify(cookies.jwt), tokenFromHeader)
  // if ((cookies && JSON.stringify(cookies.jwt) !== undefined) || tokenFromHeader !== null) {
  //tạm thời app này chưa set header
  if ((cookies && cookies.jwtd) || tokenFromHeader) {
    //nếu tồn tại cookie đã được gửi trước đó
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    let decode = verifyToken(token);
    if (decode) {
      req.user = decode; //check phần trung gian gửi dữ liệu từ trung gian sang thằng tiếp theo để xác thực, đính kèm req
      req.token = token;
      next(); // chạy tiếp nè. bên phía sever sẽ nhận được xác thực từ thằng trong gian này, có đính kèm req.user
    } else {
      // nếu xác thực người dùng không đúng,(* trường hợp này là đã có cookie nhưng cookie không đúng)
      // return trạng thái luôn, để không chạy thằng sao. tới đây thì gợi là sever đã phản hồi
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Not authenticated the user",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Must login",
    });
  }
};

// const getClinicActive = (user)=>{
//   if()
// }
const checkUserPermission = (req, res, next) => {
  // xác thực quyền truy cập trước khi gửi đi
  if (
    checkNoneSecureDetailPaths(req.path)
  )
    return next(); //nếu path thuộc các đường dẫn không được phép check quyền thì
  if (req.user) {
    let email = req.user.email; //lấy email
    if (email === "admin@gmail.com") return next();
    let roles = req.user.groupWithRoles.Roles; //lấy quyền của các roles
    let currentUrl = req.path; //lấy link truy cập
    if (!roles || roles.length == 0) {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: "Bạn không có quyền truy cập tính năng",
      });
    }
    let canAccess = roles.some(
      (item) => item.url === currentUrl || currentUrl.includes(item.url)
    ); //duyệt hết phần tử trả ra trạng thái true or false
    // canAccess = true;// tạm dùng cho demo trên gihub
    if (canAccess === true) {
      next(); // nếu đúng thì được phép thực hiện tiếp cái sau
    } else {
      //còn nếu không đúng link
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: "Bạn không có quyền truy cập tính năng",
      });
    }
  } else {
    //khi khôgn có người dùng
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJwt,
  checkUserPermission,
};
