"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timeframes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Timeframes.hasMany(models.Schedule_Detail, {
        foreignKey: "timeframeId",
      });
    }
  }
  Timeframes.init(
    {
      nameEN: DataTypes.STRING,
      nameVI: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Timeframes",
    }
  );
  return Timeframes;
};
