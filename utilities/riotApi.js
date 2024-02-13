const axios = require("axios");

// Replace 'YOUR_RIOT_API_KEY_HERE' with your actual Riot Games API key
const { riotKey } = require("../config.json");

// Utility function to get the platform routing value for a given region
// Adjust the mapping as necessary based on Riot's API documentation
// eslint-disable-next-line no-unused-vars
const getPlatformRouting = (region) => {
  const regionMapping = {
    na1: "americas",
    euw1: "europe",
    eun1: "europe",
    kr: "asia",
    // Add other regions as needed
  };
  return regionMapping[region.toLowerCase()] || "americas";
};

// Fetches a summoner's ID by their summoner name and region
async function getSummonerIdByName(summonerName) {
  const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
    summonerName
  )}?api_key=${riotKey}`;
  try {
    const response = await axios.get(url);
    return response.data.id;
  } catch (error) {
    console.error(`Failed to fetch summoner ID for ${summonerName}:`, error);
    return null;
  }
}

// Fetches a summoner's PUUID
async function getSummonerPUUID(gameName, tagline) {
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(tagline);
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}?api_key=${riotKey}`;
  try {
    const response = await axios.get(url);
    if (response.data && response.data.puuid) {
      console.log(`PUUID: ${response.data.puuid}`);
      return response.data.puuid;
    } else {
      console.error("PUUID not found in response:", response.data);
      return null;
    }
  } catch (error) {
    console.error(
      `Failed to fetch PUUID for ${gameName}#${tagline}:`,
      error.response ? error.response.data : error
    );
    return null;
  }
}

// Checks if a summoner is currently in a game
async function getCurrentGameBySummonerId(encryptedSummonerId) {
  // const platformRouting = getPlatformRouting(region);
  const url = `https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}?api_key=${riotKey}`;
  try {
    const response = await axios.get(url);
    return response.data.gameMode;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(
        `Summoner ${encryptedSummonerId} is not currently in a game.`,
        error
      );
    } else {
      console.error(
        `Error fetching current game for summoner ${encryptedSummonerId}:`,
        error
      );
    }
    return null;
  }
}

async function getChampionMastery(encryptedPUUID) {
  const url = `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${encryptedPUUID}?api_key=${riotKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch summoner mastery for ${encryptedPUUID}:`,
      error
    );
    return null;
  }
}

module.exports = {
  getSummonerIdByName,
  getCurrentGameBySummonerId,
  getSummonerPUUID,
  getChampionMastery,
};
