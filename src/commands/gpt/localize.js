const { SlashCommandBuilder, Events } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
const { gptKey } = require('../../config.json')
const OpenAI = require('openai')

const COMMAND_IDENTIFIER = 'translate'

const PARAM_LANG = 'lang'
const PARAM_MESSAGE = 'message'

const getPropt = (lang, message) => {
  return `Translate this: "${message}" to "${lang}" language`
}

const openai = new OpenAI({
  apiKey: gptKey,
});

const execute = async (interaction) => {
	try {
    const {
      options
    } = interaction

		const lang = options.getString(PARAM_LANG)
		const message = options.getString(PARAM_MESSAGE)

    const propt = getPropt(lang, message)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": propt
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

    await interaction.reply(
      `Translating your message to ${lang}:\n\n${choice.message.content}`
    )
	} catch (error) {
		console.error(error)
    await interaction.reply('Error!')
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(COMMAND_IDENTIFIER)
		.setDescription('Plays music!')
      .addStringOption(option =>
        option.setName(PARAM_LANG)
          .setDescription('Language to translate to')
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName(PARAM_MESSAGE)
          .setDescription('Your message to translate')
          .setRequired(true)
          .setMaxLength(220)
      )
    ,
	execute,
	key: COMMAND_IDENTIFIER
}
