const { EmbedBuilder } = require("discord.js");

const activeSessions = new Map();
// const LeagueAccount = require("../models/LeagueAccount");
// const RiotAccount = require("../models/RiotAccount");

// async function fetchRiotAccountData(userIds) {
//   const riotAccounts = await RiotAccount.findAll({
//     where: {
//       userId: userIds,
//     },
//   });

//   return riotAccounts;
// }

// async function fetchPlayerData(playerIds) {
//   const playersData = await LeagueAccount.findAll({
//     where: {
//       userId: playerIds,
//     },
//   });

//   return playersData;
// }

// async function prepareSessionPlayers(session) {
//   const playerIds = session.players.map((player) => player.userId);

//   const playersData = await fetchPlayerData(playerIds);
//   const riotAccountsData = await fetchRiotAccountData(playerIds);

//   session.players.forEach((player) => {
//     const playerData = playersData.find(
//       (data) => data.userId === player.userId
//     );

//     const riotData = riotAccountsData.find(
//       (data) => data.userId === player.userId
//     );

//     if (playerData) {
//       player.rank = playerData.rank;
//       player.lp = playerData.lp;
//       player.customGamesWon = playerData.customGamesWon;
//       player.tier = playerData.tier;
//       player.wins = playerData.wins;
//       player.losses = playerData.losses;
//       player.hotStreak = playerData.hotStreak;
//     }

//     if (riotData) {
//       player.summonerName = riotData.summonerName;
//       player.level = riotData.level;
//     }
//   });
// }

function calculatePlayerScore(player) {
  const playerRank = getRankValue(player.rank);
  const playerLP = player.lp / 100;
  const playerLevel = player.level / 100;
  const playerCustomWins = player.customGamesWon;
  const playerTier = getTierValue(player.tier);
  const totalGames = player.wins + player.losses;
  const winrate = player.wins / totalGames;

  let playerWinrate;

  if (winrate < 0.5 && winrate >= 0) {
    playerWinrate = winrate - 1;
  } else if (winrate >= 0.5 && winrate < 1) {
    playerWinrate = winrate;
  } else {
    playerWinrate = 1;
  }

  const totalPlayerScore =
    playerRank +
    playerLP +
    playerLevel +
    playerCustomWins +
    playerTier +
    playerWinrate;

  console.log(`Player: ${player.summonerName}: ${totalPlayerScore}`);

  return totalPlayerScore;
}

function getTierValue(tier) {
  const tierValues = {
    I: 0.8,
    II: 0.6,
    III: 0.4,
    IV: 0.2,
  };
  return tierValues[tier.toUpperCase()] || 0;
}

