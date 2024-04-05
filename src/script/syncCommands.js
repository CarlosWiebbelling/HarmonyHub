const { REST, Routes } = require('discord.js');
const commands = require('../commands')

const { token, clientId, guildId } = require('../config.json');

(async () => {
	try {
		const payload = []
		
		for (key in commands) {
			payload.push(commands[key].data.toJSON())
		}

		const rest = new REST().setToken(token);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: payload },
		);

		console.log(`Successfully sync ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
