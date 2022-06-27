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
      Bookings.belongsTo(models.Users, { foreignKey: "doctorId" });
      Bookings.belongsTo(models.Users, { foreignKey: "patientId" });
      Bookings.belongsTo(models.Schedule_Detail, {
        foreignKey: "schedule_detail_id",
      });
      Bookings.belongsTo(models.Bookingstatus, { foreignKey: "statusId" });
    }
  }
  Bookings.init(
    {
      statusId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      schedule_detail_id: DataTypes.INTEGER,
      date: DataTypes.STRING,
      // date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Bookings",
    }
  );
  return Bookings;
};