function getRankValue(rank) {
  const rankValues = {
    IRON: 1,
    BRONZE: 2,
    SILVER: 3,
    GOLD: 4,
    PLATINUM: 5,
    DIAMOND: 6,
    MASTER: 7,
    GRANDMASTER: 8,
    CHALLENGER: 9,
  };
  return rankValues[rank.toUpperCase()] || 0;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function assignPlayersToRoles(players) {
  shuffleArray(players);

  const roles = { top: [], jungle: [], mid: [], bot: [], support: [] };

  const pendingPlayers = [];

  players.forEach((player) => {
    let assigned = false;
    for (const preference of player.rolePreferences) {
      if (roles[preference].length < 2) {
        roles[preference].push({ ...player, assignedRole: preference });
        assigned = true;
        break;
      }
    }
    if (!assigned) pendingPlayers.push(player);
  });

  pendingPlayers.forEach((player) => {
    const rolesByCount = Object.entries(roles).sort(
      (a, b) => a[1].length - b[1].length
    );
    for (const [role, playersInRole] of rolesByCount) {
      if (playersInRole.length < 2) {
        roles[role].push({ ...player, assignedRole: role });
        return;
      }
    }

    const randomRole = rolesByCount[0][0];
    roles[randomRole].push({ ...player, assignedRole: randomRole });
  });

  return [].concat(...Object.values(roles));
}

function calculateTeamScore(team) {
  return team.reduce(
    (totalScore, player) => totalScore + calculatePlayerScore(player),
    0
  );
}

function balanceTeamsBySwappingPlayers(teamA, teamB) {
  const attemptedSwaps = new Set();
  let improvementPossible = true;

  while (improvementPossible) {
    const teamAScore = calculateTeamScore(teamA);
    const teamBScore = calculateTeamScore(teamB);
    console.log(
      `Pre-Swap - Team A Score: ${teamAScore}, Team B Score: ${teamBScore}`
    );

    const currentDifference = Math.abs(teamAScore - teamBScore);

    const potentialSwaps = findPotentialSwaps(
      teamA,
      teamB,
      attemptedSwaps,
      currentDifference
    );
    if (potentialSwaps.length === 0) {
      improvementPossible = false;
      break;
    }

    const swap = potentialSwaps[0];
    console.log(
      `Performing swap: Player ${swap.aIndex} from Team A with Player ${swap.bIndex} from Team B`
    );

    performSwap(teamA, teamB, swap);

    attemptedSwaps.add(swapKey(swap.aIndex, swap.bIndex));

    const newTeamAScore = calculateTeamScore(teamA);
    const newTeamBScore = calculateTeamScore(teamB);
    console.log(
      `Post-Swap - Team A Score: ${newTeamAScore}, Team B Score: ${newTeamBScore}`
    );
    console.log(teamA);
    console.log(teamB);

    const newDifference = Math.abs(newTeamAScore - newTeamBScore);

    if (newDifference >= currentDifference) {
      improvementPossible = false;
      console.log("Swap did not improve balance, ending balancing process.");
    }
  }
}

function findPotentialSwaps(teamA, teamB, attemptedSwaps, currentDifference) {
  const potentialSwaps = [];
  for (let i = 0; i < teamA.length; i++) {
    for (let j = 0; j < teamB.length; j++) {
      if (attemptedSwaps.has(swapKey(i, j))) continue;

      const newDifferenceAfterSwap = calculateNewDifference(teamA, teamB, i, j);
      if (newDifferenceAfterSwap < currentDifference) {
        potentialSwaps.push({
          aIndex: i,
          bIndex: j,
          newDifference: newDifferenceAfterSwap,
        });
      }
    }
  }
  console.log(`Found ${potentialSwaps.length} potential swaps.`);
  return potentialSwaps.sort((a, b) => a.newDifference - b.newDifference);
}

function performSwap(teamA, teamB, swap) {
  const temp = teamA[swap.aIndex];
  teamA[swap.aIndex] = teamB[swap.bIndex];
  teamB[swap.bIndex] = temp;
  console.log(
    `Swapped players: ${teamA[swap.aIndex].id} and ${teamB[swap.bIndex].id}`
  );
}

function swapKey(aIndex, bIndex) {
  return `${aIndex}-${bIndex}`;
}

function calculateNewDifference(teamA, teamB, aIndex, bIndex) {
  const hypotheticalTeamA = [...teamA];
  const hypotheticalTeamB = [...teamB];
  const temp = hypotheticalTeamA[aIndex];
  hypotheticalTeamA[aIndex] = hypotheticalTeamB[bIndex];
  hypotheticalTeamB[bIndex] = temp;

  const teamAScore = calculateTeamScore(hypotheticalTeamA);
  const teamBScore = calculateTeamScore(hypotheticalTeamB);
  return Math.abs(teamAScore - teamBScore);
}

async function performMatchmaking(session, interaction) {
  // await prepareSessionPlayers(session);

  const assignedPlayers = assignPlayersToRoles(session.players);
  console.log(assignedPlayers);

  session.teamA = {
    top: null,
    jungle: null,
    mid: null,
    bot: null,
    support: null,
  };
  session.teamB = {
    top: null,
    jungle: null,
    mid: null,
    bot: null,
    support: null,
  };

  const assignPlayerToTeam = (player) => {
    if (!session.teamA[player.assignedRole]) {
      session.teamA[player.assignedRole] = player;
    } else if (!session.teamB[player.assignedRole]) {
      session.teamB[player.assignedRole] = player;
    } else {
      console.warn(
        `Both teams already have a player for the role: ${player.assignedRole}. Consider handling this scenario.`
      );
    }
  };

  assignedPlayers.forEach(assignPlayerToTeam);

  session.teamA = Object.values(session.teamA).filter(
    (player) => player !== null
  );
  session.teamB = Object.values(session.teamB).filter(
    (player) => player !== null
  );
  balanceTeamsBySwappingPlayers(session.teamA, session.teamB);
  session.status = "in-progress";
  console.log("Matchmaking complete. Teams are balanced.");

  const teamAMessage = session.teamA
    .map((player) => `${player.summonerName}`)
    .join("\n");
  const teamBMessage = session.teamB
    .map((player) => `${player.summonerName}`)
    .join("\n");

  const embed = new EmbedBuilder()
    .setTitle("Matchmaking Complete: Teams are Balanced")
    .setColor("#0099ff")
    .addFields(
      { name: "Team A", value: teamAMessage, inline: true },
      { name: "Team B", value: teamBMessage, inline: true }
    )
    .setTimestamp();
  await interaction.followUp({ embeds: [embed] });
}

module.exports = {
  activeSessions,
  assignPlayersToRoles,
  performMatchmaking,
  calculatePlayerScore,
  calculateTeamScore,
  getRankValue,
  balanceTeamsBySwappingPlayers,
};
