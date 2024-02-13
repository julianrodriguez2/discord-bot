/* const nodeCron = require("node-cron");
const {
  getSummonerIdByName,
  getCurrentGameBySummonerId,
} = require("../utilities/riotApi");
const User = require("../models/User");
const { client } = require("../index");
const BETTING_CHANNEL_ID = "YOUR_CHANNEL_ID_HERE";

// Function to announce game start and open betting
function announceGameStart(user) {
  const channel = client.channels.cache.get(BETTING_CHANNEL_ID);
  if (!channel) {
    console.error("Betting channel not found");
    return;
  }

  // Send a message to the channel to announce the game and start betting
  // Example message, customize as needed
  channel.send(
    `@here ${user.discordUsername} has started a League of Legends game! Place your bets now with /bet [amount] [win/lose]! Betting closes in 2 minutes.`
  );

  // Here, you would also start a mechanism to track bets for this game, and lock betting after 2 minutes
  // This might involve setting a timeout and updating a database record or in-memory store to indicate that betting is closed for this game
}

// Scheduled task to check the game status of registered players
nodeCron.schedule("/5 * * * *", async () => {
  console.log("Checking registered players for active games...");
  const registeredUsers = await User.findAll();

  for (const user of registeredUsers) {
    const summonerId = await getSummonerIdByName(
      user.summonerName,
      user.region
    );
    if (summonerId) {
      const gameInfo = await getCurrentGameBySummonerId(
        summonerId,
        user.region
      );
      if (gameInfo && !gameInfo.previouslyAnnounced) {
        // Assume we add a flag or method to check if the game has already been announced to avoid duplicate announcements
        announceGameStart(user, gameInfo);
        // Here you would mark the game as announced in your store to prevent re-announcement
      }
    }
  }
}); */
