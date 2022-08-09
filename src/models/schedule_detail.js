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
        foreignKey: "scheduleDetailId",
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
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      scheduleId: DataTypes.INTEGER,
      timeframeId: DataTypes.INTEGER,
      currentNumber: DataTypes.INTEGER, //số lượng lịch hẹn cần khám
      bookedNumber: DataTypes.INTEGER, //số lượng lịch hẹn thực tế
      maxNumber: DataTypes.INTEGER, //Số lượng lịch hẹn tối đa
    },
    {
      sequelize,
      modelName: "Schedule_Detail",
    }
  );
  return Schedule_Detail;
};
