const { SlashCommandBuilder, Events } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
const { gptKey } = require('../../config.json')
const OpenAI = require('openai')

const COMMAND_IDENTIFIER = 'search'

const PARAM_SEARCH = 'search'

const openai = new OpenAI({
  apiKey: gptKey,
});

const execute = async (interaction) => {
	try {
    const {
      options
    } = interaction

		const search = options.getString(PARAM_SEARCH)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": search
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!response.choices || !response.choices.length) {
      return
    }

    const [choice] = response.choices

    await interaction.reply(choice.message.content)
	} catch (error) {
		console.error(error)
    await interaction.reply('Error!')
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(COMMAND_IDENTIFIER)
		.setDescription('Searches prompt in in gpt 3.5-Turbo')
      .addStringOption(option =>
        option.setName(PARAM_SEARCH)
          .setDescription('Search')
          .setRequired(true)
      )
    ,
	execute,
	key: COMMAND_IDENTIFIER
}
