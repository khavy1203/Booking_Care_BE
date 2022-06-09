"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedules.hasMany(models.Schedule_Detail, {
        foreignKey: "scheduleId",
      });
      Schedules.belongsTo(models.Users, { foreignKey: "doctorId" });
    }
  }
  Schedules.init(
    {
      date: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedules",
    }
  );
  return Schedules;
};
