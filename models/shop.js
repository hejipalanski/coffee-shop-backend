'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    franchisee: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Shop.associate = function(models) {
    // associations can be defined here
  };
  return Shop;
};