const { SlashCommandBuilder, Events } = require('discord.js');
const { NoSubscriberBehavior, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

const { validateInput } = require('../utils/input')

const COMMAND_IDENTIFIER = 'play'
const PARAM_INPUT = 'input'

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

		connection.subscribe(player);

		const input = options.getString(PARAM_INPUT)

		const { error, isLink, isSearch } = validateInput(input)

		let link = ''

		if (isLink) {
			link = input
		} else if (isSearch) {
			const list = await ytsr(input, { limit: 1 })

			if (!list.items && !list.length) {
				await interaction.reply('No match found');
				return
			}

			link = list.items[0].url
		} else if (error) {
			await interaction.reply('Invalid input');
			return
		}

		const stream = ytdl(link, { filter: 'audioonly' })

		const resource = createAudioResource(stream, { inlineVolume: true });

		resource.volume.setVolume(0.1);

		player.play(resource)

		player.on(Events.Error, (error) => console.log({ error }));

		await interaction.reply('Play!');
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName(COMMAND_IDENTIFIER)
		.setDescription('Plays music!')
		.addStringOption(option =>
			option.setName(PARAM_INPUT)
				.setDescription('Can be a YouTube link or a serch keyword (the first result will be played)')
				.setRequired(true)
		),
	execute,
	key: COMMAND_IDENTIFIER
};
