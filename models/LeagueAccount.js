const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");

const LeagueAccount = sequelize.define("LeagueAccount", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "userId",
    },
  },
  customGamesWon: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lp: { type: DataTypes.INTEGER, allowNull: true },
  rank: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wins: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  losses: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  level: { type: DataTypes.INTEGER, allowNull: true },
  hotStreak: { type: DataTypes.BOOLEAN, allowNull: true },
});

module.exports = LeagueAccount;
