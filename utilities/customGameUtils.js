const activeSessions = new Map();

function performMatchmaking(session) {
  const shuffledPlayers = [...session.players].sort(() => 0.5 - Math.random());
  session.teamA = shuffledPlayers
    .slice(0, 5)
    .map((player) => player.summonerId);
  session.teamB = shuffledPlayers
    .slice(5, 10)
    .map((player) => player.summonerId);
  session.status = "in-progress";
  console.log("Matchmaking performed.");
}

module.exports = { activeSessions, performMatchmaking };
