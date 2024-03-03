const axios = require("axios");

// Replace 'YOUR_RIOT_API_KEY_HERE' with your actual Riot Games API key
const { riotKey } = require("../config.json");

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

async function getSummonerIdByPUUID(encryptedPUUID) {
  const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}?api_key=${riotKey}`;
  try {
    const response = await axios.get(url);
    console.log(`Summoner ID: ${response.data.puuid}`);
    return response.data.id;
  } catch (error) {
    console.error(`Failed to fetch summoner ID for ${encryptedPUUID}:`, error);
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
    console.log(response.data);
    return response.data;
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

async function getRankedSummonerLeagueInfo(summonerID) {
  const url = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${riotKey}`;
  try {
    const response = await axios.get(url);
    const soloQueueInfo = response.data.find(
      (entry) => entry.queueType === "RANKED_SOLO_5x5"
    );
    if (soloQueueInfo) {
      return {
        tier: soloQueueInfo.tier,
        rank: soloQueueInfo.rank,
        lp: soloQueueInfo.leaguePoints,
        wins: soloQueueInfo.wins,
        losses: soloQueueInfo.losses,
        winstreak: soloQueueInfo.winstreak,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCurrentChampionRotation() {
  const url = `https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${riotKey}`;
  try {
    const response = await axios.get(url);
    return response.data.freeChampionIds;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  getSummonerIdByName,
  getCurrentGameBySummonerId,
  getSummonerPUUID,
  getChampionMastery,
  getSummonerIdByPUUID,
  getRankedSummonerLeagueInfo,
  getCurrentChampionRotation,
};
