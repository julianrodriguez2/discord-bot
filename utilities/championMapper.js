// utilities/championMapper.js

const championsData = require("../data/champions.json");

function getChampionNameById(championId) {
  console.log("Requested championId:", championId);
  const champions = championsData.data;
  let championName = "Unknown Champion";
  Object.keys(champions).forEach((key) => {
    if (champions[key].key == championId.toString()) {
      championName = champions[key].id;
    }
  });

  return championName;
}

function getChampionImage(championId) {
  const version = "11.24.1";
  const championName = getChampionNameById(championId);
  const imageUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
  return imageUrl;
}

module.exports = { getChampionNameById, getChampionImage };
