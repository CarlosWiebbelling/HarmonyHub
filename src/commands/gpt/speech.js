const { SlashCommandBuilder, Events } = require('discord.js')
const { NoSubscriberBehavior, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { Readable } = require('stream');

const OpenAI = require('openai')
const { gptKey } = require('../../config.json')

const COMMAND_IDENTIFIER = 'speech'

const PARAM_LANG = 'lang'
const PARAM_MESSAGE = 'message'
const PARAM_VOICE = 'voice'

const getPropt = (lang, message) => {
  return `Translate this: "${message}" to "${lang}" language`
}

const openai = new OpenAI({
  apiKey: gptKey,
});

const execute = async (interaction) => {
	try {
		const {
			channelId,
			guildId,
			guild: { voiceAdapterCreator },
			options
		} = interaction;

		const connection = joinVoiceChannel({
			channelId: channelId,
			guildId: guildId,
			adapterCreator: voiceAdapterCreator
		});

    const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
				maxMissedFrames: 250,
			},
		});

    interaction.deferReply()

		connection.subscribe(player);

		const lang = options.getString(PARAM_LANG)
		const voice = options.getString(PARAM_VOICE)
		const message = options.getString(PARAM_MESSAGE)

    const propt = getPropt(lang, message)

    // translate to desired lang
    const translate = await openai.chat.completions.create({
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

    if (!translate.choices || !translate.choices.length) {
      return
    }

    const [choice] = translate.choices

    const { content } = choice.message

    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: content,
    });

    const readableStream = new Readable();

    const audioBuffer = await speech.arrayBuffer();
    const speechBuffer = Buffer.from(audioBuffer);

    readableStream.push(speechBuffer);
    readableStream.push(null); 

		const resource = createAudioResource(readableStream, { inlineVolume: true });

		resource.volume.setVolume(0.5);
    
    interaction.editReply('Playing')

		player.play(resource)

		player.on(Events.Error, (error) => console.log({ error }));
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
      .addStringOption(option =>
        option.setName(PARAM_VOICE)
          .setDescription('Woman or man?')
          .addChoices(
            { name: 'Woman', value: 'nova' },
            { name: 'Man', value: 'onyx' },
          )
      )
    ,
	execute,
	key: COMMAND_IDENTIFIER
}
