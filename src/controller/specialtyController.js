import specialtyAPIService from "../service/specialtyAPIService";

let createSpecialty = async (req, res) => {
  try {
    let info = await specialtyAPIService.createSpecialty(req.body);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let updateSpecialty = (req, res) => {};
let deleteSpecialty = (req, res) => {};
let readSpecialty = (req, res) => {};

module.exports = {
  createSpecialty: createSpecialty,
  updateSpecialty: updateSpecialty,
  deleteSpecialty: deleteSpecialty,
  readSpecialty: readSpecialty,
};
