"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinics.hasMany(models.Users, { foreignKey: "clinicId" });

      Clinics.hasMany(models.Schedules, { foreignKey: "clinicId" });

    }
  }
  Clinics.init(
    {
      image: DataTypes.STRING,
      phoneContact: DataTypes.STRING,

      nameVI: DataTypes.STRING,
      addressVI: DataTypes.STRING,
      descriptionHTML_VI: DataTypes.TEXT,
      descriptionMarkdown_VI: DataTypes.TEXT,

      nameEN: DataTypes.STRING,
      addressEN: DataTypes.STRING,
      descriptionHTML_EN: DataTypes.TEXT,
      descriptionMarkdown_EN: DataTypes.TEXT,
      timework: DataTypes.STRING,
      provinceId: DataTypes.INTEGER,
      districtId: DataTypes.INTEGER,
      wardId: DataTypes.INTEGER,
      linkfile: DataTypes.STRING,

      status: DataTypes.INTEGER,//0 đợi duyệt, 1 là hoạt động, 2 là tạm dừng

    },
    {
      sequelize,
      modelName: "Clinics",
    }
  );
  return Clinics;
};
