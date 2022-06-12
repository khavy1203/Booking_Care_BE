'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bookingstatus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Bookingstatus.hasMany(models.Bookings, {
                foreignKey: 'statusId'
            });
        }
    }
    Bookingstatus.init({
        nameEN: DataTypes.STRING,
        nameVI: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Bookingstatus',
    });
    return Bookingstatus;
};