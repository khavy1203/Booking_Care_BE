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

      Users.hasMany(models.Doctor_Specialty, {
        foreignKey: "doctorId",
      });
      Users.hasOne(models.Doctorinfo, {
        foreignKey: "doctorId",
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
      Users.belongsTo(models.Genders, { foreignKey: "genderId" });

      Users.belongsTo(models.Group, { foreignKey: "groupId" });

      Users.belongsTo(models.Clinics, { foreignKey: "clinicId" });

      //Huyên: định nghĩa lại quan hệ n-n
      Users.belongsToMany(models.Specialties, {
        through: "Doctor_Specialty",
        foreignKey: "doctorId",
      });
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
      clinicId: DataTypes.INTEGER,
      googleId: DataTypes.STRING,
      githubId: DataTypes.STRING,
      facebookId: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
