//Huyen
const db = require("../models");

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.nameVI ||
        !data.descriptionHTML_VI ||
        !data.descriptionMarkdown_VI ||
        !data.nameEN ||
        !data.descriptionHTML_EN ||
        !data.descriptionMarkdown_EN
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Specialties.create({
          imageBase64: data.imageBase64 || "",
          nameVI: data.nameVI,
          descriptionHTML_VI: data.descriptionHTML_VI,
          descriptionMarkdown_VI: data.descriptionMarkdown_VI,
          nameEN: data.nameEN,
          descriptionHTML_EN: data.descriptionHTML_EN,
          descriptionMarkdown_EN: data.descriptionMarkdown_EN,
        });
        resolve({
          errCode: 0,
          errMessage: "create specialty succeeds!!!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createSpecialty: createSpecialty,
};
