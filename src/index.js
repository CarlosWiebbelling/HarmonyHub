const { Client, GatewayIntentBits, Events } = require('discord.js');

const config = require('./config.json');

const { mapInteraction, interactions } = require('./commands/utils/mapInteractions.js')

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interactions.includes(interaction.commandName)) {
    return
  }

  console.log(interaction.commandName);

  const execute = mapInteraction(interaction.commandName)

  execute(interaction)
});

client.login(config.token);
