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

      Clinics.hasMany(models.Clinic_Specialty, {
        foreignKey: "clinicId",
      });

      Clinics.belongsTo(models.Provinces, {
        foreignKey: "provinceId",
      });

      Clinics.belongsToMany(models.Specialties, {
        through: "Clinic_Specialty",
        foreignKey: "clinicId",
      });
    }
  }
  Clinics.init(
    {
      image: DataTypes.STRING,

      nameVI: DataTypes.STRING,
      addressVI: DataTypes.STRING,
      descriptionHTML_VI: DataTypes.TEXT,
      descriptionMarkdown_VI: DataTypes.TEXT,

      nameEN: DataTypes.STRING,
      addressEN: DataTypes.STRING,
      descriptionHTML_EN: DataTypes.TEXT,
      descriptionMarkdown_EN: DataTypes.TEXT,

      provinceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Clinics",
    }
  );
  return Clinics;
};
