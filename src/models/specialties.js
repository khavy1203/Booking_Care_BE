"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialties extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialties.hasMany(models.Users, {
        foreignKey: "specialtyId",
      });

    }
  }
  Specialties.init(
    {
      image: DataTypes.STRING,
      nameVI: DataTypes.STRING,
      descriptionHTML_VI: DataTypes.TEXT,
      descriptionMarkdown_VI: DataTypes.TEXT,
      nameEN: DataTypes.STRING,
      descriptionHTML_EN: DataTypes.TEXT,
      descriptionMarkdown_EN: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialties",
    }
  );
  return Specialties;
};
