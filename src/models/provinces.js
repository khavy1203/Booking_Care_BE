"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provinces extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Provinces.hasMany(models.Clinics, {
        foreignKey: "provinceId",
      });
    }
  }
  Provinces.init(
    {
      nameEN: DataTypes.STRING,
      nameVI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Provinces",
    }
  );
  return Provinces;
};
