"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Users.belongsTo(models.Specialties, {
        foreignKey: "specialtyId",
      });

      Users.hasOne(models.Doctorinfo, {
        foreignKey: "doctorId",
      });

      Users.belongsTo(models.Clinics, {
        foreignKey: "clinicId",
      });

      Users.hasMany(models.Bookings, {
        foreignKey: "doctorId",
      });
      Users.hasMany(models.Bookings, {
        foreignKey: "patientId",
      });

      Users.hasMany(models.Schedules, {
        foreignKey: "doctorId",
      });

      Users.belongsTo(models.Group, { foreignKey: "groupId" });
    }
  }
  Users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      genderId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      googleId: DataTypes.STRING,
      githubId: DataTypes.STRING,
      facebookId: DataTypes.STRING,
      active: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
