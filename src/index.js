const dotenv = require('dotenv');
dotenv.config();

const { GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

const prefix = 'a!';

const fs = require('fs');
const path = require('path');

// Prefixed commands

client.prefixcommands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file =>  file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.prefixcommands.set(command.name, command);
}

// Slash commands

client.commands = new Discord.Collection();
const foldersPath = path.join(__dirname, 'slashCommands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// end of variable definitions

client.once('ready', () => {
    console.log('ArYorne bot is online!');
});

client.on('messageCreate', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        client.prefixcommands.get('help').execute(message, args, Discord);
    } else {
        client.prefixcommands.get(command).execute(message, args);
    } 
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration ({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.content.startsWith(prefix)) return;
  
	let conversationLog = [{ role: 'system', content: 'You are a friendly chatbot.' }];
  
	try {
	  await message.channel.sendTyping();
  
	  let prevMessages = await message.channel.messages.fetch({ limit: 15 });
	  prevMessages.reverse();
  
	  prevMessages.forEach((msg) => {
		if (message.content.startsWith('!')) return;
		if (msg.author.id !== client.user.id && message.author.bot) return;
		if (msg.author.id !== message.author.id) return;
  
		conversationLog.push({
		  role: 'user',
		  content: msg.content,
		});
	  });
  
	  const result = await openai
		.createChatCompletion({
		  model: 'gpt-3.5-turbo',
		  messages: conversationLog,
		  // max_tokens: 256, // limit token usage
		})
		.catch((error) => {
		  console.log(`OPENAI ERR: ${error}`);
		});
  
	  message.reply(result.data.choices[0].message);
	} catch (error) {
	  console.log(`ERR: ${error}`);
	}
  });

client.login(process.env.TOKEN);