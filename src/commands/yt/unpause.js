const { SlashCommandBuilder, Events } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')

const COMMAND_IDENTIFIER = 'unpause'

const execute = async (interaction) => {
	try {
		const { guildId } = interaction

		const connection = getVoiceConnection(guildId)

		const player = connection.state.subscription.player

		player.unpause()

		player.on(Events.Error, (error) => console.log({ error }))

		await interaction.reply('Unpause')
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(COMMAND_IDENTIFIER)
		.setDescription('Unpauses music!'),
	execute,
	key: COMMAND_IDENTIFIER
}
