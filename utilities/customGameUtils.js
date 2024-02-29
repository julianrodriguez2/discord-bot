const activeSessions = new Map();

function performMatchmaking(session) {
  const shuffled = session.players.sort(() => 0.5 - Math.random());
  session.teamA = shuffled.slice(0, 5);
  session.teamB = shuffled.slice(5, 10);
  session.status = "in-progress";
}

module.exports = { activeSessions, performMatchmaking };
