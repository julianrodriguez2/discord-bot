// utilities/championMapper.js

const championsData = require("../data/champions.json");

function getChampionNameById(championId) {
  const champions = championsData.data;
  let championName = "Unknown Champion";
  Object.keys(champions).forEach((key) => {
    if (champions[key].key == championId.toString()) {
      championName = champions[key].id;
    }
  });

  return championName;
}

module.exports = { getChampionNameById };
