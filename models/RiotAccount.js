const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");

const RiotAccount = sequelize.define("RiotAccount", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "userId",
    },
  },
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
  summonerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  summonerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = RiotAccount;
