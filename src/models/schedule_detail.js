"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule_Detail.hasMany(models.Bookings, {
        foreignKey: "schedule_detail_id",
      });
      Schedule_Detail.belongsTo(models.Schedules, {
        foreignKey: "scheduleId",
      });
      Schedule_Detail.belongsTo(models.Timeframes, {
        foreignKey: "timeframeId",
      });
    }
  }
  Schedule_Detail.init(
    {
      scheduleId: DataTypes.INTEGER,
      timeframeId: DataTypes.INTEGER,
      currentNumber: DataTypes.INTEGER,
      maxNumber: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedule_Detail",
    }
  );
  return Schedule_Detail;
};
