"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Huyên: thêm alias để dùng cho bookingAPIService
      Bookings.belongsTo(models.Users, {
        as: "Doctor",
        foreignKey: "doctorId",
      });
      Bookings.belongsTo(models.Users, {
        as: "Patient",
        foreignKey: "patientId",
      });
      Bookings.belongsTo(models.Schedule_Detail, {
        foreignKey: "scheduleDetailId",
      });

      Bookings.belongsTo(models.Bookingstatus, { foreignKey: "statusId" });

      //Huyên: thêm để truy vấn cho booking
      Bookings.belongsTo(models.Clinics, { foreignKey: "clinicId" });
    }
  }
  Bookings.init(
    {
      statusId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      scheduleDetailId: DataTypes.INTEGER,
      reason: DataTypes.TEXT,
      note: DataTypes.TEXT,
      date: DataTypes.DATE,
      // timestamp: DataTypes.STRING,
      clinicId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bookings",
    }
  );
  return Bookings;
};
