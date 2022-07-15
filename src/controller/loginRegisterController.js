require("dotenv").config();
import loginRegisterNewUser from "../service/loginRegisterService";
import ppService from "../service/PPService"; //passport service
const handleRegister = async (req, res) => {
  try {
    //email, phone, username, password * validate phía sever
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.username
    ) {
      return res.status(200).json({
        EM: "Missing requeried parameters", //error message
        EC: "1", //error code post
        DT: "",
      });
    }
    if (req.body.password.length < 6) {
      return res.status(200).json({
        EM: "Your password must have more than 6 letters", //error message
        EC: "1", //error code post
        DT: "",
      });
    }
    //service * call service create user
    let data = await loginRegisterNewUser.registerNewUser(req.body);
    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
const handleLogin = async (req, res) => {
  //call login service
  try {
    let data = await loginRegisterNewUser.loginUser(req.body);
    if (data && data.DT && data.DT.access_token) {
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      }); //gửi kèm cookies về phía client khi đăng nhập thành công
    }
    res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
const handleLogout = (req, res) => {
  //call logout service
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      EM: "Clear cookie successfully",
      EC: 0,
      DT: "",
    });
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};

const handleLoginPPGoogleSuccess = async (req, res) => {
  //call logout service
  try {
    if (req.user) {
      let data = await ppService.loginPPGoogle(req.user);
      if (data && data.DT && data.DT.access_token) {
        res.cookie("jwt", data.DT.access_token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        }); //gửi kèm cookies về phía client khi đăng nhập thành công
        res.redirect(process.env.REACT_URL + "/home");
      }
    } else {
      res.status(200).json({
        EM: "không có user trong req",
        EC: 1,
        DT: "",
      });
    }
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
const handleLoginPPGithubSuccess = async (req, res) => {
  //call logout service
  try {
    if (req.user) {
      let data = await ppService.loginPPGithub(req.user);
      if (data && data.DT && data.DT.access_token) {
        res.cookie("jwt", data.DT.access_token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.redirect(process.env.REACT_URL + "/home");

      }
    } else {
      res.status(200).json({
        EM: "không có user trong req",
        EC: 1,
        DT: "",
      });
    }
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
const logoutPPGoogle = (req, res) => {
  //call logout service
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      EM: "Clear cookie successfully",
      EC: 0,
      DT: "",
    });
  } catch (e) {
    console.error("check error: ", e);
    return res.status(500).json({
      EM: "error from sever", //error message
      EC: "-1", //error code
      DT: "",
    });
  }
};
module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleLoginPPGoogleSuccess,
  handleLoginPPGithubSuccess,
  logoutPPGoogle,
};
