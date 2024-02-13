const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const RiotAccount = sequelize.define("RiotAccount", {
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  puuid: { type: DataTypes.STRING, allowNull: true },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serverId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RiotAccount;
