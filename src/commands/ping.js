const { SlashCommandBuilder } = require('discord.js');

const COMMAND_IDENTIFIER = 'ping'

module.exports = {
	data: new SlashCommandBuilder()
		.setName(COMMAND_IDENTIFIER)
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
	key: COMMAND_IDENTIFIER
};
