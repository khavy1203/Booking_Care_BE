"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctorinfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctorinfo.belongsTo(models.Users, { foreignKey: "doctorId" });
    }
  }
  Doctorinfo.init(
    {
      introductionVI: DataTypes.STRING,
      noteVI: DataTypes.STRING,
      paymentVI: DataTypes.STRING,
      descriptionHTLM_VI: DataTypes.TEXT,
      descriptionMarkdown_VI: DataTypes.TEXT,
      degree_VI: DataTypes.STRING,

      introductionEN: DataTypes.STRING,
      noteEN: DataTypes.STRING,
      paymentEN: DataTypes.STRING,
      descriptionHTLM_EN: DataTypes.TEXT,
      descriptionMarkdown_EN: DataTypes.TEXT,
      degree_EN: DataTypes.STRING,

      price: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctorinfo",
    }
  );
  return Doctorinfo;
};
