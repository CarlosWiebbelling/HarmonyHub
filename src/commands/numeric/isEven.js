const { SlashCommandBuilder } = require('discord.js')

const COMMAND_IDENTIFIER = 'even'

const PARAM_NUMBER = 'number'

const execute = async (interaction) => {
	try {
		const {
      options
		} = interaction;

  const number = options.getString(PARAM_NUMBER)

  await interaction.reply(String(number % 2 === 0))
	} catch (error) {
		console.error(error)
    await interaction.reply('Error!')
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(COMMAND_IDENTIFIER)
		.setDescription('Returns if number is Even (par)')
      .addStringOption(option =>
        option.setName(PARAM_NUMBER)
          .setDescription('Number to validate')
          .setRequired(true)
      ),
	execute,
	key: COMMAND_IDENTIFIER
}
